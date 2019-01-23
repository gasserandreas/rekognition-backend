import { Orientation } from '../models/TypeDefs';

export default {
  path: async (parent, args, context, info) => {
    const { user_id, name } = parent;
    return `${user_id}/${name}`;
  },
  faces: async (parent, args, context, info) => {
    const { faces } = parent;
    return {
      items: faces,
    };
  },
  labels: async (parent, args, context, info) => {
    const { labels } = parent;
    return {
      items: labels,
    };
  },
  meta: async (parent, args, context, info) => {
    const { meta } = parent;

    // get labels / faces numbers
    const numberOfFaces = parent.faces.length || 0;
    const numberOfLabels = parent.labels.length || 0;

    if (meta) {
      return {
        ...meta,
        numberOfFaces,
        numberOfLabels,
      }
    }

    // return fallback
    return {
      type: parent.type || '',
      orientation: Orientation.LANDSCAPE,
      size: 0,
      width: 0,
      height: 0,
      density: 0,
      numberOfFaces,
      numberOfLabels,
    };
  }
};
