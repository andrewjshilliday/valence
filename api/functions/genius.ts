import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';
import 'source-map-support/register';

const API_ROOT = "https://api.genius.com";
const PUBLIC_API_ROOT = "https://genius.com/api";
const ACCESS_TOKEN = process.env.GENIUS_ACCESS_TOKEN;

export const song: APIGatewayProxyHandler = async (event, _context): Promise<APIGatewayProxyResult> => {
  const artist = event.queryStringParameters["artist"];
  const song = event.queryStringParameters["song"];
  const includeLyrics = (event.queryStringParameters["includeLyrics"] == 'true');

	const response = await getSong(artist, song, includeLyrics);

	if (response) {
		return sendRes(200, JSON.stringify({ song: response }));
	}

	return sendRes(404, JSON.stringify({ error: 'Requested song not found' }));
}

const sendRes = (status: number, body: string): APIGatewayProxyResult => {
  return {
    statusCode: status,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: body
  };
}

const getSong = async (artistName: string, songName: string, includeLyrics: boolean): Promise<Genius.Song> => {
	const songHit = await search(artistName, songName);

	if (!songHit) { return null; }

	const song = await getSongDetail(songHit.result.id);

	if (includeLyrics) {
		song.lyrics = await retrieveLyrics(song.id, song.writer_artists);
	}

	return song;
}

const search = async (artistName: string, songName: string): Promise<Genius.Hit> => {
  const url = `${API_ROOT}/search?access_token=${ACCESS_TOKEN}&q=${artistName + ' ' + songName}`;
  let response: Genius.GeniusResponse;

  await axios(url)
    .then(res => {
      response = res.data;
    })
    .catch(console.error);

  const songHit = findSongHit(response.response.hits, artistName, songName);

  return songHit;
}

const getSongDetail = async (id: number): Promise<Genius.Song> => {
	const url = `${API_ROOT}/songs/${id}?access_token=${ACCESS_TOKEN}`;
	let response: Genius.GeniusResponse;

	await axios(url)
		.then(res => {
			response = res.data;
		})
		.catch(console.error);
	
	return response.response.song;
}

const findSongHit = (hits: Genius.Hit[], searchArtist: string, searchSong: string): Genius.Hit => {
	searchArtist = searchArtist.toLowerCase();
	searchSong = searchSong.toLowerCase();
	let hitArtist: string
  let hitSong: string;

  for (let hit of hits) {
		hitArtist = (hit.result as Genius.Song).primary_artist.name.toLowerCase();
		hitSong = (hit.result as Genius.Song).title.toLowerCase();

		if (hitArtist.includes(searchArtist) && hitSong.includes(searchSong)) {
			return hit;
		}

		if (searchArtist.includes('&')) {
			if (matchCollabArtists(hitArtist, searchArtist) && hitSong.includes(searchSong)) {
				return hit;
			}
		}
  }

	for (let hit of hits) {
		hitArtist = (hit.result as Genius.Song).primary_artist.name.toLowerCase();
		hitSong = (hit.result as Genius.Song).title.toLowerCase();

		const regExp = new RegExp('\((.+?)\)|\[(.+?)\]|{(.+?)}');
		const hitArtistNoParentheses = hitArtist.replace(regExp, '').trim();
		const searchArtistNoParentheses = searchArtist.replace(regExp, '').trim();
		const hitSongNoParentheses = hitSong.replace(regExp, '').trim();
		const songNoParentheses = searchSong.replace(regExp, '').trim();

		if (hitArtistNoParentheses.includes(searchArtistNoParentheses) && hitSongNoParentheses.includes(songNoParentheses)) {
			return hit;
		}

		if (searchArtist.includes('&')) {
			if (matchCollabArtists(hitArtistNoParentheses, searchArtistNoParentheses) && hitSongNoParentheses.includes(songNoParentheses)) {
				return hit;
			}
		}
  };

	for (let hit of hits) {
		hitArtist = (hit.result as Genius.Song).primary_artist.name.toLowerCase();
		hitSong = (hit.result as Genius.Song).title.toLowerCase();

		let regExp = new RegExp(`\((.+?)\)|\[(.+?)\]|{(.+?)}`);
		const hitArtistNoParentheses = hitArtist.replace(regExp, '').trim();
		const searchArtistNoParentheses = searchArtist.replace(regExp, '').trim();
		const hitSongNoParentheses = hitSong.replace(regExp, '').trim();
		const searchSongNoParentheses = searchSong.replace(regExp, '').trim();

		regExp = new RegExp(`[^a-z0-9]+`);
		const hitArtistAlphanumeric = hitArtistNoParentheses.replace(regExp, '').trim();
		const searchArtistAlphanumeric = searchArtistNoParentheses.replace(regExp, '').trim();
		const hitSongAlphanumeric = hitSongNoParentheses.replace(regExp, '').trim();
		const searchSongAlphanumeric = searchSongNoParentheses.replace(regExp, '').trim();

		if (hitArtistAlphanumeric.includes(searchArtistAlphanumeric) && hitSongAlphanumeric.includes(searchSongAlphanumeric)) {
			return hit;
		}

		if (searchArtist.includes('&')) {
			if (matchCollabArtists(hitArtistAlphanumeric, searchArtistAlphanumeric) && hitSongAlphanumeric.includes(searchSongAlphanumeric)) {
				return hit;
			}
		}
	};

	return null;
}

const matchCollabArtists = (hitArtist: string, artists: string): boolean => {
	const collabArtists = artists.split('&');
	let foundMatch: boolean;

	collabArtists.forEach((collabArtist: string) => {
		collabArtist = collabArtist.trim();

		if (hitArtist.includes(collabArtist)) {
			foundMatch = true;
			return;
		}
	});

	return foundMatch;
}

const retrieveLyrics = async (id: number, writtenBy: Genius.Artist[]): Promise<string> => {
  const url = `https://genius.com/songs/${id}/embed.js`;
  let lyrics: string;

  await axios(url)
    .then(res => {
      lyrics = res.data;
    })
    .catch(() => {
			lyrics = 'Lyrics unavailble';
			return lyrics;
		});

	if (lyrics.length === 0 || lyrics === ' ') {
		lyrics = "Lyrics unavailable"
		return lyrics;
	}

	lyrics = lyrics.replace(new RegExp(`.+?('\\)\\) {)`), '');
	lyrics = lyrics.replace(new RegExp(`.+?(type="text\\/css" \\/>'\\))`), '');
	lyrics = lyrics.replace(new RegExp(`.+?(rg_embed_body\\\\\\\\\\\\\">)`), '');
	lyrics = lyrics.match(new RegExp(`.+?(<\\\\\\/div>)`))[0];
	lyrics = lyrics.replace(/<[^>]*>/g, '');
	lyrics = lyrics.replace(/\\\\n/g, '|n');
	lyrics = lyrics.replace(/\\/g, '');
	lyrics = lyrics.replace(/\|n/g, '\n');
	lyrics = lyrics.replace(/&amp;/g, '&');
	lyrics = lyrics.trim();

	if (writtenBy.length > 0) {
		lyrics += "\n\nWritten By:\n"

		for (let writer of writtenBy) {
			lyrics += writer.name
			if (writer.name !== writtenBy[writtenBy.length-1].name) {
				lyrics += ", "
			}
		}
	}

	return lyrics;
}
