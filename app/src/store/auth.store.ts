import { combine } from 'zustand/middleware';
import { createStore } from './utils';
declare const MusicKit: any;

type AuthStore = {
  isAuthorized: boolean | null;
};

const useAuthStore = createStore(
  combine(
    {
      isAuthorized: null
    } as AuthStore,
    (set) => ({
      setIsAuthorizerd: (isAuthorized: boolean) => {
        set(() => ({ isAuthorized: isAuthorized }));
      }
    })
  )
);

export default useAuthStore;
