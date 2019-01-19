import AWS from 'aws-sdk';

class AwsFactory {
  constructor(options = {
    local: false,
    awsConfig: null,
    buckets: [],
  }) {
    const { local, awsConfig, buckets } = options;

    if (!AWS) {
      throw new Error('Could not initialize AWS');
    }

    if (local) {
      if (!awsConfig) {
        throw new Error('Missing awsConfig in constructor');
      }

      // set config
      AWS.config.update(awsConfig);
    }

    // save bucket names
    this.BucketsNames = buckets;

    // set internal pointers
    this.buckets = [];
    this.rekognition = null;
  }

  // init aws methods
  initS3(name) {
    return new AWS.S3({
      params: { Bucket: name },
      // signatureVersion: 'v4',
    });
  }

  initRekognition() {
    return new AWS.Rekognition();
  };

  // aws method getters
  getBucket(name) {
    let bucket = this.buckets[name]
    if (bucket) {
      return bucket;
    }

    // create new
    bucket = this.initS3(name);
    this.buckets[name] = bucket;

    return bucket;
  }

  getRekognition() {
    if (!this.rekognition) {
      this.rekognition = new AWS.Rekognition();
    }

    return this.rekognition;
  }

  // s3 methods
  uploadImageToS3(bucketName, imageName, imageType, buffer) {
    const S3 = this.getBucket(bucketName);
  
    // upload code
    return S3.putObject(
      {
        Key: imageName,
        Body: buffer,
        ContentEncoding: 'base64',
        ContentType: imageType,
      },
    ).promise();
  };

  deleteS3Object(bucketName, key) {
    const S3 = this.getBucket(bucketName);

    return S3.deleteObject({
      Key: key,
    }).promise();
  }

  // rekognition utils
  parseDefaultAWSInformation(info) {
    return {
      value: info.Value,
      confidence: info.Confidence,
    };
  }
  
  parseAWSFaceObject(face) {
    const {
      AgeRange,
      Beard,
      Emotions,
      Eyeglasses,
      EyesOpen,
      Gender,
      MouthOpen,
      Mustache,
      Quality,
      Smile,
      Sunglasses,
      BoundingBox,
      Landmarks,
      Pose,
    } = face;
  
    const emotions = Emotions.map(emotion => ({
      value: emotion.Type,
      confidence: emotion.Confidence,
    }));
  
    // create new face object
    const parsedFace = {
      ageRange: `${AgeRange.Low} - ${AgeRange.High}`,
      beard: this.parseDefaultAWSInformation(Beard),
      emotions,
      eyeglasses: this.parseDefaultAWSInformation(Eyeglasses),
      eyesOpen: this.parseDefaultAWSInformation(EyesOpen),
      gender: this.parseDefaultAWSInformation(Gender),
      mouthOpen: this.parseDefaultAWSInformation(MouthOpen),
      mustache: this.parseDefaultAWSInformation(Mustache),
      smile: this.parseDefaultAWSInformation(Smile),
      sunglasses: this.parseDefaultAWSInformation(Sunglasses),
      brightness: {
        value: Quality.Brightness,
        confidence: 100.0,
      },
      sharpness: {
        value: Quality.Sharpness,
        confidence: 100.0,
      },
      boundingBox: BoundingBox,
      landmarks: Landmarks,
      pose: Pose,
    };
  
    return parsedFace;
  };

  // rekognition methods
  detectFaces(bucket, imageName) {
    const rekognition = this.getRekognition();
    const attributes = ['ALL'];
  
    // create options for api
    const options = {
      Image: {
        S3Object: {
          Bucket: bucket,
          Name: imageName,
        },
      },
      Attributes: attributes,
    };
  
    // detect faces
    return rekognition.detectFaces(options).promise()
      .then(({ FaceDetails }) => {
        // parse information
        const faces = FaceDetails.map(face => this.parseAWSFaceObject(face));
  
        return faces;
      });
  };

  detectLabels(bucket, imageName, maxLabels = 123, minConfidence = 50) {
    const rekognition = this.getRekognition();
  
    // create options for api
    const options = {
      Image: {
        S3Object: {
          Bucket: bucket,
          Name: imageName,
        },
      },
      MaxLabels: maxLabels,
      MinConfidence: minConfidence,
    };
  
    return rekognition.detectLabels(options).promise();
  };
}

export default AwsFactory;
