import uuid from 'uuid';

import RootModel from '../RootModel';

import {
  mapBoundinBox,
  mapAttributesObj,
  mapEmotions,
  mapAge,
  autorotateImage,
  resizeImage,
  getImageMeta,
  convertBase64ToImageBuffer,
} from './util';

import { Orientation } from '../TypeDefs';

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
      id: uuid.v4(),
      ...input,
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

  async convertToImage(base64String) {
    // create basic buffer from string
    const fileStr = base64String.replace(/^data:image\/\w+;base64,/, '');
    const file = Buffer.from(fileStr, 'base64');

    // create image buffer
    return convertBase64ToImageBuffer(file);
  }

  getS3ImagePath(filename) {
    return `${this.loggedInUserId()}/${filename}`;
  }

  async uploadNewImage(input) {
    const { file, name, type } = await input;

    // upload file to s3
    const bucketName = this.AwsClient.BucketsNames.IMAGE;
    const s3ImagePath = this.getS3ImagePath(name);
    
    // upload image
    return this.AwsClient.uploadImageToS3(bucketName, s3ImagePath, type, file)
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

    try {
      // rotate image
      const rotatedImage = await autorotateImage(file);

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

  async detectImageMeta(file) {
    // create buffer from received buffer content
    const buffer = new Buffer(file);
    
    try {
      const meta = await getImageMeta(buffer);

      const {
        size,
        width,
        height,
        density,
        format,
      } = meta;

      return {
        size,
        width,
        height,
        density,
        type: format,
        orientation: width >= height ? Orientation.LANDSCAPE : Orientation.PORTRAIT,
      };
    } catch (error) {
      console.log(error);
      return {};
    }
  }
}

export default Image;
