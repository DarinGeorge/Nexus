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
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}));

function Feed() {
  const classes = useStyles();
  const { loading, data } = useQuery(FETCH_POSTS);
  const { user } = useContext(AuthContext);

  if (!loading)
    return (
      <>
        <div className={classes.root}>

          <Grid container>
            {user && (
              <Grid item xs={12} sm={8} md={8} lg={6}>
                <PostCreator />
                <PostFeed loading={loading} data={data} />
              </Grid>
            )}

            <Grid item xs={false} sm={4} lg={3}>
              <Paper>Sidebar</Paper>
            </Grid>

            <Grid item xs={false} lg={3}>
              <div>Conversations</div>
              <hr />
              <div>Connections</div>
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
