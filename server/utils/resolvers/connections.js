const User = require('../../models/User');
const Connection = require('../../models/Connection');
const { withFilter, UserInputError } = require('apollo-server');
const authorizer = require('../authorizer');
const pubsub = require('../pubsub')

const NEW_CONNECTION = 'NEW_CONNECTION'

module.exports = {
    Query: {
        async connections(_, args) {
            const connections = await Connection.find({ users: args.userId });

            const limitedconnections = connections.slice(0, args.limit);

            if (args.limit) return limitedconnections;

            return connections;
        }
    },
    Mutation: {
        async createConnection(_, args, context) {
            const user = authorizer(context);
            const { userIds } = args;

            userIds.push(user.id);

            const foundConnections = await Connection.find({ users: userIds });

            if (foundConnections.length > 0) throw new UserInputError('Connection already exists.');

            const connection = await Connection.create({
                users: userIds,
                createdAt: new Date().toISOString()
            });

            pubsub.publish(NEW_CONNECTION, {
                newConnection: connection,
                userId: userIds[1]
            });

            await User.updateMany(
                { _id: { $in: userIds } },
                {
                    $push: { connections: connection }
                }
            );
            await connection.save();

            return connection;
        }
    },
    Subscription: {
        newConnection: {
            // Additional event labels can be passed to asyncIterator creation
            subscribe: withFilter(
                () => pubsub.asyncIterator(NEW_CONNECTION),
                (payload, args) => {
                    return payload.userId === args.userId;
                }
            )
        }
    },
    Connection: {
        async users(connection) {
            return (await connection.populate('users').execPopulate()).users;
        },
    }
};
