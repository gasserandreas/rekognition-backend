import uuid from 'uuid';

import RootModel from './RootModel';

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

  async uploadNewImage(input) {
    const { file, filename, type } = await input;

    // upload file to s3
    const bucketName = this.AwsClient.BucketsNames.IMAGE;
    const s3ImagePath = `${this.loggedInUserId()}/${filename}`;

    // create buffer from received buffer content
    const buffer = new Buffer(file);
    
    // upload image
    return this.AwsClient.uploadImageToS3(bucketName, s3ImagePath, type, buffer)
      .then(() => {
        return {
          uploadPath: s3ImagePath,
          filename,
          type,
        };
      });
  }

  async addLabels(id, labels) {
    const image = await this.getById(id);

    if (!image) {
      return null;
    }

    // add id to labels
    const newLabels = labels.map(label => ({
      ...label,
      id: uuid.v4(),
    }));

    const newImage = {
      ...image,
      labels: newLabels,
    };

    const params = {
      TableName: this.DynamoClient.Tables.IMAGE,
      Key:{
        id,
        'user_id': this.loggedInUserId(),
      },
      UpdateExpression: 'set labels = :l',
      ExpressionAttributeValues: {
        ':l': newLabels,
      },
    };

    try {
      await this.DynamoClient.update(params);
      return newImage;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async addFaces(id, faces) {
    const image = await this.getById(id);

    if (!image) {
      return null;
    }

    const newFaces =  faces.map(face => ({
      ...face,
      id: uuid.v4(),
      created: new Date().toISOString(),
    }));

    const newImage = {
      ...image,
      faces: newFaces,
    }

    const params = {
      TableName: this.DynamoClient.Tables.IMAGE,
      Key:{
        id,
        'user_id': this.loggedInUserId(),
      },
      UpdateExpression: 'set faces = :f',
      ExpressionAttributeValues: {
        ':f': newFaces,
      },
    };

    try {
      await this.DynamoClient.update(params);
      return newImage;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default Image;
