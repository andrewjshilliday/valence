import { combine } from 'zustand/middleware';
import { createStore } from './utils';

const useHistoryStore = createStore(
  combine(
    {
      history: [] as any[],
      activeIndex: 0
    },
    (set) => ({
      addToHistory: (page: any) => {
        set((state) => ({ history: [...state.history, page] }));
      } /* ,
      setIsAuthorizerd: () => {
        set(() => ({ isAuthorized: MusicKit.getInstance().isAuthorized }));
      },
      signIn: async () => {
        const musicKit = MusicKit.getInstance();
        await musicKit.authorize();
        set(() => ({ isAuthorized: true }));
      },
      signOut: async () => {
        const musicKit = MusicKit.getInstance();
        await musicKit.unauthorize();
        set(() => ({ isAuthorized: false }));
      } */
    })
  )
);

export default useHistoryStore;
