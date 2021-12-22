import createStore from './createStore';

const useHistoryStore = createStore(
  {
    history: <any[]>[],
    activeIndex: 0
  },
  (set) => ({
    addToHistory: (page: any) => {
      set((state) => ({ history: [...state.history, page] }));
    }
  })
);

export default useHistoryStore;
