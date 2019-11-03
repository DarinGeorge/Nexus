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
