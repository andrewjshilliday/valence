import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';
import * as cheerio from 'cheerio';
import 'source-map-support/register';

export const albums: APIGatewayProxyHandler = async (event, _context): Promise<APIGatewayProxyResult> => {
  const storefront = event.queryStringParameters["storefront"];
  const paramIds = event.queryStringParameters["ids"];
  let ids: string[] = [];
  if (paramIds !== "") {
    ids = paramIds.split(",");
  }

	const response = await getAlbums(ids, storefront);

	if (response) {
		return sendRes(200, JSON.stringify({ albums: response }));
	}

	return sendRes(404, JSON.stringify({ error: 'Requested albums not found' }));
}

const sendRes = (status: number, body: string): APIGatewayProxyResult => {
  return {
    statusCode: status,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: body
  };
}

const getAlbums = async (ids: string[], storefront: string): Promise<AppleMusic.Album[]> => {
  const albums: AppleMusic.Album[] = [];
  await Promise.all(ids.map(async (id) => {
    const album = await getAlbum(id, storefront);
    if (album) { albums.push(album); }
  }));

  return albums;
}

const getAlbum = async (id: string, storefront: string): Promise<AppleMusic.Album> => {
  const url = `https://itunes.apple.com/${storefront}/album/${id}`;
  let album: AppleMusic.Album;

  await axios(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      const script = $("script[id='shoebox-media-api-cache-amp-music']")[0].children[0].data;

      if (script) {
        const parsedScript = JSON.parse(script);
        const secondKey = Object.keys(parsedScript)[1];
        const secondObject = JSON.parse(parsedScript[secondKey]);
        const albumDataKey = Object.keys(secondObject)[1];
        album = secondObject[albumDataKey][0];
      }
    })
    .catch(() => {
      return null;
    });

  return album;
}
