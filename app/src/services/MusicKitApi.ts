import axios, { AxiosResponse } from 'axios';
import cloneDeep from 'lodash.clonedeep';
declare const MusicKit: any;
const APPLE_MUSIC_API = import.meta.env.SNOWPACK_PUBLIC_MUSICKIT_API;

type IncludeTypes = 'songs' | 'artists' | 'albums' | 'playlists';

interface MusicKitApiService {
  Artist: (id: string, include?: string) => Promise<MusicKit.MediaItem>;
  Artists: (ids: string[], include?: string) => Promise<MusicKit.MediaItem[]>;
  Album: (id: string, include?: string) => Promise<MusicKit.MediaItem>;
  Albums: (ids: string[], include?: string) => Promise<MusicKit.MediaItem[]>;
  HeavyRotation: () => Promise<MusicKit.Resource>;
  Playlist: (id: string, include?: string) => Promise<MusicKit.MediaItem>;
  Playlists: (ids: string[], include?: string) => Promise<MusicKit.MediaItem[]>;
  RecentPlayed: (nextUrl?: string) => Promise<MusicKit.Resource>;
  Recommendations: () => Promise<any>;
  Resource: (url: string) => Promise<MusicKit.Resource>;
  Songs: (ids: string[], include?: string) => Promise<MusicKit.MediaItem[]>;
  Search: (term: string, types?: string, limit?: number) => Promise<MusicKit.Resource>;
  GetRelationships: (collection: MusicKit.MediaItem[]) => Promise<MusicKit.MediaItem[]>;
}

const GetHeaders = () => {
  const musicKit = MusicKit.getInstance();

  return {
    Authorization: `Bearer ${musicKit.developerToken}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Music-User-Token': musicKit.musicUserToken
  };
};

const Artist = async (id: string, include?: string): Promise<MusicKit.MediaItem> => {
  const url = `${APPLE_MUSIC_API}/v1/catalog/${MusicKit.getInstance().storefrontId}/artists/${id}`;
  let params: MusicKit.QueryParameters = {};

  if (include) {
    params.include = include;
  }

  const resp = await axios.get(url, { headers: GetHeaders(), params: params });
  return resp.data.data[0];
};

const Artists = async (ids: string[], include?: string): Promise<MusicKit.MediaItem[]> => {
  const url = `${APPLE_MUSIC_API}/v1/catalog/${MusicKit.getInstance().storefrontId}/artists`;
  let response: MusicKit.MediaItem[] = [];
  const limit = 30;
  let startPosition = 0;

  while (ids[startPosition]) {
    let params: MusicKit.QueryParameters = {
      ids: ids.slice(startPosition, startPosition + limit).join(',')
    };

    if (include) {
      params.include = include;
    }

    const resp = await axios.get(url, { headers: GetHeaders(), params: params });
    response = [...response, ...resp.data.data];
    startPosition = startPosition + limit;
  }
  return response;
};

const Album = async (id: string, include?: string): Promise<MusicKit.MediaItem> => {
  const url = `${APPLE_MUSIC_API}/v1/catalog/${MusicKit.getInstance().storefrontId}/albums/${id}`;
  let params: MusicKit.QueryParameters = {};

  if (include) {
    params.include = include;
  }

  const resp = await axios.get(url, { headers: GetHeaders(), params: params });
  return resp.data.data[0];
};

const Albums = async (ids: string[], include?: string): Promise<MusicKit.MediaItem[]> => {
  const url = `${APPLE_MUSIC_API}/v1/catalog/${MusicKit.getInstance().storefrontId}/albums`;
  let params: MusicKit.QueryParameters = {
    ids: ids.join(',')
  };

  if (include) {
    params.include = include;
  }

  const resp = await axios.get(url, { headers: GetHeaders(), params: params });
  return resp.data.data;
};

const HeavyRotation = async (): Promise<MusicKit.Resource> => {
  const url = `${APPLE_MUSIC_API}/v1/me/history/heavy-rotation`;

  const resp = await axios.get(url, { headers: GetHeaders() });
  return resp.data;
};

const Playlist = async (id: string, include?: string): Promise<MusicKit.MediaItem> => {
  const url = `${APPLE_MUSIC_API}/v1/catalog/${MusicKit.getInstance().storefrontId}/playlists/${id}`;
  let params: MusicKit.QueryParameters = {};

  if (include) {
    params.include = include;
  }

  const resp = await axios.get(url, { headers: GetHeaders(), params: params });
  return resp.data.data[0];
};

const Playlists = async (ids: string[], include?: string): Promise<MusicKit.MediaItem[]> => {
  const url = `${APPLE_MUSIC_API}/v1/catalog/${MusicKit.getInstance().storefrontId}/playlists`;
  let params: MusicKit.QueryParameters = {
    ids: ids.join(',')
  };

  if (include) {
    params.include = include;
  }

  const resp = await axios.get(url, { headers: GetHeaders(), params: params });
  return resp.data.data;
};

const RecentPlayed = async (nextUrl?: string): Promise<MusicKit.Resource> => {
  const url = `${APPLE_MUSIC_API}${nextUrl ?? '/v1/me/recent/played'}`;

  const resp = await axios.get(url, { headers: GetHeaders() });
  return resp.data;
};

const Recommendations = async (): Promise<any> => {
  const url = `${APPLE_MUSIC_API}/v1/me/recommendations`;

  const resp = await axios.get(url, { headers: GetHeaders() });
  return resp.data.data;
};

const Resource = async (resourceUrl: string): Promise<MusicKit.Resource> => {
  const source = axios.CancelToken.source();
  const promise: any = axios.get(`${APPLE_MUSIC_API}${resourceUrl}`, { headers: GetHeaders() });
  promise.cancel = () => source.cancel(`Request to ${resourceUrl} cancelled`);
  const resp = await promise;
  return resp.data;
};

const Songs = async (ids: string[], include?: string): Promise<MusicKit.MediaItem[]> => {
  const url = `${APPLE_MUSIC_API}/v1/catalog/${MusicKit.getInstance().storefrontId}/songs`;
  let params: MusicKit.QueryParameters = {
    ids: ids.join(',')
  };

  if (include) {
    params.include = include;
  }

  const resp = await axios.get(url, { headers: GetHeaders(), params: params });
  return resp.data.data;
};

const Search = async (term: string, types?: string, limit?: number): Promise<MusicKit.Resource> => {
  const url = `${APPLE_MUSIC_API}/v1/catalog/${MusicKit.getInstance().storefrontId}/search`;
  let params: MusicKit.QueryParameters = {
    term: term
  };

  if (types) {
    params.types = types;
  }
  if (limit) {
    params.limit = limit.toString();
  }

  const resp = await axios.get(url, { headers: GetHeaders(), params: params });
  return resp.data.results;
};

const GetRelationships = async (collection: MusicKit.MediaItem[]): Promise<MusicKit.MediaItem[]> => {
  if (!collection) {
    return [];
  }
  collection = cloneDeep(collection);

  const albumsIds = collection
    .filter((item: MusicKit.MediaItem) => item.type === 'albums')
    .map((item: MusicKit.MediaItem) => item.id);
  const playlistIds = collection
    .filter((item: MusicKit.MediaItem) => item.type === 'playlists')
    .map((item: MusicKit.MediaItem) => item.id);
  const songIds = collection
    .filter((item: MusicKit.MediaItem) => item.type === 'songs')
    .map((item: MusicKit.MediaItem) => item.id);

  const albumsPromise = albumsIds?.length > 0 ? Albums(albumsIds, 'artists') : null;
  const playlistsPromise = playlistIds?.length > 0 ? Playlists(playlistIds, 'curators') : null;
  const songsPromise = songIds?.length > 0 ? Songs(songIds, 'artists,albums') : null;

  const results = await Promise.all([albumsPromise, playlistsPromise, songsPromise]);

  collection.map((item: MusicKit.MediaItem) => {
    switch (item.type) {
      case 'albums':
        item.relationships = results[0]?.find((i: MusicKit.MediaItem) => i.id === item.id)?.relationships;
        break;
      case 'playlists':
        item.relationships = results[1]?.find((i: MusicKit.MediaItem) => i.id === item.id)?.relationships;
        break;
      case 'songs':
        item.relationships = results[2]?.find((i: MusicKit.MediaItem) => i.id === item.id)?.relationships;
        break;
    }
  });

  return collection;
};

const MusicKitApiService: MusicKitApiService = {
  Artist,
  Artists,
  Album,
  Albums,
  HeavyRotation,
  Playlist,
  Playlists,
  RecentPlayed,
  Recommendations,
  Resource,
  Songs,
  Search,
  GetRelationships
};

export default MusicKitApiService;
