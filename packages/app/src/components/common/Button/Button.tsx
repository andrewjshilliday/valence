import React from 'react';
import styled from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'disabled';

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  type?: ButtonVariant;
}

const Button = ({ className, children, onClick, type = 'primary' }: ButtonProps): JSX.Element => (
  <StyledButton className={className} onClick={onClick}>
    {children}
  </StyledButton>
);

const StyledButton = styled.button`
  height: 3rem;
  border-radius: 1rem;
  padding: 0 1rem;
  background-color: transparent;
  color: ${({ theme }) => theme.onPrimary};
  outline: none;
  border-style: ridge;

  :hover {
    cursor: pointer;
    background-color: red;
    border-color: red;
    color: ${({ theme }) => theme.onPrimary};
  }
`;

export default Button;
