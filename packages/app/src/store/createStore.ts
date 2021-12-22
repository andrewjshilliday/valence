import create, { GetState, SetState, State, StoreApi } from 'zustand';
import { devtools } from 'zustand/middleware';
import produce, { Draft } from 'immer';
import { pipe } from 'ramda';

/* const withDevtools: typeof devtools = (config) => (set, get, api) => config(devtools(set), get, api); */

/* const withImmer = <T extends State>(
  config: StateCreator<T, (fn: (draft: Draft<T>) => void) => void>
): StateCreator<T> => (set, get, api) => config((fn) => set(produce(fn) as (state: T) => T), get, api); */

const withLog: typeof devtools = (config) => (set, get, api) =>
  config(
    (args) => {
      console.log('old state', get());
      set(args);
      console.log('new state', get());
    },
    get,
    api
  );

type StateCreator<T extends State, CustomSetState = SetState<T>, U extends State = T> = (
  set: CustomSetState,
  get: GetState<T>,
  api: StoreApi<T>
) => U;

const combine = <PrimaryState extends State, SecondaryState extends State>(
  initialState: PrimaryState,
  create: (set: SetState<PrimaryState>, get: GetState<PrimaryState>, api: StoreApi<PrimaryState>) => SecondaryState
): StateCreator<PrimaryState & SecondaryState> => (set, get, api) =>
  Object.assign(
    {},
    initialState,
    create(set as SetState<PrimaryState>, get as GetState<PrimaryState>, api as StoreApi<PrimaryState>)
  );

const immer = <T extends State, U extends State>(
  config: StateCreator<T, (fn: (draft: T) => void) => void, U>
): StateCreator<T, SetState<T>, U> => (set, get, api) => config((fn) => set(produce(fn) as (state: T) => T), get, api);

const combineImmerDevtools = <PrimaryState extends State, SecondaryState extends State>(
  initialState: PrimaryState,
  config: StateCreator<PrimaryState, (fn: (draft: PrimaryState) => void) => void, SecondaryState>
): StateCreator<PrimaryState & SecondaryState> => {
  return devtools(combine(initialState, immer(config)), 'Valence');
};

export default pipe(combineImmerDevtools, /* withLog,  */ create);
