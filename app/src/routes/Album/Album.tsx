import React, { createRef, useLayoutEffect, useMemo, useRef } from 'react';
import { useQuery } from 'react-query';
import { Link, RouteComponentProps } from 'react-router-dom';
import moment from 'moment';
import styled from 'styled-components';
import { LoadingSpinner, MediaItemCarousel, MediaItemList } from '../../components/common';
import { MusicKitApiService, MusicKitService, ValenceApiService } from '../../services';

type AlbumRouterProps = {
  id: string;
};

/* interface ListenNowProps extends RouteComponentProps<ListenNowRouterProps> {
} */

const Album = (props: RouteComponentProps<AlbumRouterProps>): JSX.Element => {
  const id = props.match.params.id;
  const albumRef = useRef<MusicKit.MediaItem | null>(null);
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
    if (!albumRef.current?.attributes?.editorialNotes || !notesRef.current) {
      return;
    }

    const height = window.innerHeight;
    // const notesOffsetTop = notesRef.current.getBoundingClientRect().top;
    // notesRef.current.style.maxHeight = `${height - notesOffsetTop - 150}px`;
    notesRef.current.style.maxHeight = `${height - 150 - 10 - notesRef.current.clientWidth - 23 - 150}px`;
  };

  if (!album || valenceLoading || musicKitLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  return (
    <AlbumContainer>
      <AlbumTracksContainer>
        <SidebarContainer>
          <StickySidebar>
            <img
              src={MusicKitService.FormatArtwork(album.attributes.artwork, 500)}
              className="img-fluid rounded"
              alt={album.attributes.name}
            />
            <p>
              {album.relationships.tracks.data.length} Songs, {albumDuration}
            </p>
            {album.attributes.editorialNotes && (
              <>
                <hr />
                <EditorialNotes ref={notesRef}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: `${album.attributes.editorialNotes.standard ?? album.attributes.editorialNotes.short}`
                    }}
                  ></span>
                </EditorialNotes>
              </>
            )}
          </StickySidebar>
        </SidebarContainer>
        <TrackListContainer>
          <TrackListHeader>
            <h1 className="text-truncate">{album.attributes.name}</h1>
            <ArtistGenre>
              <Link to={`/artist/${album.relationships.artists.data[0].id}`}>
                <h2 className="text-truncate">{album.attributes.artistName}</h2>
              </Link>
              <h2>{album.attributes.genreNames && <>&nbsp;| {album.attributes.genreNames[0]}</>}</h2>
            </ArtistGenre>
          </TrackListHeader>
          <MediaItemList collection={album} items={album.relationships.tracks.data} />
          <ReleaseDate>
            Released: {moment(album.attributes.releaseDate).format('dddd, MMMM D, YYYY')} <br />
            {album.attributes.recordLabel} | {album.attributes.copyright}
          </ReleaseDate>
        </TrackListContainer>
      </AlbumTracksContainer>
      {otherAlbums.map(
        (asd: any) => asd.data.length > 0 && <MediaItemCarousel key={asd.title} items={asd.data} title={asd.title} />
      )}
    </AlbumContainer>
  );
};

export default Album;

const LoadingContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AlbumContainer = styled.div``;
const AlbumTracksContainer = styled.div`
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
