import createStore from './createStore';

const useAuthStore = createStore(
  {
    isAuthorized: <boolean | null>null
  },
  (set) => ({
    setIsAuthorized: (isAuthorized: boolean) => {
      set(() => ({ isAuthorized: isAuthorized }));
    }
  })
);

export default useAuthStore;
