const { gql } = require('apollo-server');

module.exports = gql`
  type Post {
    id: ID!
    user: String!
    body: String!
    createdAt: String!
    alias: String!
    comments: [Comment]!
    commentCount: Int!
  }
  type Comment {
    id: ID!
    createdAt: String!
    alias: String!
    body: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    alias: String!
    chats(limit: Int): [Chat!]!
    createdAt: String!
  }
  type Chat {
    id: ID!
    title: String
    users: [User!]!
    messages(limit: Int): [Message!]!
    lastMessage: Message
    createdAt: String!
    updatedAt: String!
  }
  type Message {
    id: ID!
    body: String!
    sender: User!
    createdAt: String!
    updatedAt: String!
  }
  input RegisterInput {
    alias: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Query {
    messages(chatId: ID!, limit: Int): [Message!]
    posts: [Post]
    post(postId: ID!): Post
    users: [User]
    user(userId: ID, alias: String): User
    chats(userId: ID!, limit: Int): [Chat!]
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(alias: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!

    startChat(title: String, userIds: [ID!]!): Chat
    createMessage(chatId: ID!, body: String!): Message
  }
  type Subscription {
    newMessage(chatId: ID!): Message!
    newChat(userId: ID!): Chat!
  }
`;
