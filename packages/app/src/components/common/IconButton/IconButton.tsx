import React from 'react';
import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'disabled';

interface IconButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: ButtonVariant;
}

const IconButton = ({ className, onClick, icon, variant = 'primary' }: IconButtonProps): JSX.Element => (
  <StyledIconButton className={className} onClick={onClick} variant={variant}>
    {icon}
  </StyledIconButton>
);

const StyledIconButton = styled.button<{ variant: ButtonVariant }>`
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  background-color: transparent;
  color: ${({ theme }) => theme.onPrimary};
  outline: none;

  ${({ variant }) =>
    variant === 'primary' &&
    css`
      border-style: ridge;
      padding: 0.75rem;

      :hover {
        background-color: red;
        border-color: red;
      }
    `};
  ${({ variant }) =>
    variant === 'secondary' &&
    css`
      border: none;
      padding: 0;

      :hover {
        color: red;
      }
    `};

  :hover {
    cursor: pointer;
  }

  svg {
    height: 100%;
    width: 100%;
  }
`;

export default IconButton;
