import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import axios from "axios";
import "source-map-support/register";

const API_ROOT = "https://api.genius.com";
const PUBLIC_API_ROOT = "https://genius.com/api";
const ACCESS_TOKEN = process.env.GENIUS_ACCESS_TOKEN;

export const artist: APIGatewayProxyHandler = async (
  event,
  _context
): Promise<APIGatewayProxyResult> => {
  const name = event.queryStringParameters["name"];

  const response = await getArtist(name);

  if (response) {
    return sendRes(200, JSON.stringify({ artist: response }));
  }

  return sendRes(404, JSON.stringify({ error: "Requested artist not found" }));
};

const sendRes = (status: number, body: string): APIGatewayProxyResult => {
  return {
    statusCode: status,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: body,
  };
};

const getArtist = async (name: string): Promise<Genius.Artist> => {
  const result = await search(name);

  if (!result) {
    return null;
  }

  const artist = await getArtistDetail(result.id);

  return artist;
};

const search = async (name: string): Promise<Genius.Artist | Genius.Song> => {
  const url = `${PUBLIC_API_ROOT}/search/artist?q=${name}`;
  let response: Genius.GeniusResponse;

  await axios(url)
    .then((res) => {
      response = res.data;
    })
    .catch(console.error);

  const match = findMatch(response.response.sections[0].hits, name);

  return match;
};

const getArtistDetail = async (id: number): Promise<Genius.Artist> => {
  const url = `${PUBLIC_API_ROOT}/artists/${id}`;
  // const url = `${API_ROOT}/artists/${id}?access_token=${ACCESS_TOKEN}`;
  let response: Genius.GeniusResponse;

  await axios(url)
    .then((res) => {
      response = res.data;
    })
    .catch(console.error);

  return response.response.artist;
};

const findMatch = (hits: Genius.Hit[], searchName: string): Genius.Artist => {
  searchName = searchName.toLowerCase();
  let hitArtist: string;

  for (let hit of hits) {
    hitArtist = (hit.result as Genius.Artist).name.toLowerCase();

    if (hitArtist === searchName) {
      return hit.result as Genius.Artist;
    }

    if (hitArtist.includes(searchName) && !hitArtist.includes("&")) {
      return hit.result as Genius.Artist;
    }
  }

  /* for (let hit of hits) {
    hitArtist = hit.result.primary_artist.name.toLowerCase();

    const regExp = new RegExp("((.+?))|[(.+?)]|{(.+?)}");
    const hitArtistNoParentheses = hitArtist.replace(regExp, "").trim();
    const searchArtistNoParentheses = searchName.replace(regExp, "").trim();

    if (hitArtistNoParentheses.includes(searchArtistNoParentheses)) {
      return hit;
    }

    if (searchName.includes("&")) {
      if (
        matchCollabArtists(hitArtistNoParentheses, searchArtistNoParentheses)
      ) {
        return hit;
      }
    }
  }

  for (let hit of hits) {
    hitArtist = hit.result.primary_artist.name.toLowerCase();

    let regExp = new RegExp(`\((.+?)\)|\[(.+?)\]|{(.+?)}`);
    const hitArtistNoParentheses = hitArtist.replace(regExp, "").trim();
    const searchArtistNoParentheses = searchName.replace(regExp, "").trim();

    regExp = new RegExp(`[^a-z0-9]+`);
    const hitArtistAlphanumeric = hitArtistNoParentheses
      .replace(regExp, "")
      .trim();
    const searchArtistAlphanumeric = searchArtistNoParentheses
      .replace(regExp, "")
      .trim();

    if (hitArtistAlphanumeric.includes(searchArtistAlphanumeric)) {
      return hit;
    }

    if (searchName.includes("&")) {
      if (matchCollabArtists(hitArtistAlphanumeric, searchArtistAlphanumeric)) {
        return hit;
      }
    }
  } */

  return null;
};

/* const matchCollabArtists = (hitArtist: string, artists: string): boolean => {
  const collabArtists = artists.split("&");
  let foundMatch: boolean;

  collabArtists.forEach((collabArtist: string) => {
    collabArtist = collabArtist.trim();

    if (hitArtist.includes(collabArtist)) {
      foundMatch = true;
      return;
    }
  });

  return foundMatch;
}; */
