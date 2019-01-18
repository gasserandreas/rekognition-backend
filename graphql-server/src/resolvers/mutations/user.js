import { handleAuth } from '../../auth';

export const updateUser = async (parent, args, context, info) => {
  handleAuth(context);

  const user = await context.models.User.updateUser(args.input);

  return {
    user,
  };
};
