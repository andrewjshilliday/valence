import create from 'zustand';
import { devtools } from 'zustand/middleware';
import pipe from 'ramda/es/pipe';

const log: typeof devtools = (config) => (set, get, api) =>
  config(
    (args) => {
      console.log('applying', args);
      set(args);
      console.log('new state', get());
    },
    get,
    api
  );

export const createStore = pipe(devtools, /* log,  */ create);
