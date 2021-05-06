import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';
import * as cheerio from 'cheerio';
import 'source-map-support/register';

export const playlists: APIGatewayProxyHandler = async (event, _context): Promise<APIGatewayProxyResult> => {
  const storefront = event.queryStringParameters["storefront"];
  const paramIds = event.queryStringParameters["ids"];
  let ids: string[] = [];
  if (paramIds !== "") {
    ids = paramIds.split(",");
  }

	const response = await getPlaylists(ids, storefront);

	if (response) {
		return sendRes(200, JSON.stringify({ playlists: response }));
	}

	return sendRes(404, JSON.stringify({ error: 'Requested playlists not found' }));
}

const sendRes = (status: number, body: string): APIGatewayProxyResult => {
  return {
    statusCode: status,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: body
  };
}

const getPlaylists = async (ids: string[], storefront: string): Promise<AppleMusic.Album[]> => {
  const playlists: AppleMusic.Album[] = [];
  await Promise.all(ids.map(async (id) => {
    const playlist = await getPlaylist(id, storefront);
    if (playlist) { playlists.push(playlist); }
  }));

  return playlists;
}

const getPlaylist = async (id: string, storefront: string): Promise<AppleMusic.Album> => {
  const url = `https://itunes.apple.com/${storefront}/playlist/${id}`;
  let playlist: AppleMusic.Album;

  await axios(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      const script = $("script[id='shoebox-media-api-cache-amp-music']")[0].children[0].data;

      if (script) {
        const parsedScript = JSON.parse(script);
        const secondKey = Object.keys(parsedScript)[1];
        const secondObject = JSON.parse(parsedScript[secondKey]);
        const playlistDataKey = Object.keys(secondObject)[1];
        playlist = secondObject[playlistDataKey][0];
      }
    })
    .catch(() => {
      return null;
    });

  return playlist;
}
