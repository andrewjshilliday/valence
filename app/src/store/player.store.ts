import { combine } from 'zustand/middleware';
import { createStore } from './utils';
declare const MusicKit: any;

type PlayerStore = {
  instance: MusicKit.MusicKitInstance | null;
  isPlaying: boolean;
  playbackLoading: boolean;
  nowPlayingItem: MusicKit.MediaItem | null;
  currentPlaybackTime: number;
  currentPlaybackTimeRemaining: number;
};

const usePlayerStore = createStore(
  combine(
    {
      instance: null,
      isPlaying: false,
      playbackLoading: false,
      nowPlayingItem: null,
      currentPlaybackTime: 0,
      currentPlaybackTimeRemaining: 0
    } as PlayerStore,
    (set) => ({
      setInstance: () => {
        set(() => ({ instance: MusicKit.getInstance() }));
      },
      setIsPlaying: (isPlaying: boolean) => {
        set(() => ({ isPlaying: isPlaying }));
      },
      setPlaybackLoading: (playbackLoading: boolean) => {
        set(() => ({ playbackLoading: playbackLoading }));
      },
      setNowPlayingItem: (nowPlayingItem: MusicKit.MediaItem) => {
        set(() => ({ nowPlayingItem: nowPlayingItem }));
      },
      setCurrentPlaybackTime: (currentPlaybackTime: number) => {
        set(() => ({ currentPlaybackTime: currentPlaybackTime }));
      },
      setCurrentPlaybackTimeRemaining: (currentPlaybackTimeRemaining: number) => {
        set(() => ({ currentPlaybackTimeRemaining: currentPlaybackTimeRemaining }));
      }
    })
  )
);

export default usePlayerStore;
