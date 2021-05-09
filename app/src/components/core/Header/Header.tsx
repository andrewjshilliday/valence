import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button, ContextMenu, IconButton, SearchBar } from '../../common';
import { IconMusic, IconNotification, IconProfile, IconSettings } from '../../icons';
import { useAuthorization } from '../../providers';
import { useAuthStore } from '../../../store';
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
            <StyledProfileContextMenu
              trigger={<IconButton icon={<StyledProfile />}/>}
              options={[
                {
                  content: <Link to={'/settings'}>Settings</Link>,
                  icon: <IconSettings />,
                  key: 'settings-link'
                },
                {
                  content: 'Sign Out',
                  key: 'sign-out-button',
                  onClick: () => auth.signOut()
                }
              ]}
            />
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

const StyledLogo = styled(IconMusic)`
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

const StyledProfileContextMenu = styled(ContextMenu)``;

const StyledProfile = styled(IconProfile)``;

const StyledNotifications = styled(IconNotification)``;

export default Header;
