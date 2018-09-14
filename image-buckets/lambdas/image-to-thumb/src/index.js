'use strict';

// dependencies
var async = require('async');
var AWS = require('aws-sdk');
var gm = require('gm').subClass({ imageMagick: true }); // Enable ImageMagick integration.
var util = require('util');

// constants
var MAX_WIDTH  = 1000;
var MAX_HEIGHT = 1000;

const S3 = new AWS.S3({
    signatureVersion: 'v4',
});


exports.handler = function (event, context, callback) {
    const data = event.Records[0];

    // original image and bucket information
    const originalKey = data.s3.object.key;
    const originalBucket = data.s3.bucket.name;
    
    // new imgae and bucket information
    const newKey = `${originalKey}`;
    const newBucket = process.env.TARGET_BUCKET;

    // infer the image type.
	const typeMatch = originalKey.match(/\.([^.]*)$/);
	if (!typeMatch) {
		console.error('unable to infer image type for key ' + originalKey);
		return;
    }
    
    const imageType = typeMatch[1];
	if (imageType !== "jpg" && imageType !== "png" && imageType !== 'jpeg') {
		console.log('skipping non-image ' + originalKey);
		return;
    }
    
    // start image processing now
    async.waterfall([
        // download
        (next) => {
            S3.getObject({
                Bucket: originalBucket,
                Key: originalKey
            }, next);
        },
        // transform image
        (response, next) => {
            gm(response.Body).size(function(error, size) {
				// Infer the scaling factor to avoid stretching the image unnaturally.
				const scalingFactor = Math.min(
					MAX_WIDTH / size.width,
					MAX_HEIGHT / size.height
				);
				const width  = scalingFactor * size.width;
				const height = scalingFactor * size.height;

				// Transform the image buffer in memory.
				this.resize(width, height)
					.toBuffer(imageType, function(error, buffer) {
						if (error) {
							next(error);
						} else {
							next(null, response.ContentType, buffer);
						}
					});
			});
        },
        // save transformed image
        (contentType, data, next) => {
			// Stream the transformed image to a different S3 bucket.
			S3.putObject({
                Bucket: newBucket,
                Key: newKey,
                Body: data,
                ContentType: contentType
            }, next);
        }
    ],
    // handle final call
    (error) => {
        let message;
        if (error) {
            message = 'Unable to resize ' + originalBucket + '/' + originalKey +
                ' and upload to ' + newBucket + '/' + newKey +
                ' due to an error: ' + error;
        } else {
            message = 'Successfully resized ' + originalBucket + '/' + originalKey + 
            ' and uploaded to ' + newBucket + '/' + newKey;
        }

        console.log(message);

        context.done(error, message);
    });
};
