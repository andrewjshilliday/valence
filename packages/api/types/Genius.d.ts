declare module Genius {

  interface Response {
    song?: Song;
    artist?: Artist;
    hits?: Hit[];
    sections?: Section[];
    next_page: number;
  }

  interface GeniusResponse {
    response: Response;
    meta: Meta;
  }

  interface Section {
    hits: Hit[];
    type: string;
  }

  interface Song {
    annotation_count: number;
    api_path: string;
    embed_content: string;
    fact_track: FactTrack;
    featured_video: boolean;
    full_title: string;
    header_image_thumbnail_url: string;
    header_image_url: string;
    id: number;
    lyrics: string;
    lyrics_owner_id: number;
    lyrics_state: string;
    path: string;
    pyong_count: number
    recording_location: string;
    release_date: string;
    song_art_image_thumbnail_url: string;
    song_art_image_url: string;
    stats: Stats;
    title: string;
    title_with_featured: string;
    url: string;
    album: Album;
    description_annotation: DescriptionAnnotation;
    featured_artists: Artist[];
    media: Media[];
    primary_artist: Artist;
    producer_artists: Artist[];
    song_relationships: SongRelationship;
    writer_artists: Artist[];
  }

  interface Artist {
    alternate_names: string[];
    api_path: string;
    facebook_name: string;
    followers_count: number;
    header_image_url: string;
    id: number;
    image_url: string;
    instagram_name: string;
    is_meme_verified: boolean;
    is_verified: boolean;
    name: string;
    twitter_name: string;
    url: string;
    iq: number;
    description_annotation: DescriptionAnnotation;
  }

  interface Album {
    api_path: string;
    cover_art_url: string;
    full_title: string;
    id: number;
    name: string;
    url: string;
    artist: Artist;
  }

  interface SongRelationship {
    type: string;
    songs: Song[];
  }

  interface Hit {
    highlights: string[];
    index: string
    type: string;
    result: Song | Artist;
  }

  interface Annotation {
    api_path: string;
    comment_count: number;
    community: boolean;
    custom_preview: string;
    has_voters: boolean;
    id: number;
    pinned: boolean;
    share_url: string;
    source: string;
    state: string;
    url: string;
    verified: boolean;
    votes_total: number;
    cosigned_by: string[];
  }

  interface DescriptionAnnotation {
    type: string;
    annotator_id: number;
    annotator_Login: string;
    api_path: string;
    classification: string;
    fragment: string;
    id: number;
    is_description: boolean;
    path: string;
    song_id: number;
    url: string;
    verified_annotator_ids: number[];
    annotatable: Annotatable;
    annotations: Annotation[];
    range: Range;
  }

  interface Annotatable {
    api_path: string;
    context: string;
    id: number;
    image_url: string;
    link_title: string;
    title: string;
    type: string;
    url: string;
  }

  interface Range {
    content: string;
  }

  interface FactTrack {
    provider: string;
    external_url: string;
    button_text: string;
    help_link_text: string;
    help_link_url: string;
  }

  interface Stats {
    accepted_annotations: number;
    contributors: number;
    hot: boolean;
    iq_earners: number;
    transcribers: number;
    unreviewed_annotations: number;
    verified_annotations: number;
    concurrents: number;
    pageviews: number;
  }

  interface Media {
    provider: string;
    provider_id: string;
    native_uri: string;
    start: number;
    type: string;
    url: string;
  }

  interface Meta {
    status: number;
  }

}