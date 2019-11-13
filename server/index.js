const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./utils/typeDefs');
const resolvers = require('./utils/resolvers');
const { DB } = require('./env');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req })
});

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database Connection Established.');
    return server.listen({ port: 5000 });
  })
  .then(res => {
    console.log(`🚀 Server UI available at ${res.url}`);
  });
