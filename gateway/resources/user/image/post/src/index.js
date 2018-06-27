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

const generateTLL = (days) => {
    const add = 86400 * days; // 60s * 60m * 24h
    const seconds = (new Date().getTime()) / 1000 // get as seconds
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
        || !validation(data.userId, 'string')
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

    const params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Item: {
          imageId: data.imageId,
          userId: data.userId,
          value: data.filename,
        //   TimeToExist: generateTLL(30),
          TimeToExist: generateTLL(1),
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


// exports.handler = function (event, context, callback) {
//     console.log(event);
//     console.log(context);

//     const message = {
//         event,
//         context,
//     };

//     var response = {
//         statusCode: 200,
//         headers: {
//             'Content-Type': 'text/html; charset=utf-8',
//         },
//         body: "<p>" + JSON.stringify(message) + "</p>",
//         // body: "<p>Hello world from get</p>" + "<code>" + JSON.stringify(event) + "<br /> " + JSON.stringify(context) + "</code>",
//     };
//     callback(null, response);
// };
