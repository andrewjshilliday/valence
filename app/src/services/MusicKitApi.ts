import axios from 'axios';
declare const MusicKit: any;
const APPLE_MUSIC_API = 'https://api.music.apple.com';

type IncludeTypes = 'songs' | 'artists' | 'albums' | 'playlists';

interface MusicKitApiService {
  Artist: (id: string, include?: string) => Promise<MusicKit.MediaItem>;
  Artists: (ids: string[], include?: string) => Promise<MusicKit.MediaItem[]>;
  Album: (id: string, include?: string) => Promise<MusicKit.MediaItem>;
  Albums: (ids: string[], include?: string) => Promise<MusicKit.MediaItem[]>;
  Playlist: (id: string, include?: string) => Promise<MusicKit.MediaItem>;
  Playlists: (ids: string[], include?: string) => Promise<MusicKit.MediaItem[]>;
  Songs: (ids: string[], include?: string) => Promise<MusicKit.MediaItem[]>;
  Search: (term: string, types?: string, limit?: number) => Promise<MusicKit.Resource>;
  GetRelationships: (collection: MusicKit.MediaItem[], type: string) => any;
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

const GetRelationships = async (collection: MusicKit.MediaItem[], type: string): Promise<MusicKit.MediaItem[]> => {
  if (!collection) {
    return [];
  }
  collection = [...collection];

  let ids: string[];
  let results: MusicKit.Resource[];

  switch (type) {
    case 'albums': {
      ids = collection.filter((i: MusicKit.MediaItem) => i.type === 'albums').map((i: MusicKit.MediaItem) => i.id);

      if (!ids || ids.length === 0) {
        return [];
      }

      await Albums(ids, 'artists').then((res) => {
        results = res;

        for (const item of collection.filter((i: MusicKit.MediaItem) => i.type === 'albums')) {
          let index = 0;

          for (const result of results) {
            if (item.id === result.id && result.relationships.artists.data.length) {
              collection.filter((i: MusicKit.MediaItem) => i.type === 'albums')[index].relationships =
                result.relationships;
              break;
            }

            index++;
          }
        }
      });

      return collection;
    }
    case 'playlists': {
      ids = collection.filter((i: MusicKit.MediaItem) => i.type === 'playlists').map((i: MusicKit.MediaItem) => i.id);

      if (!ids || ids.length === 0) {
        return [];
      }

      await Playlists(ids, 'curators').then((res) => {
        results = res;

        for (const item of collection.filter((i: MusicKit.MediaItem) => i.type === 'playlists')) {
          let index = 0;

          for (const result of results) {
            if (item.id === result.id && result.relationships.curator.data.length) {
              collection.filter((i: MusicKit.MediaItem) => i.type === 'playlists')[index].relationships =
                result.relationships;
              break;
            }

            index++;
          }
        }
      });

      return collection;
    }
    case 'songs': {
      ids = collection.map((i) => i.id);

      if (!ids || ids.length === 0) {
        return [];
      }

      await Songs(ids, 'artists,albums').then((res) => {
        results = res;

        for (const item of collection) {
          for (const result of results) {
            if (item.id === result.id) {
              item.relationships = result.relationships;
              break;
            }
          }
        }
      });

      return collection;
    }
  }

  return [];
};

export const MusicKitApiService: MusicKitApiService = {
  Artist,
  Artists,
  Album,
  Albums,
  Playlist,
  Playlists,
  Songs,
  Search,
  GetRelationships
};
