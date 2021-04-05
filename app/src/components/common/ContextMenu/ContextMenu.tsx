import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

interface ContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  closeOnMenuClick?: boolean;
  trigger: React.ReactNode;
}

const ContextMenu = ({ className, children, trigger, closeOnMenuClick = true }: ContextMenuProps): JSX.Element => {
  const [showMenu, setShowMenu] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [xPosition, setXPosition] = useState(0);
  const [yPosition, setYPosition] = useState(0);

  useEffect(() => {
    if (showMenu) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      if (showMenu) {
        document.removeEventListener('click', handleClickOutside);
      }
    };
  }, [showMenu]);

  useLayoutEffect(() => {
    if (!menuRef.current) {
      return;
    }
    if (menuRef.current.offsetLeft + menuRef.current.offsetWidth + 20 > document.body.offsetWidth) {
      const menuWidth = menuRef.current.offsetWidth;
      setXPosition((prev) => prev - menuWidth);
    }
  });

  const toggleMenu = () => {
    const triggerElement = triggerRef.current?.getBoundingClientRect();
    if (!triggerElement) {
      return;
    }

    setXPosition(triggerElement.left + triggerElement.width * 0.5);
    setYPosition(triggerElement.top + triggerElement.height * 0.8);
    setShowMenu(!showMenu);
  };

  const handleClickOutside = (event: any) => {
    if (showMenu && !triggerRef.current?.contains(event.target)) {
      if (!menuRef.current?.contains(event.target) || closeOnMenuClick) {
        setShowMenu(false);
      }
    }
  };

  return (
    <>
      <div ref={triggerRef} onClick={toggleMenu}>
        {trigger}
      </div>
      {showMenu &&
        ReactDOM.createPortal(
          <StyledContextMenu ref={menuRef} className={className} x={xPosition} y={yPosition}>
            {children}
          </StyledContextMenu>,
          document.body
        )}
    </>
  );
};

const StyledContextMenu = styled.div<{ x: number; y: number }>`
  position: absolute;
  top: ${({ y }) => y}px;
  left: ${({ x }) => x}px;
  border-radius: 0.5rem;
  z-index: 1000;
  background: transparent;
  backdrop-filter: saturate(75%) blur(5px);
  box-shadow: inset 0 0 0 200px rgba(255, 255, 255, 0.15);

  > * {
    display: block;
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
  }
`;

export default ContextMenu;
