import React from 'react';
import styled, { css } from 'styled-components';
import { IconButton } from '../../../common';
import { IconHeartEmpty, IconHeartFull, IconList, IconRepeat, IconShuffle, IconVolumeHigh } from '../../../icons';

interface PlaybackOptionsProps extends React.HTMLAttributes<HTMLDivElement> {
  isFavourite: boolean;
  setVolume: (volume: number) => any;
  showLyrics: () => any;
  toggleFavourite: () => any;
  toggleRepeat: () => any;
  toggleShuffle: () => any;
}

const PlaybackOptions = ({
  className,
  isFavourite,
  setVolume,
  showLyrics,
  toggleFavourite,
  toggleRepeat,
  toggleShuffle
}: PlaybackOptionsProps): JSX.Element => (
  <StyledPlaybackControls className={className}>
    <StyledVolumeIcon icon={<IconVolumeHigh />} variant={'secondary'} onClick={setVolume(0.1)} />
    <StyledShuffleIcon icon={<IconShuffle />} variant={'secondary'} onClick={toggleShuffle} />
    <StyledRepeatIcon icon={<IconRepeat />} variant={'secondary'} onClick={toggleRepeat} />
    <StyledFavouriteIcon
      icon={isFavourite ? <IconHeartFull /> : <IconHeartEmpty />}
      variant={'secondary'}
      onClick={toggleFavourite}
    />
    <StyledLyricsIcon icon={<IconList />} variant={'secondary'} onClick={showLyrics} />
  </StyledPlaybackControls>
);

const StyledPlaybackControls = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const iconStyles = css`
  height: 2rem;
  width: 2rem;
`;

const StyledVolumeIcon = styled(IconButton)`
  ${iconStyles}
`;

const StyledShuffleIcon = styled(IconButton)`
  ${iconStyles}
`;

const StyledRepeatIcon = styled(IconButton)`
  ${iconStyles}
`;

const StyledFavouriteIcon = styled(IconButton)`
  ${iconStyles}
`;

const StyledLyricsIcon = styled(IconButton)`
  ${iconStyles}
`;

export default PlaybackOptions;
