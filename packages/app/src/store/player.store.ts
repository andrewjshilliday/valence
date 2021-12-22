import createStore from './createStore';

const usePlayerStore = createStore(
  {
    currentPlaybackDuration: 0,
    currentPlaybackTime: 0,
    currentPlaybackTimeRemaining: 0,
    isPlaying: false,
    nowPlayingItem: <MusicKit.MediaItem | null>null,
    playbackLoading: false
  },
  (set) => ({
    setCurrentPlaybackDuration: (currentPlaybackDuration: number) => {
      set(() => ({ currentPlaybackDuration }));
    },
    setCurrentPlaybackTime: (playbackTime: number, playbackTimeRemaining: number, playbackDuration: number) => {
      set(() => ({
        currentPlaybackTime: playbackTime,
        currentPlaybackTimeRemaining: playbackTimeRemaining,
        currentPlaybackDuration: playbackDuration
      }));
    },
    setIsPlaying: (isPlaying: boolean) => {
      set(() => ({ isPlaying }));
    },
    setNowPlayingItem: (nowPlayingItem: MusicKit.MediaItem) => {
      set(() => ({ nowPlayingItem }));
    },
    setPlaybackLoading: (playbackLoading: boolean) => {
      set(() => ({ playbackLoading }));
    }
  })
);

export default usePlayerStore;
