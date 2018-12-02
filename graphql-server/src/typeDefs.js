
const generateTypeDefs = gql => gql`
  type Query {
    now: String
    getUserInfo(user_id: ID!): User
    getImage(image_id: ID!): Image
    listImage(limit: Int, nextToken: String): ImageConnection!
  }

  type Mutation {
    signUpUser(input: SignUpUserInput!): UserAuthPayload
    loginUser(input: LoginUserInput!): UserAuthPayload
    addImage(input: AddImageInput!): AddImagePayload
    addFaces(input: AddFacesInput!): AddFacesPayload
    addLabelsToImage(input: AddLabelsToImageInput!): AddLabelsToImagePayload
  }

  # mutation input definitions
  input AddFacesInput {
    faces: [FaceInput]!
  }

  input AddLabelsToImageInput {
    labels: [LabelInput]!
    image_id: ID!
  }

  # mutation payloads
  type UserAuthPayload {
    user: User!
    token: String!
  }

  type AddImagePayload {
    image: Image
  }

  type AddFacesPayload {
    faces: [Face]!
  }

  type AddLabelsToImagePayload {
    image: Image!
  }

  # --------------------
  # - type definitions -
  # --------------------

  # user definitions
  type User {
    id: ID!
    firstname: String!
    lastname: String!
    email: String!
  }

  # Auth definitions
  input SignUpUserInput {
    firstname: String!
    lastname: String!
    email: String!
    password: String!
  }

  input LoginUserInput {
    email: String!
    password: String!
  }

  # image definitions
  type ImageConnection {
    items: [Image]!
    nextToken: String!
  }

  type Image {
    id: ID!
    path: String!
    type: String!
    created: String!
    faces: [Face]!
    labels: [Label]!
  }

  input AddImageInput {
    path: String!
    type: String!
  }

  # face definitions
  type Face {
    id: ID!
    image_id: ID!
    position: BoundingBox!
    age: FaceAge!
    emotions: [Attribute]!
    attributes: [Attribute]!
  }

  input FaceInput {
    image_id: ID!
    position: BoundingBoxInput
    age: FaceAgeInput!
    emotions: [AttributeInput!]!
    attributes: [AttributeInput]!
  }

  type FaceAge {
    high: Float!
    low: Float!
  }

  input FaceAgeInput {
    high: Float!
    low: Float!
  }

  # label definitions
  type Label {
    id: ID!
    name: String!
    confidence: Float!
    parents: [String]!
    instances: [BoundingBox]!
  }

  input LabelInput {
    name: String!
    confidence: Float!
    parents: [String]!
    instances: [BoundingBoxInput]!
  }

  # misc definitions
  type Attribute {
    name: String!
    confidence: Float!
    value: Boolean
  }

  input AttributeInput {
    name: String!
    confidence: Float!
    value: Boolean
  }

  type BoundingBox {
    height: Float!
    width: Float!
    left: Float!
    top: Float!
  }

  input BoundingBoxInput {
    height: Float!
    width: Float!
    left: Float!
    top: Float!
  }
`;

export default generateTypeDefs;
