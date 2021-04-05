import create /* , { State as ZustandState, StateCreator } */ from 'zustand';
import { combine, devtools } from 'zustand/middleware';
import pipe from 'ramda/es/pipe';
/* import produce, { Draft } from 'immer'; */
import { createStore } from './utils';
import { getColorScheme } from '../utils';
declare const MusicKit: any;

/* const immer = <T extends ZustandState>(
  config: StateCreator<T, (fn: (draft: Draft<T>) => void) => void>
): StateCreator<T> => (set, get, api) =>
  config((fn) => set(produce(fn) as (state: T) => T), get, api); */

/* const log: typeof devtools = config => (set, get, api) =>
  config(
    args => {
      console.log("applying", args);
      set(args);
      console.log("new state", get());
    },
    get,
    api
  );

const createStore = pipe(devtools, log, create); */

const useThemeStore = createStore(
  combine(
    {
      theme: getColorScheme()
    },
    (set) => ({
      setTheme: (theme: Theme) => {
        set(() => ({ theme }));
        localStorage.setItem('theme', theme);
      }
    })
  )
);

export default useThemeStore;
