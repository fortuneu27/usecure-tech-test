import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import schema from './schema/index.js'
import resolvers from './resolvers/index.js'
import db from './db.js'

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.PORT || 8000 },
  context: async () => ({ db }),
})

console.log(`Server ready at: ${url}graphql`);
