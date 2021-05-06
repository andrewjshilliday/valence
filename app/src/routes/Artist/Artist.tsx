import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { LoadingSpinner, MediaItemCarousel, MediaItemGrid } from '../../components/common';
import { MusicKitApiService, MusicKitService, ValenceApiService } from '../../services';
import artistImageDefault from '../../assets/images/placeholder.jpeg';

type ArtistRouterProps = {
  id: string;
};

const Artist = (props: RouteComponentProps<ArtistRouterProps>): JSX.Element => {
  const id = props.match.params.id;

  const { isLoading: valenceLoading, error: valenceError, data: valenceArtist } = useQuery<MusicKit.MediaItem>(
    `valenceArtistData-${id}`,
    () => ValenceApiService.Artist(id)
  );
  const { isLoading: musicKitLoading, error: musicKitError, data: musicKitArtist } = useQuery<MusicKit.MediaItem>(
    `musicKitArtistData-${id}`,
    () => MusicKitApiService.Artist(id, 'albums,playlists')
  );

  const artist = useMemo(() => valenceArtist ?? musicKitArtist, [valenceArtist, musicKitArtist]);

  if (!artist || valenceLoading || musicKitLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  return (
    <ArtistContainer>
      <h1 className="text-truncate">{artist.attributes.name}</h1>
      <HeaderContainer>
        <ArtistImage
          src={
            artist.attributes.artwork
              ? MusicKitService.FormatArtwork(artist.attributes.artwork.url, 500)
              : artistImageDefault
          }
        />
      </HeaderContainer>
      {artist.views ? (
        <>
          {artist.views['top-songs'].data.length > 0 && <MediaItemGrid items={artist.views['top-songs'].data} />}
          {artist.views['full-albums'].data.length > 0 && (
            <MediaItemCarousel items={artist.views['full-albums'].data} title="Albums" />
          )}
          {artist.views['singles'].data.length > 0 && (
            <MediaItemCarousel items={artist.views['singles'].data} title="Singles" />
          )}
          {artist.views['live-albums'].data.length > 0 && (
            <MediaItemCarousel items={artist.views['live-albums'].data} title="Live Albums" />
          )}
          {artist.views['compilation-albums'].data.length > 0 && (
            <MediaItemCarousel items={artist.views['compilation-albums'].data} title="Compilations" />
          )}
          {artist.views['appears-on-albums'].data.length > 0 && (
            <MediaItemCarousel items={artist.views['appears-on-albums'].data} title="Appears On" />
          )}
          {artist.views['playlists'].data.length > 0 && (
            <MediaItemCarousel items={artist.views['playlists'].data} title="Playlists" />
          )}
        </>
      ) : (
        <>
          {artist.relationships.albums?.data?.length > 0 && (
            <MediaItemCarousel items={artist.relationships.albums.data} title="Albums" />
          )}
          {artist.relationships.playlists?.data?.length > 0 && (
            <MediaItemCarousel items={artist.relationships.playlists.data} title="Playlists" />
          )}
        </>
      )}
      {artist.attributes.artistBio && (
        <StyledArtistInfo>
          <StyledInfoTitle>About {artist.attributes.name}</StyledInfoTitle>
          <StyledInfoBio dangerouslySetInnerHTML={{ __html: `${artist.attributes.artistBio}` }} />
          <StyledInfoOrigin>
            <strong>{artist.attributes.isGroup ? 'ORIGIN' : 'HOMETOWN'}</strong>
            <br />
            {artist.attributes.origin}
          </StyledInfoOrigin>
          <StyledInfoFormed>
            <strong>{artist.attributes.isGroup ? 'FORMED' : 'BORN'}</strong>
            <br />
            {artist.attributes.bornOrFormed}
          </StyledInfoFormed>
          <StyledInfoGenre>
            <strong>GENRE</strong>
            <br />
            {artist.attributes.genreNames[0]}
          </StyledInfoGenre>
        </StyledArtistInfo>
      )}
      {artist.views?.['similar-artists'].data.length > 0 && (
        <MediaItemCarousel items={artist.views['similar-artists'].data} title="Similar Artists" />
      )}
    </ArtistContainer>
  );
};

export default Artist;

const LoadingContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ArtistContainer = styled.div``;
const HeaderContainer = styled.div`
  padding: 0 3em 1em;
`;
const ArtistImage = styled.img`
  border-radius: 50%;
  height: 20em;
`;

const StyledArtistInfo = styled.div`
  display: grid;
  grid-template-columns: auto 200px;
  grid-template-rows: 2rem 4rem 4rem 6rem;
  grid-template-areas:
    'title title'
    'bio origin'
    'bio formed'
    'bio genre';
  column-gap: 2rem;
  padding: 0 3rem;
`;

const StyledInfoTitle = styled.h2`
  grid-area: title;
  margin-bottom: 10px;
`;

const StyledInfoBio = styled.span`
  grid-area: bio;
  overflow: auto;
`;

const StyledInfoOrigin = styled.span`
  grid-area: origin;
`;

const StyledInfoFormed = styled.span`
  grid-area: formed;
`;

const StyledInfoGenre = styled.span`
  grid-area: genre;
`;
