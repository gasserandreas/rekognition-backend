mutation {
  addFaces(input: {
    faces: [
      {
        image_id:"366a36a7-99a4-48ae-9dd8-f9a785608152"
        age: {
          high: 43
        	low: 26
        }
        position: {
          height: 0.10136637836695
          left: 0.19194595515728
          top: 0.22949470579624
          width: 0.058165233582258
        }
        emotions: [
          {
            confidence: 0.0
            value: null
            name: "CONFUSED"
          }, {
            value:null
            confidence:45.000030517578
            name:"ANGRY"
          },{
            value:null
            confidence:45.000106811523
            name:"SAD"
          },{
            value:null
            confidence:45.000087738037
            name:"CALM"
          },{
            value:null
            confidence:45.000373840332
            name:"DISGUSTED"
          },{
            value:null
            confidence:54.999057769775
            name:"HAPPY"
          },{
            value:null
            confidence:45.000156402588
            name:"SURPRISED"
          }
        ],
        attributes: [
          {
            confidence: 54.997039794922
            value: false
            name: "Beard"
          },
          {
            confidence: 55
            value: false
            name: "Eyeglasses"
          },
          {
            confidence: 54.95873260498
            value: true
            name: "EyesOpen"
          },
          {
            confidence: 53.73046875
            value: null
            name: "Gender"
          },
          {
            confidence: 54.999481201172
            value: true
            name: "MouthOpen"
          },
          {
            confidence: 54.999954223633
            value: false
            name: "Mustache"
          },
          {
            confidence: 54.999988555908
            value: true
            name: "Smile"
          },
          {
            confidence: 55
            value: false
            name: "Sunglasses"
          }
        ]
      }
    ]
  }) {
    faces {
      id
      image_id
      age {
        high
        low
      }
      emotions {
        name
        value
        confidence
      }
      attributes {
        name
        value
        confidence
      }
    }
  }
}