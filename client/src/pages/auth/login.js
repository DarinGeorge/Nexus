import React, { useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useForm } from '../../utils/hooks';
import { SnackbarProvider } from 'notistack';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../utils/context/auth';
import { LOGIN_USER } from '../../gql/mutations';

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link color='inherit' href='https://material-ui.com/'>
        Nexus
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
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
  password: ''
};

function Login(props) {
  const classes = useStyles();
  const history = useHistory();
  const context = useContext(AuthContext);

  const {
    handleChange,
    handleSubmit,
    values,
    submitting,
    setErrors,
    errors
  } = useForm(loginUser, initialState);

  const [acceptUser /* loading state: { loading }*/] = useMutation(LOGIN_USER, {
    update(
      _,
      {
        data: { login: userData }
      }
    ) {
      context.login(userData);
      history.push('/');
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  });

  function loginUser() {
    acceptUser();
  }

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign in
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
            name='password'
            label='Password'
            type='password'
            id='password'
            error={errors.password ? true : false}
            value={values.password}
            onChange={handleChange}
          />
          <FormControlLabel
            control={<Checkbox value='remember' color='primary' />}
            label='Remember Me'
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
            disabled={submitting}
          >
            Login
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
    </Container>
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
      <Login />
    </SnackbarProvider>
  );
}
