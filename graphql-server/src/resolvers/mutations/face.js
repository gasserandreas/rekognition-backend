import { handleAuth } from '../../auth';

export const addFaces = async (parent, args, context, info) => {
  handleAuth(context);

  // create input data
  const { input } = args;
  const { faces } = input;

  // create promises for parallel execution
  const promises = faces.map((face) => {
    return new Promise((resolve, reject) => {
      // save image to dynamo db
      context.models.Face.createFace(face)
        .then(newFace => resolve(newFace))
        .catch((error) => {
          console.log(error);
          reject(error);
        })
    });
  });

  // save faces to db
  const newFaces = await Promise.all(promises);

  return {
    faces: newFaces,
  };
}