import React from 'react';
import { useMusicKit } from '../../components/providers';
import { useAuthStore } from '../../store';

const Home = (): JSX.Element => {
  const [isAuthorized] = useAuthStore((s) => [s.isAuthorized]);
  const musicKit = useMusicKit();

  return (
    <>
      <h1>Home</h1>
      <h3>Authorized: {isAuthorized?.toString() || 'false'}</h3>
      <button onClick={() => musicKit.playItem()}>Play Item</button>
    </>
  );
};

export default Home;
