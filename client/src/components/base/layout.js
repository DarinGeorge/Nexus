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
  const classes = useStyles();
  return (
    <>
      <CssBaseline />
      <div className={classes.root}>
        <Sidebar />
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </div>
    </>
  );
}
