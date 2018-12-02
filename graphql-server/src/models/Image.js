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
}

export default Image;
