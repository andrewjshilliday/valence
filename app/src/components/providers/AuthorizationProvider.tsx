import React, { useEffect, createContext, useContext } from 'react';
import { useAuthStore } from '../../store';
declare const MusicKit: any;

interface AuthorizationProviderState {
  signIn: Function;
  signOut: Function;
}

const AuthorizationContext = createContext({} as AuthorizationProviderState);

export const AuthorizationProvider = (props: any): JSX.Element => {
  const [setIsAuthorized] = useAuthStore((s) => [s.setIsAuthorized]);

  useEffect(() => {
    setIsAuthorized(MusicKit.getInstance().isAuthorized);
  }, []);

  const signIn = async () => {
    const musicKit = MusicKit.getInstance();
    await musicKit.authorize();
    setIsAuthorized(true);
  };

  const signOut = async () => {
    const musicKit = MusicKit.getInstance();
    await musicKit.unauthorize();
    setIsAuthorized(false);
  };

  const value = {
    signIn: signIn,
    signOut: signOut
  };

  return <AuthorizationContext.Provider value={value}>{props.children}</AuthorizationContext.Provider>;
};

export const useAuthorization = () => {
  return useContext(AuthorizationContext);
};
