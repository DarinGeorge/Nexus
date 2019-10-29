import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import PostCard from '../components/Feed/PostCard';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  },
  postCard: {
    paddingTop: theme.spacing(3)
  }
}));

function Feed() {
  const classes = useStyles();
  const { loading, data } = useQuery(FETCH_POSTS);

  if (loading) return <div>Loading....</div>;

  const { getPosts: posts } = data;
  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={8}>
          {posts.map(post => (
            <div className={classes.postCard} key={post.id}>
              <PostCard post={post} />
            </div>
          ))}
        </Grid>

        <Grid item xs={4}></Grid>
      </Grid>
    </div>
  );
}

const FETCH_POSTS = gql`
  {
    getPosts {
      id
      body
      createdAt
      alias
    }
  }
`;

export default Feed;
