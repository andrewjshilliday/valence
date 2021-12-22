import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { IconBrowse, IconHome, IconPlaylist } from '../../icons';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Sidebar = ({ className }: SidebarProps): JSX.Element => {
  const location = useLocation();

  return (
    <StyledAside className={className}>
      <StyledHomeLink to={'/home'} className={location.pathname === '/home' ? 'active' : ''}>
        <IconHome />
        <span>Home</span>
      </StyledHomeLink>
      <StyledBrowseLink to={'/browse'} className={location.pathname === '/browse' ? 'active' : ''}>
        <IconBrowse />
        <span>Browse</span>
      </StyledBrowseLink>
      <StyledPlaylistsLink to={'/playlists'} className={location.pathname === '/playlists' ? 'active' : ''}>
        <IconPlaylist />
        <span>Playlists</span>
      </StyledPlaylistsLink>
    </StyledAside>
  );
};

const StyledAside = styled.aside`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  overflow: auto;
`;

const iconStyles = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  margin: 1rem 2rem;
  color: ${(props) => props.theme.onPrimary};
  line-height: 0.5rem;
  text-decoration: none;

  &.active {
    color: red;

    ::after {
      background-color: red;
      height: 100%;
    }
  }

  svg {
    height: 2.5rem;
    width: 2.5rem;
  }

  span {
    font-size: 0.7rem;
  }

  :hover::after {
    height: 100%;
  }

  ::after {
    content: '';
    position: absolute;
    right: 0;
    width: 4px;
    height: 0px;
    background-color: ${({ theme }) => theme.onPrimary};
    transition: height 150ms ease;
  }
`;

const StyledHomeLink = styled(Link)`
  ${iconStyles};
`;

const StyledBrowseLink = styled(Link)`
  ${iconStyles};
`;

const StyledPlaylistsLink = styled(Link)`
  ${iconStyles};
`;

export default Sidebar;
