import React, { createContext, useContext, useState } from 'react';
declare const MusicKit: any;

/* interface AuthorizationProviderState {
  authorized: boolean
  actions: IActions
} */

const AuthorizationContext = createContext({});

export const AuthorizationProvider = (props: any): JSX.Element => {
  const signIn = async () => {
    const musicKit = MusicKit.getInstance();
    await musicKit.authorize();
    setAuthorized(true);
  };

  const signOut = async () => {
    const musicKit = MusicKit.getInstance();
    await musicKit.unauthorize();
    setAuthorized(false);
  };

  const setAuthorized = (authorized: boolean) => {
    setState({ ...state, authorized: authorized });
  };

  const [state, setState] = useState({
    authorized: MusicKit.getInstance().isAuthorized,
    actions: {
      signIn: signIn,
      signOut: signOut
    }
  });

  return <AuthorizationContext.Provider value={state}>{props.children}</AuthorizationContext.Provider>;
};

export const useAuthorization = () => {
  return useContext(AuthorizationContext);
};
