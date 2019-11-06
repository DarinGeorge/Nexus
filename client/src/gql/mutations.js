import gql from 'graphql-tag';

export const LOGIN_USER = gql`
  mutation login($alias: String!, $password: String!) {
    login(alias: $alias, password: $password) {
      id
      email
      alias
      createdAt
      token
    }
  }
`;

export const REGISTER_USER = gql`
  mutation register(
    $alias: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        alias: $alias
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      alias
      createdAt
      token
    }
  }
`;

export const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export const DELETE_COMMENT = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        alias
        body
        createdAt
      }
      commentCount
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation ($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        alias
        body
        createdAt
      }
      commentCount
    }
  }
`;