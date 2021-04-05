import React from 'react';
import { useAuthStore } from '../../store';

const Browse = (): JSX.Element => {
  const [isAuthorized] = useAuthStore((s) => [s.isAuthorized]);

  return (
    <>
      <h1>Browse</h1>
      <h3>Authorized: {isAuthorized && 'true'}</h3>
      <span>test</span>
    </>
  );
};

export default Browse;
