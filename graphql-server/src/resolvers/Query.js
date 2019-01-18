import { handleAuth } from '../auth';

const getImage = async (parent, args, context, info) => {
  handleAuth(context);
  const { image_id } = args;
  return context.models.Image.getById(image_id);
};

const listImage = async (parent, args, context, info) => {
  handleAuth(context);
  return context.models.Image.getAll();
};

const getUserInfo = async (parent, args, context, info) => {
  handleAuth(context);
  return context.models.User.getById(args.user_id);
};

const emailInUse = async (parent, args, context, info) => {
  const { input } = args;
  const { email, password } = input;

  // get user
  const user = await context.models.User.getByEmail(email);

  /**
   * if no user: return true, else false
   */
  return !!user;
};

const now = async (parent, args, context, info) => {
  return new Date().toISOString();
};

const Query = {
  now,
  getImage,
  listImage,
  getUserInfo,
  emailInUse,
};

export default Query;
