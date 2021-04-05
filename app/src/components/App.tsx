import React, { useLayoutEffect } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Layout from './Layout';
import { AuthorizationProvider, MusicKitProvider } from './providers';
import { Browse, Home, Playlists, Settings } from '../routes';
import { useHistoryStore, useThemeStore } from '../store';
import { lightTheme, darkTheme } from '../theme';

const App = (): JSX.Element => {
  const [theme] = useThemeStore((s) => [s.theme]);
  const [] = useHistoryStore((s) => [s.addToHistory]);

  useLayoutEffect(() => {
    MusicKit.configure({
      developerToken: import.meta.env.SNOWPACK_PUBLIC_MUSICKIT_TOKEN, // process.env.REACT_APP_MUSICKIT_TOKEN,
      app: {
        name: 'Valence',
        build: '0.1',
        version: '0.1'
      }
    });
  }, []);

  return (
    <React.StrictMode>
      <MusicKitProvider>
        <AuthorizationProvider>
          <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
            <Router>
              <Layout>
                <Switch>
                  <Route path={'/home'} exact component={Home} />
                  <Route path={'/browse'} exact component={Browse} />
                  <Route path={'/playlists'} exact component={Playlists} />
                  <Route path={'/settings'} exact component={Settings} />
                  <Redirect to={'/home'} />
                </Switch>
              </Layout>
            </Router>
          </ThemeProvider>
        </AuthorizationProvider>
      </MusicKitProvider>
    </React.StrictMode>
  );
};

export default App;
