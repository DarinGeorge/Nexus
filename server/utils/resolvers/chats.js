const Chat = require("../../models/Chat");
const User = require("../../models/User");
const Message = require("../../models/Message");
// const { UserInputError } = require("apollo-server");
const authorizer = require("../authorizer");

module.exports = {
  Query: {},
  Mutation: {
    async startChat(root, args, context, info) {
      const user = authorizer(context);
      const { title, userIds } = args;

      // const idsFound = await User.where("_id")
      //   .in(userIds)
      //   .countDocuments();

      // if (idsFound !== userIds.length) {
      //   throw new UserInputError("One or more users are invalid");
      // }

      userIds.push(user.id);

      const chat = await Chat.create({ title, users: userIds });

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
  Chat: {
    messages(chat, args, context, info) {
      return Message.find({ chat: chat.id });
    },
    async users(chat, args, context, info) {
      return (await chat.populate("users").execPopulate()).users;
    },
    async lastMessage(chat, args, context, info) {
      return (await chat.populate("lastMessage").execPopulate()).lastMessage;
    }
  }
};
