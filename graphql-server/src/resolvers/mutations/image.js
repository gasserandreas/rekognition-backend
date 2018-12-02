import { handleAuth } from '../../auth';

export const addImage = async (parent, args, context, info) => {
  handleAuth(context);
  const newImage = await context.models.Image.createImage(args.input);
  return {
    image: newImage,
  };
}