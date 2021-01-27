import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link as routerLink, useLocation, useHistory } from 'react-router-dom';

import { useLogoutMutation, useMeQuery } from "../../generated/graphql";
import SnackBar from '../SnackBar/index';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

const NavBar = () => {
  const classes = useStyles();
  const data = useMeQuery();
  const location = useLocation();
  const history = useHistory();
  const [logOut, ] = useLogoutMutation();
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  const handleClose = (_: React.SyntheticEvent | MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const logOutPressed = async () => {
    logOut({
      update: (cache, { data }) => {
        cache.evict({ fieldName: 'me' });
        setMessage('Successfully Logged Out');
        setOpen(true);
      }
    }) 
  };
  return (
    <div className={classes.root}>
      {
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Demo App
            </Typography>
            {
              location.pathname !== '/' ? (
                <Button
                  component={routerLink}
                  to="/"
                  color="inherit"
                >
                  Home
                </Button>
              ) : null
            }
            {
              data.loading ?
                <></>
              : data.data?.me ?
                (
                  !(location.pathname.includes('/login') || location.pathname.includes('/register')) ?
                    <>
                      {
                        !location.pathname.includes('/posts') ?
                          <Button
                            component={routerLink}
                            to="/posts"
                            color="inherit"
                          >
                            Posts
                          </Button>
                        : null
                      }
                      <Button
                        color="inherit"
                        onClick={logOutPressed}
                      >
                        Logout
                      </Button>
                    </>
                  : history.push('/')
                )
              : (
                !(location.pathname.includes('/login') || location.pathname.includes('/register')) && location.pathname === '/' ?
                  <> 
                    <Button
                      component={routerLink}
                      to="/login"
                      color="inherit"
                    >
                      Login
                    </Button>
                    <Button
                      component={routerLink}
                      to="/register"
                      color="inherit"
                    >
                      Register
                    </Button>
                  </>
                : location.pathname.includes('/login') || location.pathname.includes('/register') ?
                  null
                : history.push('/login')
              )
            }
          </Toolbar>
          <SnackBar message={message} open={open} handleClose={handleClose} />
        </AppBar>
      }
    </div>
  );
};

export default NavBar;
