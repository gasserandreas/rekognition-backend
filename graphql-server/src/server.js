import generateTypeDefs from './typeDefs';
import dotenv from 'dotenv';

import UserModel from './models/User';
import ImageModel from './models/Image/image';

import resolvers from './resolvers';

import DynamoFactory from './dynamo';
import AwsFactory from './aws';

import { splitJsonStringToObject } from './util';
import { getAuthorizationUserId } from './auth';

// load .env vars
dotenv.config();

// create dynamo table name object
const {
  NODE_ENV,
  DYNAMODB_TABLE_NAMES,
  S3_BUCKET_NAMES,
  AWS_DEFAULT_REGION,
  AWS_DEFAULT_ACCESS_KEY_ID,
  AWS_DEFAULT_SECRET_ACCESS_KEY,
} = process.env;

// translate vars into dynamo table config
const dynamoTables = splitJsonStringToObject(DYNAMODB_TABLE_NAMES);
const buckets = splitJsonStringToObject(S3_BUCKET_NAMES);

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

    // initialize AWS access
    let AwsClient;
    if (local) {
      AwsClient = new AwsFactory({
        local: true,
        awsConfig: {
          accessKeyId: AWS_DEFAULT_ACCESS_KEY_ID,
          secretAccessKey: AWS_DEFAULT_SECRET_ACCESS_KEY,
          region: AWS_DEFAULT_REGION,
        },
        buckets,
      });
    } else {
      AwsClient = new AwsFactory({ buckets });
    }
    
    const models = {
      User: new UserModel({ DynamoClient, AwsClient, auth }),
      Image: new ImageModel({ DynamoClient, AwsClient, auth }),
    };

    return {
      event,
      userId,
      models,
      auth,
    };
  }
});