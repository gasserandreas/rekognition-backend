import uuid from 'uuid';
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

export const addFacesToImage = async (parent, args, context, info) => {
  handleAuth(context);

  // create input data
  const { input } = args;
  const { image_id, faces } = input;

  const newImage = await context.models.Image.addFaces(image_id, faces);

  return {
    image: newImage,
  };
};
