import {
  creatToken,
  createHash,
  compareHashes,
  createAuthError,
} from '../../auth';

export const signUpUser = async (parent, args, context, info) => {
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

export const loginUser = async (parent, args, context, info) => {
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