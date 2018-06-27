'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = function (event, context, callback) {
    console.log(event);
    console.log(event.pathParameters);
    const params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Key: {
            imageId: event.pathParameters.imageId,
            userId: event.pathParameters.userId,
        },
    };

    // fetch sample from the database
    dynamoDb.get(params, (error, result) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin': event.headers.origin
                },
                body: 'Couldn\'t fetch the sample item.',
            });
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Item),
            headers: { 'Access-Control-Allow-Origin': event.headers.origin },
        };
        callback(null, response);
    });
};
