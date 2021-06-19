import React from 'react';
import { IconLoading } from '../../icons';
import styled, { keyframes } from 'styled-components';

const LoadingSpinner = (): JSX.Element => {
  return (
    <LoadingContainer>
      <IconLoading />
    </LoadingContainer>
  );
};

export default LoadingSpinner;

const spin = keyframes`
  from {
    transform:rotate(0deg);
  }
  to {
    transform:rotate(360deg);
  }
`;

const LoadingContainer = styled.div`
  height: 4rem;
  width: 4rem;
  animation-name: ${spin};
  animation-duration: 2000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;

  svg {
    height: 100%;
    width: 100%;
  }
`;
