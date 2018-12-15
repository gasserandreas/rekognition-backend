import { ApolloServer, gql } from 'apollo-server';

import { generateServer } from './src/server';

const server = generateServer(ApolloServer, gql, true);

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
});
