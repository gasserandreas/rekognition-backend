// import {
//   handleAuth,
// } from '../auth';

// import sub mutation
import * as AuthMutations from './mutations/auth';
import * as ImageMutations from './mutations/image';
import * as FaceMutations from './mutations/face';

// const addImage = async (parent, args, context, info) => {
//   handleAuth(context);
//   const newImage = await context.models.Image.createImage(args.input);
//   return {
//     image: newImage,
//   };
// }

const Mutation = {
  // addImage,
  ...AuthMutations,
  ...ImageMutations,
  ...FaceMutations,
};

export default Mutation;
