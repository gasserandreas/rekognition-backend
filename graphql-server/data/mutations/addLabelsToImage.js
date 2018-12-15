mutation {
  addLabelsToImage(input: {
    image_id: "4c30565d-97ee-4896-bb08-9cc7c42b0567"
    labels: [
      {
        confidence: 99.413528442383
        instances: [
          {
            height: 0.41568621993065
            left: 0.55300354957581
            top: 0.47527313232422
            width: 0.1860579252243
          }
        ]
        name: "Chair"
        parents: ["Furniture"]
      }
    ]
  }) {
    image {
      id
      created
      type
      path
      labels {
        id
        name
        confidence
      }
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
      labels {
        id
        name
        confidence
      }
    }
  }
}