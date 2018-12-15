
// import sub mutation
import * as AuthMutations from './mutations/auth';
import * as ImageMutations from './mutations/image';
import * as FaceMutations from './mutations/face';

const empty = async (parent, args, context, info) => {
  return null;
};

const Mutation = {
  empty,
  ...AuthMutations,
  ...ImageMutations,
  ...FaceMutations,
};

export default Mutation;
