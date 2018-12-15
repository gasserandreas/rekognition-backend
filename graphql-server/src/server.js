import generateTypeDefs from './typeDefs';
import dotenv from 'dotenv';

import UserModel from './models/User';
import ImageModel from './models/Image';

import resolvers from './resolvers';

import DynamoFactory, { generateDynamoTables } from './dynamo';

import { getAuthorizationUserId } from './auth';

// load .env vars
dotenv.config();

// create dynamo table name object
const {
  NODE_ENV,
  DYNAMODB_TABLE_NAMES,
} = process.env;

// translate vars into dynamo table config
const dynamoTables = generateDynamoTables(DYNAMODB_TABLE_NAMES);

const dynamoConfig = {
  ...NODE_ENV === 'local' ? {
    region: 'localhost',
    endpoint: 'http://localhost:4569',
  } : {},
};

// configure resolvers and graphql server
// const resolvers = {
//   Query: QueryResolver,
//   Mutation: MutationResolver,
//   Image: ImageResolver,
// };

export const generateServer = (Server, gql, local = false) => new Server({
  typeDefs: generateTypeDefs(gql),
  resolvers,
  context: (obj) => {
    const { event } = obj;
    let userId = null;

    // get auth from header
    const authorization = local
      ? obj.req.headers.authorization
      : obj.event.headers.Authorization;
    
    // translate to user id
    userId = getAuthorizationUserId(authorization);

    // prepared to add more auth data
    const auth = {
      userId,
    };

    // initialize data access
    const DynamoClient = new DynamoFactory(dynamoTables, dynamoConfig)
    
    const models = {
      User: new UserModel({ DynamoClient, auth }),
      Image: new ImageModel({ DynamoClient, auth }),
    };

    return {
      event,
      userId,
      models,
      auth,
    };
  }
});