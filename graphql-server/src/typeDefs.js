
const generateTypeDefs = gql => gql`
  type Query {
    now: String
    listTodo(limit: Int, nextToken: String): TodoConnection!
    getUserInfo(userId: ID!): User
  }

  type Mutation {
    createTodo(input: CreateTodoInput!): CreateTodoPayload
    toggleTodoCompleted(input: ToggleTodoCompletedInput!): ToggleTodoCompletedPayload
    updateTodoText(input: UpdateTodoTextInput!): UpdateTodoTextPayload
    signUpUser(input: SignUpUserInput!): UserAuthPayload
    loginUser(input: LoginUserInput!): UserAuthPayload
  }

  type User {
    id: ID!
    firstname: String!
    lastname: String!
    email: String!
  }

  # Auth definitions
  input SignUpUserInput {
    firstname: String!
    lastname: String!
    email: String!
    password: String!
  }

  input LoginUserInput {
    email: String!
    password: String!
  }

  type UserAuthPayload {
    user: User!
    token: String!
  }

  # todo definitions
  type TodoConnection {
    items: [Todo]!
    nextToken: String
  }

  type Todo {
    id: ID!
    message: String
    completed: Boolean
  }

  input CreateTodoInput {
    message: String!
  }

  type CreateTodoPayload {
    todo: Todo
  }

  input ToggleTodoCompletedInput {
    id: ID!
  }

  type ToggleTodoCompletedPayload {
    todo: Todo
  }

  # This is a specific update mutation instead of a general one, so we
  # don’t nest with a patch field .
  # Instead we just provide one field, newText, which signals intent.
  input UpdateTodoTextInput {
    id: ID!
    newMessage: String!
  }

  type UpdateTodoTextPayload {
    todo: Todo
  }
`;

export default generateTypeDefs;
