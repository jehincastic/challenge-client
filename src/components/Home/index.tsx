import React from 'react';
import Container from '@material-ui/core/Container';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link as routerLink } from 'react-router-dom';

import { useMeQuery } from '../../generated/graphql';

interface HomeProps {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bg: {
      maxHeight: '100vh',
    },
    mainText: {
      textAlign: 'center',
    },
    subText: {
      textAlign: 'center',
    },
    textContainer: {
      marginTop: '20vh',
      display: 'flex',
      flexDirection: 'column',
    },
    btn: {
      margin: '0 auto',
    },
  }),
);

const Home: React.FC<HomeProps> = () => {
  const classes = useStyles();
  const data = useMeQuery();
  return (
    <Container className={classes.bg} maxWidth="sm">
      <div className={classes.textContainer}>
        <Typography className={classes.mainText} variant="h3" gutterBottom>
          Welcome to
        </Typography>
        <Typography className={classes.subText} variant="h2" gutterBottom>
          Demo App
        </Typography>
        {
          data.loading ?
          null
          : (
            <Button
              className={classes.btn}
              component={routerLink}
              to={data.data?.me ? "/posts" : "/login"}
              color="secondary"
              variant="contained"
            >
              Get Started
            </Button>
          )
        }
      </div>
    </Container>
  );
};

export default Home;
