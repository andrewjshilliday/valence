import axios from 'axios';
declare const MusicKit: any;
const VALENCE_API = import.meta.env.VITE_VALENCE_API;

interface ValenceApiService {
  Album: (id: string) => Promise<any>;
  Albums: (ids: string[]) => Promise<any[]>;
  Artist: (id: string, imageOnly?: boolean) => Promise<any>;
  Artists: (ids: string[], include?: string) => Promise<any[]>;
  Playlist: (id: string) => Promise<any>;
  Playlists: (ids: string[]) => Promise<any[]>;
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

const Album = async (id: string): Promise<any> => {
  const url = `${VALENCE_API}/albums`;
  let params: MusicKit.QueryParameters = {
    storefront: MusicKit.getInstance().storefrontId,
    ids: id
  };

  const resp = await axios.get(url, { params: params });
  return resp.data.albums[0];
};

const Albums = async (ids: string[]): Promise<any> => {
  const url = `${VALENCE_API}/artists`;
  let params: MusicKit.QueryParameters = {
    storefront: MusicKit.getInstance().storefrontId,
    ids: ids.join(',')
  };

  const resp = await axios.get(url, { params: params });
  return resp.data.albums;
};

const Artist = async (id: string, imageOnly?: boolean): Promise<any> => {
  const url = `${VALENCE_API}/artists`;
  let params: MusicKit.QueryParameters = {
    storefront: MusicKit.getInstance().storefrontId,
    ids: id
  };

  if (imageOnly) {
    params.imageOnly = imageOnly;
  }

  const resp = await axios.get(url, { params: params });
  return resp.data.artists[0];
};

const Artists = async (ids: string[], imageOnly?: string): Promise<any> => {
  const url = `${VALENCE_API}/artists`;
  let params: MusicKit.QueryParameters = {
    storefront: MusicKit.getInstance().storefrontId,
    ids: ids.join(',')
  };

  if (imageOnly) {
    params.imageOnly = imageOnly;
  }

  const resp = await axios.get(url, { params: params });
  return resp.data.artists;
};

const Playlist = async (id: string): Promise<any> => {
  const url = `${VALENCE_API}/playlists`;
  let params: MusicKit.QueryParameters = {
    storefront: MusicKit.getInstance().storefrontId,
    ids: id
  };

  const resp = await axios.get(url, { params: params });
  return resp.data.playlists[0];
};

const Playlists = async (ids: string[]): Promise<any> => {
  const url = `${VALENCE_API}/playlists`;
  let params: MusicKit.QueryParameters = {
    storefront: MusicKit.getInstance().storefrontId,
    ids: ids.join(',')
  };

  const resp = await axios.get(url, { params: params });
  return resp.data.playlists;
};

const ValenceApiService: ValenceApiService = {
  Album,
  Albums,
  Artist,
  Artists,
  Playlist,
  Playlists
};

export default ValenceApiService;
