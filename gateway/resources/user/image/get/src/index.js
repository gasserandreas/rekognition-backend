'use strict';

exports.handler = function (event, context, callback) {
    console.log(event);
    console.log(context);

    const message = {
        event,
        context,
    };

    console.log(event);
    console.log(event.pathParameters);

    var response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
        },
        body: "<p>" + JSON.stringify(message) + "</p>",
        // body: "<p>Hello world from get</p>" + "<code>" + JSON.stringify(event) + "<br /> " + JSON.stringify(context) + "</code>",
    };
    callback(null, response);
};
