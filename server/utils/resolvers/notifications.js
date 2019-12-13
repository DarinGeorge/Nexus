const Chat = require('../../models/Chat');
const User = require('../../models/User');
const Message = require('../../models/Message');
const { withFilter } = require('apollo-server');
const authorizer = require('../authorizer');
const pubsub = require('../pubsub')

const notifications = []
const NEW_NOTIFICATION = 'NEW_NOTIFICATION'

module.exports = {
    Query: {
        async notifications(_, args) {

            return notifications;
        }
    },
    Mutation: {
        pushNotification: (root, args) => {

            const newNotification = { label: args.label, user: args.user };
            notifications.push(newNotification);

            pubsub.publish(NEW_NOTIFICATION, {
                newNotification
            })

            return newNotification;
        },
    },
    Subscription: {
        newNotification: {
            subscribe: () => pubsub.asyncIterator(NEW_NOTIFICATION)
        }
    }
};
