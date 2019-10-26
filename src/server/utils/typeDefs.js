const { gql } = require('apollo-server');

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    alias: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }
  type Comment {
    id: ID!
    createdAt: String!
    alias: String!
    body: String!
  }
  type Like {
    id: ID!
    createdAt: String!
    alias: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    alias: String!
    createdAt: String!
  }
  input RegisterInput {
    alias: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(alias: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }
`;
