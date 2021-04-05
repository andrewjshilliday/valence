import React from 'react';
import { useHistory } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

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
  height: 2rem;
  width: 2rem;
`;

const StyledBackArrow = styled(MdChevronLeft)`
  ${arrowStyles}
`;

const StyledForwardArrow = styled(MdChevronRight)`
  ${arrowStyles}
`;

export default Navigation;
