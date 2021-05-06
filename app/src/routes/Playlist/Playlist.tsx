import React, { createRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { Link, RouteComponentProps } from 'react-router-dom';
import moment from 'moment';
import styled from 'styled-components';
import { LoadingSpinner, MediaItemCarousel, MediaItemList } from '../../components/common';
import { MusicKitApiService, MusicKitService, ValenceApiService } from '../../services';

type PlaylistRouterProps = {
  id: string;
};

const Playlist = (props: RouteComponentProps<PlaylistRouterProps>): JSX.Element => {
  const id = props.match.params.id;
  const playlistRef = useRef<MusicKit.MediaItem | null>(null);
  const notesRef = createRef<HTMLDivElement>();

  const { isLoading: valenceLoading, error: valenceError, data: valencePlaylist } = useQuery<MusicKit.MediaItem>(
    `valenceAlbumData-${id}`,
    () => ValenceApiService.Playlist(id)
  );
  const { isLoading: musicKitLoading, error: musicKitError, data: musicKitPlaylist } = useQuery<MusicKit.MediaItem>(
    `musicKitAlbumData-${id}`,
    () => MusicKitApiService.Playlist(id)
  );

  const playlist = useMemo(() => valencePlaylist ?? musicKitPlaylist, [valencePlaylist, musicKitPlaylist]);

  const getPlaylistDuration = () => {
    if (!playlist) {
      return;
    }

    let duration = moment.duration(
      playlist.relationships.tracks.data
        .map((i: MusicKit.MediaItem) => i.attributes.durationInMillis)
        .reduce((a: number, b: number) => a + b, 0)
    );
    const hours = Math.floor(duration.asHours());
    duration = moment.duration(duration.asMilliseconds() - hours * 60 * 60 * 1000);
    const minutes = Math.round(duration.asMinutes());

    return `${hours ? `${hours} Hour${hours > 1 ? 's' : ''} ` : ''}${minutes} Minute${minutes > 1 ? 's' : ''}`;
  };

  const playlistDuration = useMemo(getPlaylistDuration, [playlist]);

  useLayoutEffect(() => {
    setEditorialNotesStyle();
    window.addEventListener('resize', setEditorialNotesStyle);
    return () => window.removeEventListener('resize', setEditorialNotesStyle);
  }, [notesRef]);

  const setEditorialNotesStyle = () => {
    if (!playlistRef.current?.attributes?.editorialNotes || !notesRef.current) {
      return;
    }

    const height = window.innerHeight;
    const notesOffsetTop = notesRef.current.getBoundingClientRect().top;
    notesRef.current.style.maxHeight = `${height - notesOffsetTop - 150}px`;
  };

  if (!playlist || valenceLoading || musicKitLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  return (
    <PlaylistContainer>
      <PlaylistTracksContainer>
        <SidebarContainer>
          <StickySidebar>
            <img
              src={MusicKitService.FormatArtwork(playlist.attributes.artwork, 500)}
              className="img-fluid rounded"
              alt={playlist.attributes.name}
            />
            <p>
              {playlist.relationships.tracks.data.length} Songs, {playlistDuration}
            </p>
            {playlist.attributes.editorialNotes && (
              <>
                <hr />
                <EditorialNotes ref={notesRef}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: `${
                        playlist.attributes.editorialNotes.standard ?? playlist.attributes.editorialNotes.short
                      }`
                    }}
                  ></span>
                </EditorialNotes>
              </>
            )}
          </StickySidebar>
        </SidebarContainer>
        <TrackListContainer>
          <TrackListHeader>
            <h1 className="text-truncate">{playlist.attributes.name}</h1>
            <ArtistGenre>
              {playlist.relationships.curator.data.length ? (
                <Link to={`/curators/${playlist.relationships.curator.data[0].id}`}>
                  <h2 className="text-truncate">{playlist.attributes.curatorName}</h2>
                </Link>
              ) : (
                <h2 className="text-truncate">{playlist.attributes.curatorName}</h2>
              )}
              <h2>
                {playlist.attributes.lastModifiedDate && (
                  <>&nbsp;| {moment(playlist.attributes.lastModifiedDate).format('dddd, MMMM D, YYYY')}</>
                )}
              </h2>
            </ArtistGenre>
          </TrackListHeader>
          <MediaItemList collection={playlist} items={playlist.relationships.tracks.data} showArtist showAlbum />
        </TrackListContainer>
      </PlaylistTracksContainer>
      {playlist.views?.['featured-artists'].data?.length > 0 && (
        <MediaItemCarousel items={playlist.views['featured-artists'].data} title={`Featured Artists`} />
      )}
    </PlaylistContainer>
  );
};

export default Playlist;

const LoadingContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PlaylistContainer = styled.div``;
const PlaylistTracksContainer = styled.div`
  display: flex;
`;
const SidebarContainer = styled.div`
  width: 30%;
  min-width: 250px;
  max-width: 400px;
  padding: 10px 15px;
`;
const StickySidebar = styled.div`
  position: sticky;
  top: 10px;
`;
const EditorialNotes = styled.div`
  overflow: auto;
  font-size: 10pt;
`;
const TrackListContainer = styled.div`
  width: 70%;
  padding-left: 15px;
`;
const TrackListHeader = styled.div`
  position: sticky;
  top: 0;
  padding-bottom: 10px;
  background: #040305;
`;
const ReleaseDate = styled.p`
  font-size: 10pt;
  margin: 0 15px;
`;
const ArtistGenre = styled.div`
  display: flex;
`;
