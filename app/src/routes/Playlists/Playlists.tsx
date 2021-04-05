import React from 'react';
import { useAuthStore } from '../../store';

const Playlists = (): JSX.Element => {
  const [isAuthorized] = useAuthStore((s) => [s.isAuthorized]);

  return (
    <>
      <h1>Playlists</h1>
      <h3>Authorized: {isAuthorized && 'true'}</h3>
    </>
  );
};

export default Playlists;
