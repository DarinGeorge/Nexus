const postsResolvers = require("./posts");
const usersResolvers = require("./users");
const commentsResolvers = require("./comments");
const chatsResolvers = require("./chats");
const messagesResolvers = require("./messages");

module.exports = {
  Post: {
    commentCount: parent => parent.comments.length
  },
  User: {
    ...usersResolvers.User
  },
  Chat: {
    ...chatsResolvers.Chat
  },
  Message: {
    ...messagesResolvers.Message
  },
  Query: {
    ...postsResolvers.Query,
    ...usersResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
    ...chatsResolvers.Mutation,
    ...messagesResolvers.Mutation
  }
};
