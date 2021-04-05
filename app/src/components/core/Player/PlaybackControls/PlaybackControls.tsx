import React from 'react';
import styled, { css } from 'styled-components';
import { AiOutlineLoading } from 'react-icons/ai';
import { MdPlayArrow, MdPause, MdSkipPrevious, MdSkipNext } from 'react-icons/md';
import { IconButton } from '../../../common';

interface PlaybackControlProps extends React.HTMLAttributes<HTMLDivElement> {
  isPlaybackLoading: boolean;
  isPlaying: boolean;
  next: Function;
  pause: Function;
  play: Function;
  previous: Function;
  stop: Function;
};

const PlaybackControls = ({
  className,
  isPlaying,
  isPlaybackLoading,
  next,
  pause,
  play,
  previous,
  stop
}: PlaybackControlProps): JSX.Element => {
  return (
    <StyledPlaybackControls className={className}>
      <StyledPreviousIcon icon={<MdSkipPrevious />} onClick={() => previous()} variant={'secondary'} />
      {isPlaying && <StyledPauseIcon icon={<MdPause />} onClick={() => pause()} variant={'secondary'} />}
      {!isPlaying && !isPlaybackLoading && (
        <StyledPlayIcon icon={<MdPlayArrow />} onClick={() => play()} variant={'secondary'} />
      )}
      {!isPlaying && isPlaybackLoading && (
        <StyledLoadingIcon icon={<AiOutlineLoading />} onClick={() => stop()} variant={'secondary'} />
      )}
      <StyledNextIcon icon={<MdSkipNext />} onClick={() => next()} variant={'secondary'} />
    </StyledPlaybackControls>
  );
};

const StyledPlaybackControls = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const StyledPlayIcon = styled(IconButton)`
  height: 4rem;
  width: 4rem;
`;

const StyledPauseIcon = styled(IconButton)`
  height: 4rem;
  width: 4rem;
`;

const StyledPreviousIcon = styled(IconButton)``;

const StyledNextIcon = styled(IconButton)``;

const StyledLoadingIcon = styled(IconButton)`
  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }

  height: 4rem;
  width: 4rem;
  padding: 0.5rem;
  animation: rotation 2s infinite linear;
`;

export default PlaybackControls;
