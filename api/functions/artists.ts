import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';
import * as cheerio from 'cheerio';
import 'source-map-support/register';

export const artists: APIGatewayProxyHandler = async (event, _context): Promise<APIGatewayProxyResult> => {
  const storefront = event.queryStringParameters["storefront"];
  const paramIds = event.queryStringParameters["ids"];
  const imageOnly = (event.queryStringParameters["imageOnly"] == 'true');
  let ids: string[] = [];
  if (paramIds !== "") {
    ids = paramIds.split(",");
  }

	const response = await getArtists(ids, storefront, imageOnly);

	if (response) {
		return sendRes(200, JSON.stringify({ artists: response }));
	}

	return sendRes(404, JSON.stringify({ error: 'Requested artists not found' }));
}

const sendRes = (status: number, body: string): APIGatewayProxyResult => {
  return {
    statusCode: status,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: body
  };
}

const getArtists = async (ids: string[], storefront: string, imageOnly: boolean): Promise<AppleMusic.Artist[]> => {
  const artists: AppleMusic.Artist[] = [];
  await Promise.all(ids.map(async (id) => {
    const artist = await getArtist(id, storefront, imageOnly);
    if (artist) { artists.push(artist); }
  }));

  return artists;
}

const getArtist = async (id: string, storefront: string, imageOnly: boolean): Promise<AppleMusic.Artist> => {
  const url = `https://music.apple.com/${storefront}/artist/${id}`;
  let artist: AppleMusic.Artist;

  await axios(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);

      if (!imageOnly) {
        const script = $("script[id='shoebox-media-api-cache-amp-music']")[0].children[0].data;

        if (script) {
          const parsedScript = JSON.parse(script);
          const secondKey = Object.keys(parsedScript)[1];
          const secondObject = JSON.parse(parsedScript[secondKey]);
          const artistDataKey = Object.keys(secondObject)[1];
          artist = secondObject[artistDataKey][0];
        }
      }

      if (imageOnly) {
        const image = $("meta[name='twitter:image']").attr('content');
        if (image) {
          artist = {
            id: id,
            attributes: {
              artwork: {
                width: 800,
                height: 800,
                url: `${image.substring(0, image.lastIndexOf('/'))}/{w}x{h}bb.jpeg`
              },
              url: `https://music.apple.com/${storefront}/artist/${id}`
            }
          };
        }
      }
    })
    .catch(console.error);

  return artist;
}
