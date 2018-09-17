'use strict';

// dependencies
var async = require('async');
var AWS = require('aws-sdk');
var gm = require('gm').subClass({ imageMagick: true }); // Enable ImageMagick integration.
var jo = require('jpeg-autorotate');
var util = require('util');

// constants
var MAX_WIDTH  = 1000;
var MAX_HEIGHT = 1000;

const S3 = new AWS.S3({
    signatureVersion: 'v4',
});

// Rotate an image given a buffer
var autorotateImage = function(data, callback) {
    jo.rotate(data, {}, function(error, buffer, orientation) {
        if (!error) {
            console.log('Orientation was: ' + orientation);
            callback(null, buffer);
        } else if (error.code === 'no_orientation' || error.code === 'correct_orientation') {
            console.log('no rotation needed');
            callback(null, buffer);
        } else {
            console.log(error);
            console.log(JSON.stringify(error));
            console.log('An error occurred when rotating the file: ' + error.message);
            callback(error, null);
        }
    });
  };

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
        (response, next) => {
            autorotateImage(response.Body, function(error, image) {
                if (error) {
                    console.log(error);
                    next('Error rotating image: ' + error);
                } else {
                    next(null, {
                        image: image,
                        response: response,
                    });
                }
            });
        },
        (params, next) => {
            const image = params.image;
            const response = params.response;
            console.log('start transformation');
            gm(image).size(function(error, size) {
                console.log('loaded image');
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
