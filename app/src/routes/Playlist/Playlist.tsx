import React, { createRef, useLayoutEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { Link, RouteComponentProps } from 'react-router-dom';
import cloneDeep from 'lodash.clonedeep';
import moment from 'moment';
import styled from 'styled-components';
import { LoadingSpinner, MediaItemCarousel, TrackList } from '../../components/common';
import { MusicKitApiService, MusicKitService, ValenceApiService } from '../../services';

type PlaylistRouterProps = {
  id: string;
};

const Playlist = (props: RouteComponentProps<PlaylistRouterProps>): JSX.Element => {
  const id = props.match.params.id;
  const notesRef = createRef<HTMLDivElement>();

  const { isLoading: valenceLoading, error: valenceError, data: valencePlaylist } = useQuery<MusicKit.MediaItem>(
    `playlistValenceData-${id}`,
    () => ValenceApiService.Playlist(id)
  );
  const { isLoading: musicKitLoading, error: musicKitError, data: musicKitPlaylist } = useQuery<MusicKit.MediaItem>(
    `playlistMusicKitData-${id}`,
    () => MusicKitApiService.Playlist(id)
  );

  const { isLoading: relationshipsLoading, error: relationshipsError, data: relationshipsData } = useQuery(
    `playlistRelationshipsData-${id}`,
    async (): Promise<MusicKit.MediaItem | undefined> => {
      if (!playlist) {
        return;
      }

      const playlistRelationships = cloneDeep(playlist);
      playlistRelationships.relationships.tracks.data = await MusicKitApiService.GetRelationships(
        playlist?.relationships.tracks.data
      );

      return playlistRelationships;
    },
    { enabled: !valenceLoading && !musicKitLoading }
  );

  const playlist = useMemo(() => relationshipsData ?? valencePlaylist ?? musicKitPlaylist, [
    relationshipsData,
    valencePlaylist,
    musicKitPlaylist
  ]);

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
    if (!playlist?.attributes?.editorialNotes || !notesRef.current) {
      return;
    }

    const notesOffsetTop = notesRef.current.getBoundingClientRect().top;
    notesRef.current.style.maxHeight = `${window.innerHeight - notesOffsetTop - 150}px`;
  };

  if (!playlist || valenceLoading || musicKitLoading) {
    return (
      <StyledLoading>
        <LoadingSpinner />
      </StyledLoading>
    );
  }

  return (
    <StyledPlaylistContainer>
      <StyledPlaylistTracksContainer>
        <StyledSidebarContainer>
          <StyledStickySidebar>
            <StyledImageContainer>
              <StyledImage
                src={MusicKitService.FormatArtwork(playlist.attributes.artwork, 500)}
                alt={playlist.attributes.name}
              />
            </StyledImageContainer>
            <p>
              {playlist.relationships.tracks.data.length} Songs, {playlistDuration}
            </p>
            {playlist.attributes.editorialNotes && (
              <>
                <hr />
                <StyledEditorialNotes ref={notesRef}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: `${
                        playlist.attributes.editorialNotes.standard ?? playlist.attributes.editorialNotes.short
                      }`
                    }}
                  ></span>
                </StyledEditorialNotes>
              </>
            )}
          </StyledStickySidebar>
        </StyledSidebarContainer>
        <StyledTrackListContainer>
          <StyledTrackListHeader>
            <h1 className="text-truncate">{playlist.attributes.name}</h1>
            <StyledCuratorUpdated>
              <h2 className="text-truncate">
                {playlist.relationships.curator.data.length ? (
                  <Link to={`/curators/${playlist.relationships.curator.data[0].id}`}>
                    {playlist.attributes.curatorName}
                  </Link>
                ) : (
                  playlist.attributes.curatorName
                )}
              </h2>
              <h2 className="text-truncate">
                {playlist.attributes.lastModifiedDate && (
                  <span title={moment(playlist.attributes.lastModifiedDate).format('dddd, MMMM D, YYYY')}>
                    &nbsp;| Updated {moment(playlist.attributes.lastModifiedDate).fromNow()}
                  </span>
                )}
              </h2>
            </StyledCuratorUpdated>
          </StyledTrackListHeader>
          <TrackList collection={playlist} showArtist showAlbum />
        </StyledTrackListContainer>
      </StyledPlaylistTracksContainer>
      {playlist.views?.['featured-artists'].data?.length > 0 && (
        <MediaItemCarousel items={playlist.views['featured-artists'].data} title={`Featured Artists`} />
      )}
    </StyledPlaylistContainer>
  );
};

export default Playlist;


const StyledLoading = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledPlaylistContainer = styled.div``;

const StyledPlaylistTracksContainer = styled.div`
  display: grid;
  grid-template-columns: clamp(250px, 30%, 400px) auto;
  grid-template-areas: 'sidebar tracklist';
`;

const StyledSidebarContainer = styled.div`
  grid-area: sidebar;
  padding: 10px 15px;
`;

const StyledStickySidebar = styled.div`
  position: sticky;
  top: 10px;
`;

const StyledEditorialNotes = styled.div`
  overflow: auto;
  font-size: 10pt;
`;

const StyledTrackListContainer = styled.div`
  grid-area: tracklist;
  padding: 0 15px;
`;

const StyledTrackListHeader = styled.div`
  position: sticky;
  top: 0;
  padding-bottom: 10px;
  background: ${(props) => props.theme.primary};
`;

const StyledCuratorUpdated = styled.div`
  display: flex;
`;

const StyledImageContainer = styled.div`
  position: relative;
  height: 0;
  padding-top: 100%;
`;

const StyledImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 0.5em;
  position: absolute;
  top: 0;
`;
