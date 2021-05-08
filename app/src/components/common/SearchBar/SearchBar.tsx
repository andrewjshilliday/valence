import React, { useState } from 'react';
import styled from 'styled-components';
import { MdSearch } from 'react-icons/md';

interface SearchBarProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  showIcon?: boolean;
  onSearch: (value: string | null) => void;
}

const SearchBar = ({ className, showIcon = true, icon, onSearch }: SearchBarProps): JSX.Element => {
  const [value, setValue] = useState(null);

  const handleSearch = (e: any): void => {
    if (e.keyCode === 13) {
      console.log(value);
      onSearch(value);
    }
  };

  return (
    <StyledInputContainer className={className}>
      {showIcon && (icon != null ? icon : <StyledSearchIcon onClick={() => onSearch(value)} />)}
      <StyledInput placeholder={'Search'} onChange={(e: any) => setValue(e.target.value)} onKeyUp={handleSearch} />
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
  transition: transform 300ms ease-in-out;

  :hover {
    cursor: pointer;
    transform: scale(1.2);
  }
`;

const StyledInput = styled.input`
  flex: 1;
  background-color: transparent;
  color: ${({ theme }) => theme.onPrimary};
  outline: none;
  border: none;
`;

export default SearchBar;
