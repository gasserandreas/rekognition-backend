
// import sub mutation
import * as AuthMutations from './mutations/auth';
import * as ImageMutations from './mutations/image';

const Mutation = {
  ...AuthMutations,
  ...ImageMutations,
};

export default Mutation;
