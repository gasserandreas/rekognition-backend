
// import sub mutation
import * as AuthMutations from './mutations/auth';
import * as ImageMutations from './mutations/image';
import * as UserMutations from './mutations/user';

const Mutation = {
  ...AuthMutations,
  ...ImageMutations,
  ...UserMutations,
};

export default Mutation;
