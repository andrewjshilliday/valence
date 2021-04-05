import React from 'react';
import styled, { css } from 'styled-components';
import { MusicKitService } from '../../../../services';

interface NowPlayingProps extends React.HTMLAttributes<HTMLDivElement> {
  albumName: string;
  artistName: string;
  artwork: MusicKit.Artwork;
  trackName: string;
}

const NowPlaying = ({ className, artwork, trackName, albumName, artistName }: NowPlayingProps): JSX.Element => (
  <StyledNowPlayingContainer className={className}>
    <StyledArtwork src={MusicKitService.FormatArtwork(artwork, 90)} />
    <StyledTrack className={'text-truncate'}>{trackName}</StyledTrack>
    <StyledAlbum className={'text-truncate'}>{albumName}</StyledAlbum>
    <StyledArtist className={'text-truncate'}>{artistName}</StyledArtist>
  </StyledNowPlayingContainer>
);

const StyledNowPlayingContainer = styled.div`
  display: grid;
  grid-template-columns: 90px auto;
  grid-template-rows: repeat(3, 1fr);
  grid-template-areas:
    'artwork track'
    'artwork album'
    'artwork artist';
  column-gap: 1rem;
  align-items: center;
`;

const StyledArtwork = styled.img`
  grid-area: artwork;
  max-width: 100%;
  height: auto;
`;

const StyledTrack = styled.span`
  grid-area: track;
`;

const StyledAlbum = styled.span`
  grid-area: album;
`;

const StyledArtist = styled.span`
  grid-area: artist;
`;

export default NowPlaying;
