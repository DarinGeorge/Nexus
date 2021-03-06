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
  query($userId: ID, $alias: String) {
    user(userId: $userId, alias: $alias) {
      id
      email
      createdAt
      alias
      online
    }
  }
`;

export const FETCH_MESSAGES = gql`
  query($chatId: ID!, $limit: Int) {
    messages(chatId: $chatId, limit: $limit) {
      id
      body
      sender {
        id
        alias
      }
      chat
      createdAt
    }
  }
`;

export const FETCH_CHATS = gql`
  query($userId: ID!, $limit: Int) {
    chats(userId: $userId, limit: $limit) {
      id
      title
      users {
        alias
      }
      messages(limit: 1) {
        id
        body
        sender {
          id
          alias
        }
        createdAt
      }
      createdAt
    }
  }
`;

export const FETCH_BEACONS = gql`
  {
    beacons {
      id
      name
      description
      location
      date
      time
      user {
        id
        alias
      }
      createdAt
    }
  }
`;

export const FETCH_BEACONS_BY_USER = gql`
  query($userId: ID!) {
    beaconsByUser(userId: $userId) {
      id
      name
      description
      location
      date
      time
      user {
        id
        alias
      }
      createdAt
    }
  }
`;
