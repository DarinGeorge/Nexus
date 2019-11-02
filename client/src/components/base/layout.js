import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';

import Sidebar from './deps/sidebar';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  }
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      //   light: '#757ce8',
      main: '#ffd10d'
      //   dark: '#002884',
      //   contrastText: '#fff'
    },
    secondary: {
      //   light: '#ff7961',
      main: '#000000'
      //   dark: '#ba000d',
      //   contrastText: '#000'
    }
  }
});

export default function Layout({ children }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Sidebar />
      <CssBaseline />
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </div>
  );
}
