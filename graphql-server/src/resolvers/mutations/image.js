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
  let meta = null;

  if (analyse) {
    // parallel rekognition call
    const rekognitionResults = await Promise.all([
      context.models.Image.detectLabels(uploadPath),
      context.models.Image.detectFaces(uploadPath),
      context.models.Image.detectImageMeta(file),
    ]);

    labels = rekognitionResults[0];
    faces = rekognitionResults[1];
    meta = rekognitionResults[2];
  }

  // create and store image
  const imageInput = {
    name,
    type,
    faces,
    labels,
    meta,
  };
  console.log(imageInput);
  const image = await context.models.Image.createImage(imageInput);

  return {
    image,
  };
};