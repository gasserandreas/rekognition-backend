import AWS from 'aws-sdk';

export const generateDynamoTables = tables => JSON.parse(tables)
  .map((str) => {
    // remove { } chars
    const subString = str.substring(1, str.length-1);
    // generate key and value attr
    const arr = subString.split(':');
    const key = arr[0];
    const value = arr[1];
    return {
      key,
      value,
    };
  })
  // convert array to config object
  .reduce((prev, cur) => ({
    ...prev,
    [cur.key]: cur.value,
  }), {});

class DynamoFactory {
  constructor(tables, options = {}) {
    if (!tables) {
      throw new Error("Tables are not defined");
    }

    this.Tables = tables;
    this.DocClient = new AWS.DynamoDB.DocumentClient(options);
  }

  query(params) {
    return new Promise((resolve, reject) => {
      this.DocClient.query(params, (error, data) => {
        if (error) {
          reject(error);
        }
        resolve(data);
      });
    });
  }

  put(params) {
    return new Promise((resolve, reject) => {
      this.DocClient.put(params, (error, data) => {
        if (error) {
          reject(error);
        }
        resolve(data);
      });
    });
  }

  update(params) {
    return new Promise((resolve, reject) => {
      this.DocClient.update(params, (error, data) => {
        if (error) {
          reject(error);
        }
        resolve(data);
      });
    });
  }

  get(params) {
    return new Promise((resolve, reject) => {
      this.DocClient.get(params, (error, data) => {
        if (error) {
          reject(error);
        }
        resolve(data);
      });
    });
  }
}

export default DynamoFactory;
