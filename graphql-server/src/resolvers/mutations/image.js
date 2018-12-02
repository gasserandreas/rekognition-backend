import { handleAuth } from '../../auth';

export const addImage = async (parent, args, context, info) => {
  handleAuth(context);
  const newImage = await context.models.Image.createImage(args.input);
  return {
    image: newImage,
  };
}

export const addLabelsToImage = async (parent, args, context, info) => {
  handleAuth(context);

  const { input } = args;
  const { image_id, labels } = input;

  const newImage = await context.models.Image.addLabels(image_id, labels);
  return {
    image: newImage,
  };
};
