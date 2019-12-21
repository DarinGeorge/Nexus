import React, { useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation } from '@apollo/react-hooks';
import { SnackbarProvider } from 'notistack';
import { useForm } from '../../utils/hooks';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../utils/context/auth';
import { REGISTER_USER } from '../../gql/mutations';

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link color='inherit' href='https://material-ui.com/'>
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh'
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const initialState = {
  alias: '',
  email: '',
  password: '',
  confirmPassword: ''
};

function Register() {
  const classes = useStyles();
  const history = useHistory();
  const context = useContext(AuthContext);

  const {
    handleChange,
    handleSubmit,
    submitting,
    setErrors,
    values,
    errors
  } = useForm(registerUser, initialState);

  const [addUser /*loading state: { loading }*/] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      context.login(userData);
      history.push('/');
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  });

  function registerUser() {
    addUser();
  }

  return (
    <Grid container component='main' className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={5} className={classes.image} />
      <Grid item xs={12} sm={8} md={7} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Register
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit} noValidate>
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='alias'
              label='Alias'
              name='alias'
              error={errors.alias ? true : false}
              value={values.alias}
              onChange={handleChange}
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              error={errors.email ? true : false}
              value={values.email}
              onChange={handleChange}
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              error={errors.password ? true : false}
              value={values.password}
              onChange={handleChange}
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              name='confirmPassword'
              label='Confirm Password'
              type='password'
              id='confirmPassword'
              error={errors.confirmPassword ? true : false}
              value={values.confirmPassword}
              onChange={handleChange}
            />
            <FormControlLabel
              control={<Checkbox value='remember' color='primary' />}
              label='I agree to all Terms & Conditions.'
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              className={classes.submit}
              disabled={submitting}
            >
              Register
            </Button>
            <Grid container>
              <Grid item>
                <Link href='#' variant='body2'>
                  {'Already have an account? Login.'}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}

export default function IntegrationNotistack() {
  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      preventDuplicate
      maxSnack={3}
    >
      <Register />
    </SnackbarProvider>
  );
}
