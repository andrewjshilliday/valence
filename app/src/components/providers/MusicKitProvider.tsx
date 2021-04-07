import React, { useEffect, createContext, useContext } from 'react';
import shallow from 'zustand/shallow';
import { usePlayerStore } from '../../store';

interface MusicKitProviderState {
  playItem: Function;
  play: () => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  seek: (seekTo: number) => void;
  setVolume: (volume: number) => void;
}

const MusicKitContext = createContext({} as MusicKitProviderState);

export const MusicKitProvider = (props: any): JSX.Element => {
  const [setNowPlayingItem, setCurrentPlaybackTime, setIsPlaying, setPlaybackLoading] = usePlayerStore(
    (s) => [s.setNowPlayingItem, s.setCurrentPlaybackTime, s.setIsPlaying, s.setPlaybackLoading],
    shallow
  );

  useEffect(() => {
    MusicKit.getInstance().addEventListener('mediaItemDidChange', mediaItemDidChange);
    MusicKit.getInstance().addEventListener('playbackStateDidChange', playbackStateDidChange);
    MusicKit.getInstance().addEventListener('playbackTimeDidChange', playbackTimeDidChange);

    const volume = localStorage.getItem('volume');
    volume != null ? setVolume(+volume) : setVolume(0.05);

    return () => {
      MusicKit.getInstance().removeEventListener('mediaItemDidChange', mediaItemDidChange);
      MusicKit.getInstance().removeEventListener('playbackStateDidChange', playbackStateDidChange);
      MusicKit.getInstance().removeEventListener('playbackTimeDidChange', playbackTimeDidChange);
    };
  }, []);

  const mediaItemDidChange = (event: any) => {
    setNowPlayingItem(event.item);
  };

  const playbackStateDidChange = (event: any) => {
    setIsPlaying(event.state === 2);
    setPlaybackLoading(event.state === 1 || event.state === 8);
  };

  const playbackTimeDidChange = (event: any) => {
    setCurrentPlaybackTime(
      event.currentPlaybackTime,
      event.currentPlaybackTimeRemaining,
      event.currentPlaybackDuration
    );
  };

  const value = {
    playItem: playItem,
    play: play,
    pause: pause,
    stop: stop,
    next: next,
    previous: previous,
    seek: seek,
    setVolume: setVolume
  };

  return <MusicKitContext.Provider value={value}>{props.children}</MusicKitContext.Provider>;
};

const playItem = async (/* item: MusicKit.MediaItem */) => {
  await MusicKit.getInstance().setQueue({
    album: '1025210938'
  });
  play();
};

const play = () => {
  MusicKit.getInstance().player.play();
};

const pause = () => {
  MusicKit.getInstance().player.pause();
};

const stop = () => {
  MusicKit.getInstance().player.stop();
};

const next = () => {
  MusicKit.getInstance().player.skipToNextItem();
};

const previous = () => {
  MusicKit.getInstance().player.skipToPreviousItem();
};

const seek = (time: number) => {
  MusicKit.getInstance().player.seekToTime(time);
};

const setVolume = (volume: number) => {
  MusicKit.getInstance().player.volume = volume;
  localStorage.setItem('volume', volume.toString());
};

export const useMusicKit = () => {
  return useContext(MusicKitContext);
};
