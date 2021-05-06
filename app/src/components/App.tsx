import React, { useLayoutEffect } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from 'styled-components';
import Layout from './Layout';
import { AuthorizationProvider, MusicKitProvider } from './providers';
import { Artist, Album, Browse, Home, ListenNow, Playlist, Playlists, Search, Settings } from '../routes';
import { useHistoryStore, useThemeStore } from '../store';
import { lightTheme, darkTheme } from '../theme';
import GlobalStyles from './GlobalStyles';

const App = (): JSX.Element => {
  const [theme] = useThemeStore((s) => [s.theme]);
  const [] = useHistoryStore((s) => [s.addToHistory]);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 60 * 1000 * 5
      }
    },
  });

  useLayoutEffect(() => {
    MusicKit.configure({
      developerToken: import.meta.env.SNOWPACK_PUBLIC_MUSICKIT_TOKEN,
      app: {
        name: 'Valence',
        build: '0.1',
        version: '0.1'
      }
    });
  }, []);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <MusicKitProvider>
          <AuthorizationProvider>
            <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
              <Router>
                <GlobalStyles />
                <Layout>
                  <Switch>
                    <Route path={'/home'} exact component={Home} />
                    <Route path={'/browse'} exact component={Browse} />
                    <Route path={'/playlists'} exact component={Playlists} />
                    <Route path={'/settings'} exact component={Settings} />
                    <Route path={'/search/:query'} exact component={Search} />
                    <Route path={'/artist/:id'} exact component={Artist} />
                    <Route path={'/album/:id'} exact component={Album} />
                    <Route path={'/playlist/:id'} exact component={Playlist} />
                    <Route path={'/listen-now'} exact component={ListenNow} />
                    <Redirect to={'/home'} />
                  </Switch>
                </Layout>
              </Router>
            </ThemeProvider>
          </AuthorizationProvider>
        </MusicKitProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
