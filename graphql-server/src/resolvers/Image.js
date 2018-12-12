
export default {
  faces: async (parent, args, context, info) => {
    const { id: imageId } = parent;
     const faces = await context.models.Face.getFacesForImage(imageId);
    return faces;
  },
  labels: async (parent, args, context, info) => {
    return parent.labels || [];
  },
}