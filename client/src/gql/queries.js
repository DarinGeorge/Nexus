import gql from 'graphql-tag';

/* POST QUERIES ------------------------ */

export const FETCH_POSTS = gql`
  {
    posts {
      id
      body
      user
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

export const FETCH_POST = gql`
  query($postId: ID!) {
    post(postId: $postId) {
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

/* USER QUERIES ------------------------ */

export const FETCH_USERS = gql`
{
  users {
    id
    email
    createdAt
    alias
  }
}
`;

export const FETCH_USER = gql`
  query($userId: ID!) {
    user(userId: $userId) {
      id
      email
      createdAt
      alias
    }
  }
`;