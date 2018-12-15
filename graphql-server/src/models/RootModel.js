class RootModel {
  constructor({ DynamoClient, auth }) {
    this.DynamoClient = DynamoClient;
    this.auth = auth;
  }

  isAuthenticated() {
    if (!this.auth) {
      return false;
    }

    const { userId } = this.auth;

    return !!userId;
  }

  loggedInUserId() {
    return this.isAuthenticated
      ? this.auth.userId
      : null;
  }
}

export default RootModel;