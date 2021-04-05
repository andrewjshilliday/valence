import React from 'react';
import styled, { css } from 'styled-components';
import { MdStar, MdStarBorder } from 'react-icons/md';
import { BiVolumeFull, BiVolumeLow, BiVolumeMute } from 'react-icons/bi';
import { IoMdHeart, IoMdHeartEmpty, IoMdHeartDislike } from 'react-icons/io';
import { TiArrowRepeat, TiArrowShuffle } from 'react-icons/ti';
import { VscListSelection } from 'react-icons/vsc';
import { IconButton } from '../../../common';

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
    <StyledVolumeIcon icon={<BiVolumeFull />} variant={'secondary'} onClick={setVolume(0.1)} />
    <StyledShuffleIcon icon={<TiArrowShuffle />} variant={'secondary'} onClick={toggleShuffle} />
    <StyledRepeatIcon icon={<TiArrowRepeat />} variant={'secondary'} onClick={toggleRepeat} />
    <StyledFavouriteIcon
      icon={isFavourite ? <IoMdHeart /> : <IoMdHeartEmpty />}
      variant={'secondary'}
      onClick={toggleFavourite}
    />
    <StyledLyricsIcon icon={<VscListSelection />} variant={'secondary'} onClick={showLyrics} />
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
