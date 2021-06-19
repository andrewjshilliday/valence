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
    MusicKit.getInstance().addEventListener('nowPlayingItemDidChange', nowPlayingItemDidChange);
    MusicKit.getInstance().addEventListener('playbackStateDidChange', playbackStateDidChange);
    MusicKit.getInstance().addEventListener('playbackTimeDidChange', playbackTimeDidChange);

    const volume = localStorage.getItem('volume');
    volume != null ? setVolume(+volume) : setVolume(0.05);

    return () => {
      MusicKit.getInstance().removeEventListener('nowPlayingItemDidChange', nowPlayingItemDidChange);
      MusicKit.getInstance().removeEventListener('playbackStateDidChange', playbackStateDidChange);
      MusicKit.getInstance().removeEventListener('playbackTimeDidChange', playbackTimeDidChange);
    };
  }, []);

  const nowPlayingItemDidChange = (event: any) => {
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

const playItem = async (item: MusicKit.MediaItem, startIndex: number = 0, shuffle: boolean = false) => {
  const musicKit = MusicKit.getInstance();
  
  try {
    const { playParams } = item.attributes;
    musicKit.shuffleMode = 0;

    if (
      musicKit.playbackState !== 2 &&
      musicKit.nowPlayingItem &&
      item.type !== 'songs' &&
      item.relationships?.tracks.data[startIndex]?.id === musicKit.nowPlayingItem.id
    ) {
      play();
      return;
    }

    await musicKit.setQueue({
      [playParams.kind]: playParams.id
    });

    if (startIndex !== 0) {
      await musicKit.changeToMediaAtIndex(startIndex);
    }

    if (shuffle) {
      musicKit.shuffleMode = 1;
    }

    play();
  } catch (ex) {
    stop();
  }
};

const play = () => {
  MusicKit.getInstance().play();
};

const pause = () => {
  MusicKit.getInstance().pause();
};

const stop = () => {
  MusicKit.getInstance().stop();
};

const next = () => {
  MusicKit.getInstance().skipToNextItem();
};

const previous = () => {
  MusicKit.getInstance().skipToPreviousItem();
};

const seek = (time: number) => {
  MusicKit.getInstance().seekToTime(time);
};

const setVolume = (volume: number) => {
  MusicKit.getInstance().volume = volume;
  localStorage.setItem('volume', volume.toString());
};

export const useMusicKit = () => {
  return useContext(MusicKitContext);
};
