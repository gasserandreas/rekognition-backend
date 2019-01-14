import { Orientation } from '../models/TypeDefs';

export default {
  path: async (parent, args, context, info) => {
    const { user_id, name } = parent;
    return `${user_id}/${name}`;
  },
  faces: async (parent, args, context, info) => {
    return parent.faces || [];
  },
  labels: async (parent, args, context, info) => {
    return parent.labels || [];
  },
  meta: async (parent, args, context, info) => {
    const { meta } = parent;

    if (meta) {
      return meat;
    }

    // return fallback
    return {
      type: parent.type || '',
      orientation: Orientation.LANDSCAPE,
      size: 0,
    };
  },
};
