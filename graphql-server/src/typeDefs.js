
const generateTypeDefs = gql => gql`
  type Query {
    now: String
    getUserInfo(user_id: ID!): User
    getImage(image_id: ID!): Image
    listImage(limit: Int, nextToken: String): ImageConnection!
  }

  type Mutation {
    empty: String
    signUpUser(input: SignUpUserInput!): UserAuthPayload
    loginUser(input: LoginUserInput!): UserAuthPayload
    refreshToken(input: TokenRefreshInput!): UserAuthPayload
    emailInUse(input: EmailInUseInput!): Boolean
    addImage(input: AddImageInput!): AddImagePayload
  }

  # mutation payloads
  type UserAuthPayload {
    user: User!
    token: String!
  }

  type AddImagePayload {
    image: Image
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

  input TokenRefreshInput {
    token: String!
    userId: String!
  }

  input EmailInUseInput {
    email: String!
  }

  # image definitions
  type ImageConnection {
    items: [Image]!
    nextToken: String!
  }

  type Image {
    id: ID!
    name: String!
    type: String!
    path: String!
    created: String!
    faces: [Face]!
    labels: [Label]!
  }

  input AddImageInput {
    file: Upload!
    name: String!
    type: String!
    analyse: Boolean
  }

  # face definitions
  type Face {
    id: ID!
    position: BoundingBox
    age: FaceAge
    emotions: [Attribute]!
    attributes: [Attribute]!
  }

  type FaceAge {
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

  # misc definitions
  type Attribute {
    name: String!
    confidence: Float!
    value: String
  }

  type BoundingBox {
    height: Float!
    width: Float!
    left: Float!
    top: Float!
  }
`;

export default generateTypeDefs;
