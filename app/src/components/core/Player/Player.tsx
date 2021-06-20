import React, { useCallback, useEffect } from 'react';
import styled, { css } from 'styled-components';
import shallow from 'zustand/shallow';
import { IconMusic } from '../../icons';
import { useMusicKit } from '../../providers';
import { usePlayerStore } from '../../../store';
import { NowPlaying, PlaybackControls, PlayerOptions, PlaybackProgress } from '.';

interface PlayerProps extends React.HTMLAttributes<HTMLDivElement> {}

const selector = (s: any) => [
  s.instance,
  s.isPlaying,
  s.nowPlayingItem,
  s.playbackLoading,
  s.setCurrentPlaybackTime,
  s.setCurrentPlaybackTimeRemaining
];

const Player = ({ className }: PlayerProps): JSX.Element => {
  const musicKit = useMusicKit();
  /* const {
    instance,
    isPlaying,
    nowPlayingItem,
    playbackLoading,
    setCurrentPlaybackTime,
    setCurrentPlaybackTimeRemaining
  } = usePlayerStore(); */
  const [
    currentPlaybackDuration,
    currentPlaybackTime,
    currentPlaybackTimeRemaining,
    isPlaying,
    nowPlayingItem,
    playbackLoading
  ] = usePlayerStore(
    (s) => [
      s.currentPlaybackDuration,
      s.currentPlaybackTime,
      s.currentPlaybackTimeRemaining,
      s.isPlaying,
      s.nowPlayingItem,
      s.playbackLoading
    ],
    shallow
  );

  if (!nowPlayingItem) {
    return (
      <StyledPlayerContainer className={className} hasNowPlayingItem={nowPlayingItem != null}>
        <StyledLogo />
      </StyledPlayerContainer>
    );
  }

  return (
    <StyledPlayerContainer className={className} hasNowPlayingItem={nowPlayingItem != null}>
      <StyledNowPlaying
        artwork={nowPlayingItem.attributes.artwork}
        trackName={nowPlayingItem.attributes.name}
        albumName={nowPlayingItem.attributes.albumName}
        artistName={nowPlayingItem.attributes.artistName}
      />
      <StyledPlaybackControls
        isPlaying={isPlaying}
        isPlaybackLoading={playbackLoading}
        play={musicKit.play}
        pause={musicKit.pause}
        previous={musicKit.previous}
        next={musicKit.next}
        stop={musicKit.stop}
      />
      <StyledPlaybackProgress
        currentPlaybackDuration={currentPlaybackDuration ?? 0}
        /* currentBufferedProgress={currentBufferedProgress ?? 0} */
        currentPlaybackTime={currentPlaybackTime ?? 0}
        currentPlaybackTimeRemaining={currentPlaybackTimeRemaining ?? 0}
        seek={(v) => musicKit.seek(v)}
      />
      <StyledPlayerOptions
        isFavourite={false}
        setVolume={() => {}}
        showLyrics={() => {}}
        toggleFavourite={() => {}}
        toggleRepeat={() => {}}
        toggleShuffle={() => {}}
      />
    </StyledPlayerContainer>
  );
};

const StyledPlayerContainer = styled.div<{ hasNowPlayingItem: boolean }>`
  display: grid;
  align-items: center;
  padding: 1rem 2rem;
  width: 100vw;

  ${({ hasNowPlayingItem }) =>
    hasNowPlayingItem
      ? css`
          grid-template-columns: 30% 200px auto 300px;
          grid-template-rows: 1fr;
          grid-template-areas: 'now-playing playback-controls playback-progress player-options';
          column-gap: 2rem;
        `
      : css`
          justify-content: center;
        `};
`;

const StyledLogo = styled(IconMusic)`
  height: 3rem;
  width: 3rem;
  margin: 0 0.75rem;
`;

const StyledNowPlaying = styled(NowPlaying)`
  grid-area: now-playing;
`;

const StyledPlaybackControls = styled(PlaybackControls)`
  grid-area: playback-controls;
`;

const StyledPlaybackProgress = styled(PlaybackProgress)`
  grid-area: playback-progress;
`;

const StyledPlayerOptions = styled(PlayerOptions)`
  grid-area: player-options;
`;

export default Player;
