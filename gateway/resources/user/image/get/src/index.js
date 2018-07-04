'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = function (event, context, callback) {
  console.log(event);

  const { userId } = event.pathParameters;

  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    KeyConditionExpression: 'userId = :user',
    ExpressionAttributeValues: {
      ':user': userId,
    },
  };
  
    // fetch all images from the database
    dynamoDb.query(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': event.headers.origin,
        },
        body: 'Couldn\'t fetch images.',
      });
      return;
    }

    const orderedItems = result.Items.sort((a, b) => {
      const { created: aCreated } = a;
      const { created: bCreated } = b;

      // check if created is set
      if (!aCreated) return -1;
      if (!bCreated) return -1;

      // check for date differences
      if (aCreated > bCreated) return 1;
      else if (aCreated < bCreated) return -1;
      else return 0;
    });

    // create a response
    const response = {
      statusCode: 200,
      // body: JSON.stringify(result.Items),
      body: JSON.stringify(orderedItems),
      headers: { 'Access-Control-Allow-Origin': event.headers.origin },
    };
    callback(null, response);
  });
};
