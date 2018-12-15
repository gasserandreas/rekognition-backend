
// import sub mutation
import * as AuthMutations from './mutations/auth';
import * as ImageMutations from './mutations/image';

const empty = async (parent, args, context, info) => {
  return null;
};

const Mutation = {
  empty,
  ...AuthMutations,
  ...ImageMutations,
};

export default Mutation;
