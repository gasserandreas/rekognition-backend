
export default {
  faces: async (parent, args, context, info) => {
    return parent.faces || [];
  },
  labels: async (parent, args, context, info) => {
    return parent.labels || [];
  },
}
