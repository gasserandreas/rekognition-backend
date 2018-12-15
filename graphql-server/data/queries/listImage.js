query {
  listImage(limit: 0, nextToken: "") {
    items {
      id
      created
      type
      path
      faces {
        id
      	position {
          height
          width
          left
          top
        }
        emotions {
          name
          confidence
        }
        attributes {
          name
          value
          confidence
        }
      }
    }
    nextToken
  }
}