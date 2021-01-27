import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import { createUploadLink } from 'apollo-upload-client';

import NavBar from '../NavBar';
import { ThemeContext } from '../../providers/ThemeProvider';
import { LoadingContext } from '../../providers/LoadingProvider';
import Login from '../Login';
import Register from '../Register';
import Posts from '../Posts';
import ThemePicker from '../ThemePicker';
import Home from '../Home';

const link = createUploadLink({
  uri: '/graphql',
  credentials: "include",
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export const App = () => {
  const themeVal = React.useContext(ThemeContext);
  const { loader } = React.useContext(LoadingContext);
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          primary: {
            main: themeVal.primaryColor,
          },
          secondary: {
            main: themeVal.secondaryColor,
          },
        }
      }),
    [themeVal],
  );
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <NavBar />
        <LinearProgress style={{display: 'none'}} ref={loader} />
        <Switch>
          <Route
            exact
            path="/"
            component={(): JSX.Element => <Home />}
          />
          <Route
            exact
            path="/login"
            component={(): JSX.Element => <Login />}
          />
          <Route
            exact
            path="/register"
            component={(): JSX.Element => <Register />}
          />
          <Route
            exact
            path="/posts"
            component={(): JSX.Element => <Posts />}
          />
          <Redirect to="/" />
        </Switch>
        <ThemePicker />
      </ThemeProvider>
    </ApolloProvider>
  )
};