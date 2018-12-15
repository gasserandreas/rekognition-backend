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

const now = async (parent, args, context, info) => {
  console.log(parent);
  console.log(args);
  console.log(context);
  console.log(info);
  return new Date().toISOString();
}; 

const Query = {
  now,
  getImage,
  listImage,
  getUserInfo,
};

export default Query;
