import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import styled from 'styled-components';
import { BsMusicNoteBeamed } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';
import { IoMdNotifications } from 'react-icons/io';
import { useAuthorization } from '../../providers';
import { useAuthStore } from '../../../store';
import { Button, ContextMenu, IconButton, SearchBar } from '../../common';
import Navigation from './Navigation/Navigation';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const Header = ({ className }: HeaderProps): JSX.Element => {
  const auth = useAuthorization();
  const history = useHistory();
  const [isAuthorized] = useAuthStore((s) => [s.isAuthorized]);

  const search = (query: string | null) => {
    if (query) {
      history.push(`/search/${query}`);
    }
  }

  return (
    <StyledHeader className={className}>
      <StyledLogo />
      <Navigation />
      <StyledSearchbar onSearch={search} />
      <StyledAccountContainer>
        {isAuthorized ? (
          <>
            <IconButton icon={<StyledNotifications />} />
            <StyledProfileContextMenu trigger={<IconButton icon={<StyledProfile />} />}>
              <Link to={'/settings'}>Settings</Link>
              <span onClick={() => auth.signOut()}>Sign Out</span>
            </StyledProfileContextMenu>
          </>
        ) : (
          <Button onClick={() => auth.signIn()}>Sign In</Button>
        )}
      </StyledAccountContainer>
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
`;

const StyledLogo = styled(BsMusicNoteBeamed)`
  height: 3rem;
  width: 3rem;
  margin-left: 2rem;
`;

const StyledSearchbar = styled(SearchBar)`
  width: 40%;
`;

const StyledAccountContainer = styled.div`
  display: flex;
  align-items: center;
  width: 150px;
  > * {
    margin: 0 0.5rem;
  }
  *:first-child {
    margin-left: auto;
  }
`;

const StyledProfileContextMenu = styled(ContextMenu)`
  > * {
    line-height: 2.25rem;
    font-size: 0.9rem;
  }
`;

const StyledProfile = styled(FaUser)``;

const StyledNotifications = styled(IoMdNotifications)``;

export default Header;
