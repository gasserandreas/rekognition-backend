import uuid from 'uuid';

import RootModel from '../RootModel';

import {
  mapBoundinBox,
  mapAttributesObj,
  mapEmotions,
  mapAge,
  autorotateImage,
  resizeImage,
} from './util';

class Image extends RootModel {
  async getAll() {
    const params = {
      TableName: this.DynamoClient.Tables.IMAGE,
      KeyConditionExpression: 'user_id = :userId',
      ExpressionAttributeValues: {
        ':userId': this.loggedInUserId(),
      },
    };
  
    const response = await this.DynamoClient.query(params);

    return {
      items: response.Items,
      nextToken: '',
    };
  }

  async getById(id) {
    const params = {
      TableName: this.DynamoClient.Tables.IMAGE,
      Key: {
        id,
        'user_id': this.loggedInUserId(),
      },
    };

    const response = await this.DynamoClient.get(params);

    return response.Item || null;
  }

  async createImage(input) {
    const newImage = {
      ...input,
      id: uuid.v4(),
      user_id: this.loggedInUserId(),
      created: new Date().toISOString(),
    }

    const params = {
      TableName: this.DynamoClient.Tables.IMAGE,
      Item: newImage,
    };

    try {
      await this.DynamoClient.put(params);
      return newImage;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  getS3ImagePath(filename) {
    return `${this.loggedInUserId()}/${filename}`;
  }

  async uploadNewImage(input) {
    const { file, name, type } = await input;

    // upload file to s3
    const bucketName = this.AwsClient.BucketsNames.IMAGE;
    const s3ImagePath = this.getS3ImagePath(name);

    // create buffer from received buffer content
    const buffer = new Buffer(file);
    
    // upload image
    return this.AwsClient.uploadImageToS3(bucketName, s3ImagePath, type, buffer)
      .then(() => {
        return {
          uploadPath: s3ImagePath,
          name,
          type,
        };
      });
  }

  async uploadNewThumb(input) {
    const { file, name, type } = await input;

    const bucketName = this.AwsClient.BucketsNames.THUMB;
    const s3ImagePath = this.getS3ImagePath(name);

    // create buffer from received buffer content
    const buffer = new Buffer(file);

    try {
      // rotate image
      const rotatedImage = await autorotateImage(buffer);

      // resize image
      const resizedImage = await resizeImage(rotatedImage, name);

      // upload to S3
      return this.AwsClient.uploadImageToS3(bucketName, s3ImagePath, type, resizedImage)
        .then(() => {
          return {
            uploadPath: s3ImagePath,
            name,
            type,
          };
        });
    }
    catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }

  async detectLabels(imagePath) {
    const bucketName = this.AwsClient.BucketsNames.IMAGE;
    try {
      const result = await this.AwsClient.detectLabels(bucketName, imagePath);

      // parse label data
      const labels = result.Labels.map(({
        Name,
        Confidence,
        Instances,
        Parents,
      }) => ({
          id: uuid.v4(),
          name: Name,
          confidence: Confidence,
          instances: Instances.map(({ BoundingBox }) => mapBoundinBox(BoundingBox)),
          parents: Parents.map(({ Name}) => Name),
        })
      );

      return labels;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async detectFaces(imagePath) {
    const bucketName = this.AwsClient.BucketsNames.IMAGE;
    try {
      const result = await this.AwsClient.detectFaces(bucketName, imagePath);

      const faces = result.map(({
        emotions,
        boundingBox,
        ageRange,
        landmarks, // un-used right now
        ...faceAttrs,
      }) => {

        return {
          id: uuid.v4(),
          age: mapAge(ageRange),
          emotions: mapEmotions(emotions),
          position: mapBoundinBox(boundingBox),
          attributes: mapAttributesObj(faceAttrs),
        };
      });

      return faces;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}

export default Image;
