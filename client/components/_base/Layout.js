import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';

import Sidebar from './assets/Sidebar';

const useStyles = makeStyles(theme => ({
  wrap: {
    display: 'flex'
  }
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#ffd10d'
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: '#000000'
      // dark: will be calculated from palette.secondary.main,
    }
    // error: will use the default color
  }
});

export const Layout = ({ children }) => {
  const classes = useStyles();

  return (
    <>
      <ThemeProvider theme={theme}>
        <div className={classes.wrap}>
          <Sidebar />
          <Grid container>{children}</Grid>
        </div>
      </ThemeProvider>
    </>
  );
};
