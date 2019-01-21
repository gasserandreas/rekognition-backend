import jo from 'jpeg-autorotate';
// import sharp from 'sharp';

// data mappers
export const mapBoundinBox = ({ Width, Height, Left, Top }) => ({
  width: Width,
  height: Height,
  left: Left,
  top: Top,
});

export const mapAttributesObj = (obj) => {
  return Object.keys(obj)
    .map((name) => {
      const { value, confidence } = obj[name];
      // only map value / confidence values
      if (!value || !confidence) {
        return null;
      }

      return {
        name,
        value,
        confidence,
      };
    })
    .filter(item => item !== null);
};

export const mapEmotions = (emotions) => {
  return emotions.map(({ value, confidence }) => ({
    name: value,
    confidence,
  }));
};

export const mapAge = (ageRange) => {
  const ages = ageRange.split(' - ');
  if (ages.length !== 2) {
    return null;
  }

  return {
    low: ages[0],
    high: ages[1],
  };
}

// image file helpers
export const autorotateImage = (data) => {
  return new Promise((resolve, reject) => {
    jo.rotate(data, {}, function(error, buffer, orientation) {
        if (!error) {
            console.log('Orientation was: ' + orientation);
            resolve(buffer);
        } else if (error.code === 'no_orientation' || error.code === 'correct_orientation') {
            resolve(buffer);
        } else {
            console.log(error);
            console.log(JSON.stringify(error));
            console.log('An error occurred when rotating the file: ' + error.message);
            reject(error);
        }
    });
  });
};

// export const resizeImage = (image, filename) => {
//   const MAX_WIDTH  = 1000;
//   const MAX_HEIGHT = 1000;

//   const typeMatch = filename.match(/\.([^.]*)$/);
//   if (!typeMatch) {
//     const error = `unable to infer image type for key ${filename}`;
//     reject(error);
//   }
    
//   const imageType = typeMatch[1];
//   if (imageType !== "jpg" && imageType !== "png" && imageType !== 'jpeg') {
//     const error = `skipping non-image ${filename}`;
//     reject(error);
//   }

//   return sharp(image)
//     .resize(MAX_WIDTH, MAX_HEIGHT, {
//       fit: 'inside',
//     })
//     .toBuffer();
// };

// export const getImageMeta = (image) => {
//   return sharp(image).metadata()
//     .then((meta) => {
//       return meta;
//     });
// };
