import React from 'react';
import styled from 'styled-components';
import { Header, Player, Sidebar } from './core';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps): JSX.Element => (
  <AppContainer>
    <StyledHeader />
    <StyledSidebar />
    <StyledAppBody>{children}</StyledAppBody>
    <StyledPlayer />
  </AppContainer>
);

const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.onPrimary};
  display: grid;
  grid-template-columns: 150px auto;
  grid-template-rows: 150px auto 150px;
  grid-template-areas:
    'header header'
    'sidebar main'
    'player player';
`;

const StyledHeader = styled(Header)`
  grid-area: header;
`;

const StyledSidebar = styled(Sidebar)`
  grid-area: sidebar;
`;

const StyledAppBody = styled.main`
  grid-area: main;
  overflow: auto;
  padding-right: 1rem;
  height: calc(100vh - 300px);
`;

const StyledPlayer = styled(Player)`
  grid-area: player;
`;

export default Layout;
