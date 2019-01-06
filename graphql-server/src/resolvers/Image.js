
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
}
