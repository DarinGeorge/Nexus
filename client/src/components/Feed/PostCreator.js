import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { SnackbarProvider } from 'notistack';

import TextField from '@material-ui/core/TextField';
import { useForm } from '../../utils/hooks';
import Button from '@material-ui/core/Button';
import { FETCH_POSTS } from '../../gql/queries';

function PostCreator() {
  const { values, handleChange, handleSubmit } = useForm(createPostCallback, {
    body: ''
  });

  const [createPost, { error }] = useMutation(CREATE_POST, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS
      });
      const new_post = result.data.createPost;
      proxy.writeQuery({
        query: FETCH_POSTS,
        data: { posts: [new_post, ...data.posts] }
      });
      values.body = '';
    }
  });

  function createPostCallback() {
    createPost();
  }

  console.log(values.body);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField
          variant='outlined'
          margin='normal'
          required
          fullWidth
          id='poster'
          name='body'
          onChange={handleChange}
          value={values.body}
        />
        <Button variant='contained' color='primary' type='submit'>
          Post
        </Button>
      </form>
    </div>
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
      <PostCreator />
    </SnackbarProvider>
  );
}

const CREATE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      alias
      comments {
        id
        body
        alias
        createdAt
      }
      commentCount
    }
  }
`;
