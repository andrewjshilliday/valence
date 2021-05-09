import React from 'react';
import { useHistory } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { IconChevronLeft, IconChevronRight } from '../../../icons';

interface NavigationProps extends React.HTMLAttributes<HTMLDivElement> {}

const Navigation = ({ className }: NavigationProps): JSX.Element => {
  const history = useHistory();

  return (
    <StyledNavigation className={className}>
      <StyledBackArrow onClick={history.goBack} />
      Home
      <StyledForwardArrow onClick={history.goForward} />
    </StyledNavigation>
  );
};

const StyledNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 130px;
`;

const arrowStyles = css`
  height: 1rem;
  width: 1rem;
`;

const StyledBackArrow = styled(IconChevronLeft)`
  ${arrowStyles}
`;

const StyledForwardArrow = styled(IconChevronRight)`
  ${arrowStyles}
`;

export default Navigation;
