import React, { useState } from 'react';
import { Form, Formik, Field } from 'formik';
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
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import * as Yup from 'yup';

import {
  MeDocument,
  MeQuery,
  useRegisterMutation,
} from '../../generated/graphql';
import DatePickerField from '../DatePicker/index';
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
    width: '100%',
  },
  dateField: {
    width: '100%',
    marginTop: 25,
  }
}));

interface RegisterProps {}

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .max(50, 'Too Long!')
    .required('Required'),
  password: Yup.string()
    .min(6, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  dob: Yup.date().required('Required'),
});


const Register: React.FC<RegisterProps> = () => {
  const history = useHistory();
  const [register, ] = useRegisterMutation();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState('');
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
          initialValues={{
            email: "",
            password: "",
            dob: new Date(),
            name: ""
          }}
          validationSchema={RegisterSchema}
          onSubmit={async (values, {setErrors}) => {
            showLoader();
            const resp = await register({
              variables: {
                ...values
              },
              update: (cache, { data }) => {
                try {
                  const user = data?.register.user;
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
            } else if (resp.data?.register.error) {
              setErrMsg(resp.data.register.error);
              setOpen(true);
            } else {
              history.push('/posts');
            }
          }}
        >
          {({ isSubmitting, getFieldProps, values, errors }) => (
            <Form className={classes.form}>
              <TextField
                required
                error={!!errors.name && values.name !== ''}
                className={classes.field}
                type="name"
                label="Name"
                id="name"
                {...getFieldProps('name')}
              />
              <TextField
                required
                error={!!errors.email && values.email !== ''}
                className={classes.field}
                type="email"
                label="Email"
                id="email"
                {...getFieldProps('email')}
              />
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    required
                    error={!!errors.password && values.password !== ''}
                    className={classes.field}
                    type="password"
                    label="Password"
                    id="password"
                    {...getFieldProps('password')}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Field
                      error={!!errors.dob}
                      name="dob"
                      className={classes.dateField}
                      component={DatePickerField}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
              </Grid>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting}
                className={classes.submit}
              >
                Sign Up
              </Button>
              <Grid container>
                <Grid item>
                  <Link to="/login" component={routerLink} variant="body2">
                    Have an account? Login
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

export default Register;
