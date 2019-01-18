import uuid from 'uuid';

import RootModel from './RootModel';

import { createHash } from '../auth';

class User extends RootModel {
  async getById(id) {
    const params = {
      TableName: this.DynamoClient.Tables.USER,
      KeyConditionExpression: 'id = :userId',
      ExpressionAttributeValues: {
        ':userId': id,
      },
    };

    console.log('getById');
  
    const response = await this.DynamoClient.query(params);

    switch (response.Items.length) {
      case 1:
        return response.Items[0];
      default:
        return null;
    }
  }

  async getByEmail(email) {
    const params = {
      TableName: this.DynamoClient.Tables.USER,
      KeyConditionExpression: 'email = :e',
      ExpressionAttributeValues: {
        ':e': email,
      },
      IndexName: 'user_email',
      Limit: 1,
      ScanIndexForward: false,
    }

    try {
      const response = await this.DynamoClient.query(params);
      if (response.Items.length !== 1) {
        return null;
      }
      const userId = response.Items[0].id;
      const user = await this.getById(userId);
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async createUser(input) {
    const newUser = {
      ...input,
      id: uuid.v4(),
      password: await createHash(input.password),
    }

    const params = {
      TableName: this.DynamoClient.Tables.USER,
      Item: newUser,
    };

    try {
      await this.DynamoClient.put(params);
      return newUser;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateUser(input) {
    const id = this.loggedInUserId()

    const user = await this.getById(id);

    if (!user) {
      return null;
    }

    const newUser = {
      ...user,
      firstname: input.firstname,
      lastname: input.lastname,
      // email: input.email,
    };

    const params = {
      TableName: this.DynamoClient.Tables.USER,
      Key:{
        id,
      },
      // UpdateExpression: 'set firstname = :f, lastname = :l, email = :e',
      UpdateExpression: 'set firstname = :f, lastname = :l',
      ExpressionAttributeValues: {
        ':f': newUser.firstname,
        ':l': newUser.lastname,
        // ':e': newUser.email,
      },
    };

    try {
      await this.DynamoClient.update(params);
      return newUser;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default User;