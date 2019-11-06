import gql from 'graphql-tag';

export const FETCH_POSTS = gql`
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
