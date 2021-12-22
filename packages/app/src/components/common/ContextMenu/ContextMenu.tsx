import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styled, { FlattenSimpleInterpolation } from 'styled-components';
import { useCallbackRef, useMergeRef } from '../../../hooks';

interface ContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  closeOnMenuClick?: boolean;
  maxWidth?: number | 'none';
  minWidth?: number | 'none';
  onOpen?: () => void;
  onClose?: () => void;
  options: Option[];
  trigger: React.ReactNode;
  triggerPositioningStyles?: FlattenSimpleInterpolation;
}

type Option = {
  content: React.ReactNode;
  icon?: React.ReactNode;
  key: string;
  nestedOptions?: Option[];
  onClick?: () => void;
};

const ContextMenu = ({
  className,
  closeOnMenuClick = true,
  maxWidth = 200,
  minWidth = 150,
  onOpen,
  onClose,
  options,
  trigger,
  triggerPositioningStyles
}: ContextMenuProps): JSX.Element => {
  const [showMenu, setShowMenu] = useState(false);
  const [xPosition, setXPosition] = useState(0);
  const [yPosition, setYPosition] = useState(0);

  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuListenerRef = useCallbackRef(
    useCallback(() => {
      document.addEventListener('click', handleClickOutside);
      document.getElementById('main')!.addEventListener('scroll', closeMenu);
      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.getElementById('main')!.removeEventListener('scroll', closeMenu);
      };
    }, [showMenu])
  );
  const mergedMenuRef = useMergeRef(menuRef, menuListenerRef);

  useLayoutEffect(() => {
    if (!menuRef.current) {
      return;
    }
    if (menuRef.current.offsetLeft + menuRef.current.offsetWidth + 20 > document.body.offsetWidth) {
      const menuWidth = menuRef.current.offsetWidth;
      setXPosition(document.body.offsetWidth - menuWidth - 45);
    }
    if (menuRef.current.offsetTop + menuRef.current.offsetHeight + 20 > document.body.offsetHeight) {
      const menuHeight = menuRef.current.offsetHeight;
      setYPosition(document.body.offsetHeight - menuHeight - 45);
    }
  });

  const toggleMenu = () => {
    const triggerElement = triggerRef.current?.getBoundingClientRect();
    if (!triggerElement) {
      return;
    }

    setXPosition(triggerElement.left + triggerElement.width * 0.5);
    setYPosition(triggerElement.top + triggerElement.height * 1.1);

    !showMenu && onOpen?.();
    showMenu && onClose?.();

    setShowMenu(!showMenu);
  };

  const closeMenu = () => {
    onClose?.();
    setShowMenu(false);
  };

  const handleClickOutside = (event: any) => {
    if (showMenu && !triggerRef.current?.contains(event.target)) {
      if (!menuRef.current?.contains(event.target) || closeOnMenuClick) {
        closeMenu();
      }
    }
  };

  return (
    <>
      <StyledContextButton ref={triggerRef} styles={triggerPositioningStyles} onClick={toggleMenu}>
        {trigger}
      </StyledContextButton>
      {showMenu &&
        ReactDOM.createPortal(
          <StyledContextMenu
            ref={mergedMenuRef}
            className={className}
            minWidth={minWidth}
            maxWidth={maxWidth}
            x={xPosition}
            y={yPosition}
          >
            {options?.map((option: Option) => (
              <StyledOption
                key={option.key}
                className={'text-truncate'}
                hasIcon={option.icon != null}
                onClick={option.onClick}
              >
                <StyledContent className={'text-truncate'}>{option.content}</StyledContent>
                {option.icon && <StyledIcon>{option.icon}</StyledIcon>}
              </StyledOption>
            ))}
          </StyledContextMenu>,
          document.body
        )}
    </>
  );
};

export default ContextMenu;

const StyledContextButton = styled.div<{ styles: FlattenSimpleInterpolation | undefined }>`
  ${({ styles }) => styles}
`;

const StyledContextMenu = styled.div<{ maxWidth: number | 'none'; minWidth: number | 'none'; x: number; y: number }>`
  position: absolute;
  ${({ x, y }) => `
    top: ${y}px;
    left: ${x}px;
  `};
  /* transform: ${({ x, y }) => `translate(${x}px, ${y}px)`}; */
  line-height: 2.25rem;
  font-size: 0.9rem;
  border-color: #8c8273;
  border-radius: 0.5rem;
  max-width: ${({ maxWidth }) => (typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth)};
  min-width: ${({ minWidth }) => (typeof minWidth === 'number' ? `${minWidth}px` : minWidth)};
  z-index: 1000;
  background: transparent;
  backdrop-filter: saturate(75%) blur(5px);
  box-shadow: inset 0 0 0 200px rgba(255, 255, 255, 0.15);

  @-moz-document url-prefix() {
    background: #171819;
  }
`;

const StyledOption = styled.div<{ hasIcon: boolean }>`
  display: grid;
  grid-template-columns: ${({ hasIcon }) => (hasIcon ? `auto 16px` : `auto`)};
  grid-template-areas: '${({ hasIcon }) => (hasIcon ? `content icon` : `content`)}';
  gap: 10px;
  text-decoration: none;
  padding: 0 1rem;
  color: rgba(232, 230, 227, 0.95);
  border-bottom: 1px solid rgba(0, 0, 0, 0.4);

  :hover {
    cursor: pointer;
    background-color: rgba(48, 52, 54, 0.7);
  }

  :first-child {
    border-radius: 0.5rem 0.5rem 0 0;
  }

  :last-child {
    border-bottom: none;
    border-radius: 0 0 0.5rem 0.5rem;
  }
`;

const StyledContent = styled.div`
  grid-area: content;

  a:hover {
    color: inherit;
    text-decoration: none;
  }
`;

const StyledIcon = styled.div`
  grid-area: icon;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
