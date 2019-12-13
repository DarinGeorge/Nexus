import gql from 'graphql-tag';

export const MESSAGE_SUBSCRIPTION = gql`
  subscription($chatId: ID) {
    newMessage(chatId: $chatId) {
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

export const CHAT_SUBSCRIPTION = gql`
  subscription($userId: ID!) {
    newChat(userId: $userId) {
      id
      title
      users {
        alias
      }
      messages {
        id
      }
      createdAt
    }
  }
`;

export const NOTIFICATION_SUBSCRIPTION = gql`
  subscription {
    newNotification {
      label
      user
    }
  }
`;
