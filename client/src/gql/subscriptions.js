import gql from 'graphql-tag';

export const MESSAGE_SUBSCRIPTION = gql`
  subscription($chatId: ID!) {
    newMessage(chatId: $chatId) {
      id
      body
      sender {
        id
        alias
      }
    }
  }
`;
