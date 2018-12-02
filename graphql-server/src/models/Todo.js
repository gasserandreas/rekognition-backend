import uuid from 'uuid';

import RootModel from './RootModel';

class Todo extends RootModel {
  async getAll() {
    const params = {
      TableName: this.DynamoClient.Tables.TODO,
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
      TableName: this.DynamoClient.Tables.TODO,
      Key: {
        id,
        'user_id': this.loggedInUserId(),
      },
    };

    const response = await this.DynamoClient.get(params);

    return response.Item || null;
  }

  async createTodo(input) {
    const newTodo = {
      ...input,
      id: uuid.v4(),
      completed: false,
      user_id: this.loggedInUserId(),
    }

    const params = {
      TableName: this.DynamoClient.Tables.TODO,
      Item: newTodo,
    };

    try {
      await this.DynamoClient.put(params);
      return newTodo;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async toggleTodoCompleted(id) {

    const todo = await this.getById(id);

    if (!todo) {
      return null;
    }

    const newTodo = {
      ...todo,
      completed: true,
    };

    const params = {
      TableName: this.DynamoClient.Tables.TODO,
      Key:{
        id,
        'user_id': this.loggedInUserId(),
      },
      UpdateExpression: 'set completed = :c',
      ExpressionAttributeValues: {
        ':c': true,
      },
    };

    try {
      await this.DynamoClient.update(params);
      return newTodo;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateTodoText(id, newMessage) {
    const todo = await this.getById(id);

    if (!todo) {
      return null;
    }

    const newTodo = {
      ...todo,
      newMessage,
    };

    const params = {
      TableName: this.DynamoClient.Tables.TODO,
      Key:{
        id,
        'user_id': this.loggedInUserId(),
      },
      UpdateExpression: 'set message = :v',
      ExpressionAttributeValues: {
        ':v': newMessage,
      },
    };

    try {
      await this.DynamoClient.update(params);
      return newTodo;
    } catch(error) {
      console.log(error);
      return null;
    }
  }
}

export default Todo;
