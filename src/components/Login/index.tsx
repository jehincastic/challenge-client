import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import { useHistory } from "react-router-dom"
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { Link as routerLink } from 'react-router-dom';
import * as Yup from 'yup';

import {
  MeDocument,
  MeQuery,
  useLoginMutation,
} from '../../generated/graphql';
import Snackbar from '../SnackBar/index';
import { LoadingContext } from '../../providers/LoadingProvider';

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    width: '25%',
  },
  field: {
    marginTop: 10,
  },
  close: {
    padding: theme.spacing(0.5),
  },
}));

interface LoginProps {}

const LoginSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
});

const Login: React.FC<LoginProps> = () => {
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const history = useHistory();
  const [login, ] = useLoginMutation();
  const classes = useStyles();
  const { showLoader, hideLoader } = React.useContext(LoadingContext);
  
  const handleClose = (_: React.SyntheticEvent | MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Formik
          initialValues={{email: "", password: ""}}
          validationSchema={LoginSchema}
          onSubmit={async (values, {setErrors}) => {
            showLoader();
            const resp = await login({
              variables: {
                ...values
              },
              update: (cache, { data }) => {
                try {
                  const user = data?.login.user;
                  if (user) {
                    cache.writeQuery<MeQuery>({
                      query: MeDocument,
                      data: {
                        __typename: "Query",
                        me: user,
                      },
                    });
                  }
                } catch (err) {
                  console.error(err);
                }
              },
            });
            hideLoader();
            if (resp.errors) {
              setErrMsg('Server Erorr. Please Try Again.');
              setOpen(true);
            } else if (resp.data?.login.error) {
              setErrMsg(resp?.data?.login?.error || 'Error');
              setOpen(true);
            } else {
              history.push('/posts');
            }
          }}
        >
          {({ isSubmitting, getFieldProps, errors, values }) => (
            <Form className={classes.form}>
              <TextField
                required
                error={!!errors.email && values.email !== ''}
                className={classes.field}
                type="email"
                label="Email"
                id="email"
                {...getFieldProps('email')}
              />
              <TextField
                required
                error={!!errors.password && values.password !== ''}
                className={classes.field}
                type="password"
                label="Password"
                id="password"
                {...getFieldProps('password')}
              />
              <Button
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                className={classes.submit}
                type="submit"
              >
                Login
              </Button>
              <Grid container>
                <Grid item>
                  <Link to="/register" component={routerLink} variant="body2">
                    Do not have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
        <Snackbar message={errMsg} open={open} handleClose={handleClose} />
      </div>
    </Container>
  );
};

export default Login;
