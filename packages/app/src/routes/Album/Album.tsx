import React, { createRef, useLayoutEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { Link, RouteComponentProps } from 'react-router-dom';
import moment from 'moment';
import styled from 'styled-components';
import { LoadingSpinner, MediaItemCarousel, TrackList } from '../../components/common';
import { MusicKitApiService, MusicKitService, ValenceApiService } from '../../services';

type AlbumRouterProps = {
  id: string;
};

/* interface ListenNowProps extends RouteComponentProps<ListenNowRouterProps> {
} */

const Album = (props: RouteComponentProps<AlbumRouterProps>): JSX.Element => {
  const id = props.match.params.id;
  const notesRef = createRef<HTMLDivElement>();

  const { isLoading: valenceLoading, error: valenceError, data: valenceAlbum } = useQuery<MusicKit.MediaItem>(
    `valenceAlbumData-${id}`,
    () => ValenceApiService.Album(id)
  );
  const { isLoading: musicKitLoading, error: musicKitError, data: musicKitAlbum } = useQuery<MusicKit.MediaItem>(
    `musicKitAlbumData-${id}`,
    () => MusicKitApiService.Album(id)
  );

  const album = useMemo(() => valenceAlbum ?? musicKitAlbum, [valenceAlbum, musicKitAlbum]);

  const getAlbumDuration = () => {
    if (!album) {
      return;
    }

    let duration = moment.duration(
      album.relationships.tracks.data
        .map((i: MusicKit.MediaItem) => i.attributes.durationInMillis)
        .reduce((a: number, b: number) => a + b, 0)
    );
    const hours = Math.floor(duration.asHours());
    duration = moment.duration(duration.asMilliseconds() - hours * 60 * 60 * 1000);
    const minutes = Math.round(duration.asMinutes());

    return `${hours ? `${hours} Hour${hours > 1 ? 's' : ''} ` : ''}${minutes} Minute${minutes > 1 ? 's' : ''}`;
  };

  const albumDuration = useMemo(getAlbumDuration, [album]);

  const getOtherAlbums = () => {
    return album?.views
      ? [
          { title: `More By ${album.attributes.artistName}`, data: album.views['more-by-artist']?.data },
          { title: 'Other Versions', data: album.views['other-versions']?.data },
          { title: 'You Might Also Like', data: album.views['you-might-also-like']?.data },
          { title: 'Appears On', data: album.views['appears-on']?.data }
        ]
      : [];
  };

  const otherAlbums = useMemo(getOtherAlbums, [album]);

  useLayoutEffect(() => {
    setEditorialNotesStyle();
    window.addEventListener('resize', setEditorialNotesStyle);
    return () => window.removeEventListener('resize', setEditorialNotesStyle);
  }, [notesRef]);

  const setEditorialNotesStyle = () => {
    if (!album?.attributes?.editorialNotes || !notesRef.current) {
      return;
    }

    const notesOffsetTop = notesRef.current.getBoundingClientRect().top;
    notesRef.current.style.maxHeight = `${window.innerHeight - notesOffsetTop - 150}px`;
  };

  if (!album || valenceLoading || musicKitLoading) {
    return (
      <StyledLoading>
        <LoadingSpinner />
      </StyledLoading>
    );
  }

  return (
    <StyledAlbumContainer>
      <StyledAlbumTracksContainer>
        <StyledSidebarContainer>
          <StyledStickySidebar>
            <StyledImageContainer>
              <StyledImage
                src={MusicKitService.FormatArtwork(album.attributes.artwork, 500)}
                alt={album.attributes.name}
              />
            </StyledImageContainer>
            <p>
              {album.relationships.tracks.data.length} Songs, {albumDuration}
            </p>
            {album.attributes.editorialNotes && (
              <>
                <hr />
                <StyledEditorialNotes ref={notesRef}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: `${album.attributes.editorialNotes.standard ?? album.attributes.editorialNotes.short}`
                    }}
                  ></span>
                </StyledEditorialNotes>
              </>
            )}
          </StyledStickySidebar>
        </StyledSidebarContainer>
        <StyledTrackListContainer>
          <StyledTrackListHeader>
            <h1 className="text-truncate">{album.attributes.name}</h1>
            <StyledArtistGenre>
              <h2 className="text-truncate">
                {album.relationships.artists?.data.length ? (
                  <Link to={`/artist/${album.relationships.artists.data[0].id}`}>{album.attributes.artistName}</Link>
                ) : (
                  album.attributes.artistName
                )}
              </h2>
              <h2 className="text-truncate">
                {album.attributes.genreNames && <>&nbsp;| {album.attributes.genreNames[0]}</>}
              </h2>
            </StyledArtistGenre>
          </StyledTrackListHeader>
          <TrackList collection={album} showArtist={album.attributes.artistName === 'Various Artists'} />
          <StyledReleaseDate>
            Released: {moment(album.attributes.releaseDate).format('dddd, MMMM D, YYYY')} <br />
            {album.attributes.recordLabel} | {album.attributes.copyright}
          </StyledReleaseDate>
        </StyledTrackListContainer>
      </StyledAlbumTracksContainer>
      {otherAlbums.map(
        (category: any) =>
          category.data.length > 0 && (
            <MediaItemCarousel key={category.title} items={category.data} title={category.title} />
          )
      )}
    </StyledAlbumContainer>
  );
};

export default Album;

const StyledLoading = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledAlbumContainer = styled.div``;

const StyledAlbumTracksContainer = styled.div`
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

const StyledReleaseDate = styled.p`
  font-size: 10pt;
  margin: 0 15px;
`;

const StyledArtistGenre = styled.div`
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
