const Chat = require('../../models/Chat');
const User = require('../../models/User');
const { UserInputError } = require('apollo-server');
const authorizer = require('../authorizer');
const Message = require('../../models/Message');
const { withFilter } = require('apollo-server');
const pubsub = require('../pubsub')

const NEW_TEST_MESSAGE = 'NEW_TEST_MESSAGE';

module.exports = {
  Query: {
    async messages(_, args, context, info) {
      const messages = await Message.find();

      if (args.chatId) {
        const messages = await Message.find({ chat: args.chatId });

        const limitedMessages = messages.slice(-1);

        if (args.limit) return limitedMessages;

        return messages;
      }

      return messages;
    }
  },
  Mutation: {
    async createMessage(root, { chatId, body }, context, info) {
      const user = authorizer(context); // returns user object that is logged in

      const message = await Message.create({
        body,
        sender: user.id, // tries to set the user object returned from authorizer to sender
        chat: chatId,
        createdAt: new Date().toISOString()
      });

      pubsub.publish(NEW_TEST_MESSAGE, {
        newMessage: message,
        chatId: chatId
      });

      await Chat.updateMany(
        { _id: { $in: chatId } },
        {
          $push: { messages: message }
        }
      );
      await message.save();

      return message;
    }
  },
  Subscription: {
    newMessage: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_TEST_MESSAGE),
        (payload, args) => {
          return payload.chatId === args.chatId;
        }
      )
    }
  },
  Message: {
    sender(message, args, context, info) {
      return User.findOne(message.sender);
    }
  }
};
