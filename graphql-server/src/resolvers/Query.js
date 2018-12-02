import { handleAuth } from '../auth';

const listTodo = async (parent, args, context, info) => {
  handleAuth(context);
  return context.models.Todo.getAll();
};

const getUserInfo = async (parent, args, context, info) => {
  handleAuth(context);
  return context.models.User.getById(args.userId);
};

const now = async (parent, args, context, info) => {
  return new Date().toISOString();
}; 

const Query = {
  now,
  listTodo,
  getUserInfo,
};

export default Query;
