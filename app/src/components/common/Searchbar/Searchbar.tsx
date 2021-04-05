import React from 'react';
import styled from 'styled-components';
import { MdSearch } from 'react-icons/md';

interface SearchbarProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  showIcon?: boolean;
};

const Searchbar = ({ className, showIcon = true, icon }: SearchbarProps): JSX.Element => {
  return (
    <StyledInputContainer className={className}>
      {showIcon && (icon != null ? icon : <StyledSearchIcon />)}
      <StyledInput placeholder={'Search'} />
    </StyledInputContainer>
  );
};

const StyledInputContainer = styled.div`
  display: flex;
  align-items: center;
  height: 3rem;
  border-radius: 3rem;
  padding: 0 1rem;
  border: 1px ridge;
`;

const StyledSearchIcon = styled(MdSearch)`
  height: 1.5rem;
  width: 1.5rem;
  margin: 0 0.5rem 0 0;
`;

const StyledInput = styled.input`
  flex: 1;
  background-color: transparent;
  color: ${({ theme }) => theme.onPrimary};
  outline: none;
  border: none;
`;

export default Searchbar;
