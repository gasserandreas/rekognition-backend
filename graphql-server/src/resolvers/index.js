import MutationResolver from './Mutation';
import QueryResolver from './Query';
import ImageResolver from './Image';

export default  {
  Query: QueryResolver,
  Mutation: MutationResolver,
  Image: ImageResolver,
};
