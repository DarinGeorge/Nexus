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
