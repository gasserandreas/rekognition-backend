import {
  createToken,
  createHash,
  compareHashes,
  createAuthError,
  createValidationError,
  createUserInputError,
  getUserIdFromToken,
} from '../../auth';

export const signUpUser = async (parent, args, context, info) => {
  const { input } = args;
  const { email } = input;

  // check if user is already in system
  const user = await context.models.User.getByEmail(email);
  if (user) {
    throw new createValidationError('Email is already registered');
  }

  // create new user
  const newUser = await context.models.User.createUser(input);
  if (!newUser) {
    throw new createValidationError('Could not register user');
  }

  // create token
  const token = createToken(newUser.id);

  return {
    token,
    user: newUser,
  };
};

export const loginUser = async (parent, args, context, info) => {
  const { input } = args;
  const { email, password } = input;

  // get user
  const user = await context.models.User.getByEmail(email);

  if (!user) {
    throw createValidationError('Could not login user')
  }

  // validate password
  if (! await compareHashes(password, user.password)) {
    throw createValidationError('Could not login user')
  }
  
  // create token
  const token = createToken(user.id);

  return {
    token,
    user,
  };
};

export const refreshToken = async (parent, args, context, info) => {
  const { input } = args;
  const { token, userId } = input;

  if(userId !== getUserIdFromToken(token)) {
    throw createAuthError('Invalid token, userId combination');
  }

  // re-create token
  const newToken = createToken(userId);
  console.log(newToken);

  // get user
  const user = await context.models.User.getById(userId);

  if (!user) {
    throw createAuthError('Invalid token, userId combination');
  }

  return {
    token: newToken,
    user,
  };
};

export const emailInUse = async (parent, args, context, info) => {
  const { input } = args;
  const { email, password } = input;

  // get user
  const user = await context.models.User.getByEmail(email);

  /**
   * if no user: return true, else false
   */
  return !!user;
};
