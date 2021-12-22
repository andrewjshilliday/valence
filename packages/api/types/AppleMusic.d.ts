declare module AppleMusic {

  interface Response {
    artists?: Artist[];
    albums?: Album[];
  }

  interface Artist {
    id: string,
    attributes?: Attributes
  }

  interface Album {
    id: string,
    resources?: Resources
  }

  interface Resources {
    data: Data;
    included: Included[];
  }

  interface Data {
    type: string;
    id: string;
    attributes: Attributes;
    relationships: Relationships;
  }

  interface Included {
    type: string;
    id: string;
    attributes: Attributes;
    relationships: Relationships;
  }

  interface Attributes {
    artistBio?: string;
    artistId?: string;
    artistName?: string;
    artistUrl?: string;
    artwork?: Artwork;
    bornOrFormedDate?: string;
    kind?: string;
    name?: string;
    origin?: string;
    popularity?: number;
    releaseDate?: string;
    trackCount?: number;
    trackNumber?: number;
    type?: string;
    url?: string;
    variant?: string;
  }

  interface Artwork {
    bgColor?: string;
    height: number;
    textColor1?: string;
    textColor2?: string;
    textColor3?: string;
    textColor4?: string;
    url: string;
    width: number;
  }

  interface Relationships {
    artist: DataArray;
    artistContemporaries: DataArray;
    content: DataArray;
    listenersAlsoBought: DataArray;
    songs: DataArray;
    topAlbums: DataArray;
  }

  interface DataArray {
    data: Data[];
  }

}
