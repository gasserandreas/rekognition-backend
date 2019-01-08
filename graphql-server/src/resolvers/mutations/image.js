import { handleAuth } from '../../auth';

export const addImage = async (parent, args, context, info) => {
  handleAuth(context);

  const { file, name, type, analyse } = await args.input;

  // parallel upload
  const uploadResult = await Promise.all([
    context.models.Image.uploadNewImage({ file, name, type }),
    context.models.Image.uploadNewThumb({ file, name, type }),
  ]);

  // get upload path from full image upload
  const { uploadPath } = uploadResult[0];

  // do rekognition if needed
  let labels = [];
  let faces = [];

  if (analyse) {
    // parallel rekognition call
    const rekognitionResults = await Promise.all([
      context.models.Image.detectLabels(uploadPath),
      context.models.Image.detectFaces(uploadPath)
    ]);

    labels = rekognitionResults[0];
    faces = rekognitionResults[1];
  }

  // create and store image
  const imageInput = {
    name,
    type,
    faces,
    labels,
  };
  const image = await context.models.Image.createImage(imageInput);

  return {
    image,
  };
};