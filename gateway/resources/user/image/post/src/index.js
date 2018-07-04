'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const validation = (value, type) => {
    if (!value) {
        return false;
    }
    return typeof value === type;
}

const getDateInSeconds = (date = new Date()) => {
    const seconds = date.getTime() / 1000;
    return ~~(seconds);
}

const generateTLL = (days) => {
    const add = 86400 * days; // 60s * 60m * 24h
    const seconds = getDateInSeconds();
    return ~~(seconds + add); // remove float pointer
}

exports.handler = function (event, context, callback) {
    const message = {
        event,
        context,
    };

    const data = JSON.parse(event.body);
    console.log(data);

    if (!data
        || !validation(data.filename, 'string')
        || !validation(data.imageId, 'string')) {
        console.error('Validation Failed');
        callback(null, {
            statusCode: 400,
            headers: {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': event.headers.origin,
            },
            body: 'Couldn\'t create the image item.',
        });
    }

    const { userId } = event.pathParameters;

    const params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Item: {
            userId,
            imageId: data.imageId,
            value: data.filename,
            created: getDateInSeconds(),
            TimeToExist: generateTLL(30),
        //   TimeToExist: generateTLL(1),
        },
    };

    // write the setting to the database
    dynamoDb.put(params, (error) => {
        // handle potential errors
        if (error) {
        console.error(error);
        callback(null, {
            statusCode: error.statusCode || 501,
            headers: { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': event.headers.origin },
            body: 'Couldn\'t create the image item.',
        });
        return;
        }

        // create a response
        const response = {
        statusCode: 200,
        body: JSON.stringify(params.Item),
        headers: { 'Access-Control-Allow-Origin': event.headers.origin },
        };
        callback(null, response);
    });
};
