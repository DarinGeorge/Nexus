import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import PostFeed from '../components/Feed/PostFeed.js';
import PostLoader from '../components/Feed/PostLoader';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}));

const FETCH_POSTS = gql`
  {
    posts {
      id
      body
      createdAt
      alias
      commentCount
      comments {
        id
        alias
        createdAt
        body
      }
    }
  }
`;

function Feed() {
  const classes = useStyles();
  const { loading, data } = useQuery(FETCH_POSTS);

  if (!loading)
    return (
      <>
        <div className={classes.root}>
          <Grid container>
            <Grid item xs={8}>
              <PostFeed loading={loading} data={data} />
            </Grid>
            <Grid item xs={4}>
              <div>Sidebar</div>
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
