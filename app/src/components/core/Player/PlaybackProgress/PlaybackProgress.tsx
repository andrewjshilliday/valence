import React from 'react';
import styled from 'styled-components';
import { ProgressBar } from '../../../common/';

interface PlaybackProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  currentBufferedProgress: number;
  currentPlaybackDuration: number;
  currentPlaybackTime: number;
  currentPlaybackTimeRemaining: number;
  seek: (v: number) => void;
};

const PlaybackProgress = ({
  className,
  currentBufferedProgress,
  currentPlaybackDuration,
  currentPlaybackTime,
  currentPlaybackTimeRemaining,
  seek
}: PlaybackProgressProps): JSX.Element => (
  <StyledPlaybackProgress className={className}>
    <ProgressBar
      current={currentPlaybackTime ?? 0}
      max={currentPlaybackDuration ?? 0}
      bufferedPercent={currentBufferedProgress ?? 0}
      onChangeCommit={(_, v) => seek(v)}
    />
    <StyledPlaybackTime>
      <span>{currentPlaybackTime.toString()}</span>
      <span>{currentPlaybackTimeRemaining.toString()}</span>
    </StyledPlaybackTime>
  </StyledPlaybackProgress>
);

const StyledPlaybackProgress = styled.div`
  position: relative;
`;

const StyledPlaybackTime = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 7px;
`;

export default PlaybackProgress;
