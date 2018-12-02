import uuid from 'uuid';

import RootModel from './RootModel';

class Face extends RootModel {
  async createFace(input) {
    const newFace = {
      ...input,
      id: uuid.v4(),
      created: new Date().toISOString(),
    }

    const params = {
      TableName: this.DynamoClient.Tables.FACE,
      Item: newFace,
    };

    try {
      await this.DynamoClient.put(params);
      return newFace;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getFacesForImage(imageId) {
    const params = {
      TableName: this.DynamoClient.Tables.FACE,
      KeyConditionExpression: 'image_id = :imageId',
      ExpressionAttributeValues: {
        ':imageId': imageId,
      },
    };
  
    const response = await this.DynamoClient.query(params);

    return response.Items;
  }
}

export default Face;
