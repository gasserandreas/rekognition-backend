import generateTypeDefs from './typeDefs';
import dotenv from 'dotenv';

import MutationResolver from './resolvers/Mutation';
import QueryResolver from './resolvers/Query';

import UserModel from './models/User';
import TodoModel from './models/Todo';

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
const resolvers = {
  Query: QueryResolver,
  Mutation: MutationResolver,
};

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
      Todo: new TodoModel({ DynamoClient, auth }),
    };

    return {
      event,
      userId,
      models,
      auth,
    };
  }
});