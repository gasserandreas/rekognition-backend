'use strict';

exports.handler = function (event, context, callback) {
    console.log(event);
    console.log(context);

    const message = {
        event,
        context,
    };

    var response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
        },
        body: "<p>" + JSON.stringify(message) + "</p>",
    };
    callback(null, response);
};
