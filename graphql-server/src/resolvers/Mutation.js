import {
  creatToken,
  createHash,
  compareHashes,
  createAuthError,
  handleAuth,
} from '../auth';

const createTodo = async (parent, args, context, info) => {
  handleAuth(context);
  const newTodo = await context.models.Todo.createTodo(args.input);
  return {
    todo: newTodo,
  };
};

const toggleTodoCompleted = async (parent, args, context, info) => {
  handleAuth(context);
  const newTodo = await context.models.Todo.toggleTodoCompleted(args.input.id);
  return {
    todo: newTodo,
  };
}; 

const updateTodoText = async (parent, args, context, info) => {
  handleAuth(context);
  const { input: { id, newMessage } } = args;
  const newTodo = await context.models.Todo.updateTodoText(id, newMessage);
  return {
    todo: newTodo,
  };
};

const signUpUser = async (parent, args, context, info) => {
  const { input } = args;
  const { email } = input;

  // check if user is already in system
  const user = await context.models.User.getByEmail(email);
  if (user) {
    throw new Error('Email is already registered');
  }

  // create new user
  const newUser = await context.models.User.createUser(input);
  if (!newUser) {
    throw createAuthError('Could not register user');
  }

  // create token
  const token = creatToken(newUser.id);

  return {
    token,
    user: newUser,
  };
};

const loginUser = async (parent, args, context, info) => {
  const { input } = args;
  const { email, password } = input;

  // get user
  const user = await context.models.User.getByEmail(email);

  if (!user) {
    throw createAuthError('Could not login user')
  }

  // validate password
  if (!compareHashes(user.password, await createHash(password))) {
    throw createAuthError('Could not login user')
  }
  
  // create token
  const token = creatToken(user.id);

  return {
    token,
    user,
  };
};

const Mutation = {
  createTodo,
  toggleTodoCompleted,
  updateTodoText,
  signUpUser,
  loginUser,
};

export default Mutation;
