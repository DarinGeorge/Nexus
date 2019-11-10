import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

import { AuthContext } from '../utils/context/auth';
import PostFeed from '../components/Feed/PostFeed';
import PostLoader from '../components/Feed/PostLoader';
import PostCreator from '../components/Feed/PostCreator';
import { FETCH_POSTS } from '../gql/queries';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  networkBar: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),

    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  activityBar: {
    padding: theme.spacing(2),

    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  }
}));

function Feed() {
  const classes = useStyles();
  const { loading, data } = useQuery(FETCH_POSTS);
  const { user } = useContext(AuthContext);

  console.log(data)

  if (!loading)
    return (
      <>
        <div className={classes.root}>

          <Grid container>
            {user && (
              <Grid item xs={12} sm={8} md={7} lg={6}>
                <PostCreator />
                <PostFeed loading={loading} data={data} />
              </Grid>
            )}

            <Grid className={classes.activityBar} item xs={false} sm={4} md={4} lg={3}>
              <Paper>ActivityBar</Paper>
            </Grid>

            <Grid className={classes.networkBar} item xs={false} sm={false} md={1} lg={3}>
              <Paper>
                <div>Conversationss</div>
                <hr />
                <div>Connections</div>
              </Paper>
            </Grid>
          </Grid>

        </div>
      </>
    );

  // Loading Skeleton
  if (loading)
    return (
      <>
        <PostLoader />
      </>
    );
}

export default Feed;
