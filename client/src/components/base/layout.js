import React, { useContext, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import Sidebar from './deps/sidebar';
import { AuthContext } from '../../utils/context/auth';
import { useSubscription } from '@apollo/react-hooks';
import ReactNotifications from 'react-notifications-component';
import { NOTIFICATION_SUBSCRIPTION } from '../../gql/subscriptions';
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  }
}));

const theme = createMuiTheme({
  palette: {
    /* REFERENCE:
      #FFC726 - GOLD
      #D1D2D8 - LIGHT GRAY
      #ECEDF0 - BORDERS
      #FBFBFC - HOVER COLOR
    */
    primary: {
      //   light: '#757ce8',
      main: '#FFC726'
      //   dark: '#002884',
      //   contrastText: '#fff'
    },
    secondary: {
      //   light: '#ff7961',
      main: '#D1D2D8'
      //   dark: '#ba000d',
      //   contrastText: '#000'
    }
  }
});

export default function Layout({ children }) {
  const { user } = useContext(AuthContext)
  const classes = useStyles();

  const { data } = useSubscription(NOTIFICATION_SUBSCRIPTION);
  console.log(data)
  useEffect(() => {
    if (data) {
      const payload = data.newNotification

      store.addNotification({
        title: 'Incoming Message',
        message: `${payload.user}: ${payload.label}`,
        type: 'default',                         // 'default', 'success', 'info', 'warning'
        container: 'bottom-left',                // where to position the notifications
        animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
        animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
        dismiss: {
          duration: 3000
        }
      })
    }
  }, [data])
  return (
    <>
      <CssBaseline />

      <div className={classes.root}>
        {user ? (<><Sidebar /><ReactNotifications /></>) : null}
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </div>
    </>
  );
}
