
// import sub mutation
import * as AuthMutations from './mutations/auth';
import * as ImageMutations from './mutations/image';
import * as UserMutations from './mutations/user';

const empty = async (parent, args, context, info) => {
  return 'hello empty';
};

const Mutation = {
  empty,
  ...AuthMutations,
  ...ImageMutations,
  ...UserMutations,
};

export default Mutation;
