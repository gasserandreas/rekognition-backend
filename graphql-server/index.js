import { ApolloServer, gql } from 'apollo-server-lambda';

import { generateServer } from './src/server';

const server = generateServer(ApolloServer, gql);

export const graphql = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});

// server.listen().then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`)
// });

// export const graphql = async (event, context, callback) => {
//   try {
//     console.log(JSON.stringify({event, context}))

//     const origin = '';

//     const response = await new Promise((resolve, reject) => {
//       graphqlHandler(event, context, (err, response) => {
//         if (err) {
//           reject(err)
//           return
//         }
//         resolve(response)
//       })
//     })

//     console.log(response);

//     callback(null, {
//       // status: 200,
//       ...response,
//       headers: {
//         ...response.headers,
//         // ...(originMatch ? {
//         'Access-Control-Allow-Origin': origin,
//         'Access-Control-Allow-Credentials': 'true'
//         // } : {})
//       },
//     });

//   } catch (error) {
//     console.log(error)
//     callback(error)
//   }
// };
