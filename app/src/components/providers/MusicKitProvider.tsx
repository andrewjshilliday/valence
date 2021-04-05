import React, { useState, useEffect, createContext, useContext, useLayoutEffect } from 'react';
import { useEventListener } from '../../hooks';
import { usePlayerStore } from '../../store';

interface MusicKitProviderState {
  playItem: Function;
  play: Function;
  pause: Function;
  stop: Function;
  next: Function;
  previous: Function;
  seek: Function;
  setVolume: Function;
}

const MusicKitContext = createContext({} as MusicKitProviderState);

export const MusicKitProvider = (props: any): JSX.Element => {
  const [
    instance,
    setInstance,
    setNowPlayingItem,
    setCurrentPlaybackTime,
    setCurrentPlaybackTimeRemaining,
    setIsPlaying,
    setPlaybackLoading
  ] = usePlayerStore((s) => [
    s.instance,
    s.setInstance,
    s.setNowPlayingItem,
    s.setCurrentPlaybackTime,
    s.setCurrentPlaybackTimeRemaining,
    s.setIsPlaying,
    s.setPlaybackLoading
  ]);

  useEffect(() => {
    setInstance();
  }, []);

  useEffect(() => {
    if (!instance) {
      return;
    }

    instance.addEventListener('mediaItemDidChange', mediaItemDidChange);
    instance.addEventListener('playbackStateDidChange', playbackStateDidChange);
    instance.addEventListener('playbackTimeDidChange', playbackTimeDidChange);

    const volume = localStorage.getItem('volume');
    volume != null ? setVolume(+volume) : setVolume(0.05);
  }, [instance]);

  const mediaItemDidChange = (event: any) => {
    setNowPlayingItem(event.item);
  };

  const playbackStateDidChange = (event: any) => {
    setIsPlaying(event.state === 2);
    setPlaybackLoading(event.state === 1 || event.state === 8);
  };

  const playbackTimeDidChange = (event: any) => {
    setCurrentPlaybackTime(event.currentPlaybackTime);
    setCurrentPlaybackTimeRemaining(event.currentPlaybackTimeRemaining);
  };

  /* useEventListener('mediaItemDidChange', mediaItemDidChange, MusicKit.getInstance()); */

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
