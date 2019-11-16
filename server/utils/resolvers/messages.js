const Chat = require('../../models/Chat');
const User = require('../../models/User');
// const { UserInputError } = require("apollo-server");
const authorizer = require('../authorizer');
const Message = require('../../models/Message');
const { withFilter, PubSub } = require('apollo-server');

const NEW_MESSAGE = 'NEW_MESSAGE';

const pubsub = new PubSub();

module.exports = {
  Query: {},
  Mutation: {
    async createMessage(root, { chatId, body }, context, info) {
      const user = authorizer(context); // returns user object that is logged in

      const message = await Message.create({
        body,
        sender: user.id, // tries to set the user object returned from authorizer to sender
        chat: chatId
      });

      pubsub.publish(NEW_MESSAGE, {
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
        () => pubsub.asyncIterator(NEW_MESSAGE),
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
