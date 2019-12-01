const Chat = require('../../models/Chat');
const User = require('../../models/User');
const Message = require('../../models/Message');
const { withFilter } = require('apollo-server');
const authorizer = require('../authorizer');
const pubsub = require('../pubsub')

const NEW_CHAT = 'NEW_CHAT'

module.exports = {
  Query: {
    async chats(_, args) {
      const chats = await Chat.find({ users: args.userId });

      const limitedChats = chats.slice(0, args.limit);

      if (args.limit) return limitedChats;

      return chats;
    }
  },
  Mutation: {
    async startChat(_, args, context) {
      const user = authorizer(context);
      const { title, userIds } = args;

      userIds.push(user.id);

      const foundChats = await Chat.find({ users: userIds });
      const existingChat = foundChats[0];

      if (userIds.length === 2 && foundChats.length > 0) return existingChat;

      const chat = await Chat.create({
        title,
        users: userIds,
        createdAt: new Date().toISOString()
      });

      pubsub.publish(NEW_CHAT, {
        newChat: chat,
        userId: userIds[1]
      });

      await User.updateMany(
        { _id: { $in: userIds } },
        {
          $push: { chats: chat }
        }
      );
      await chat.save();

      return chat;
    }
  },
  Subscription: {
    newChat: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_CHAT),
        (payload, args) => {
          return payload.userId === args.userId;
        }
      )
    }
  },
  Chat: {
    async messages(chat, args) {
      const messages = await Message.find({ chat: chat.id });

      const limitedMessages = messages.slice(-1);

      if (args.limit) return limitedMessages;

      return messages;
    },
    async users(chat) {
      return (await chat.populate('users').execPopulate()).users;
    },
    async lastMessage(chat) {
      return (await chat.populate('lastMessage').execPopulate()).lastMessage;

    }
  }
};
