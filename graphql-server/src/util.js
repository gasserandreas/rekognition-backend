export const splitJsonStringToObject = tables => JSON.parse(tables)
  .map((str) => {
    // remove { } chars
    const subString = str.substring(1, str.length-1);
    // generate key and value attr
    const arr = subString.split(':');
    const key = arr[0];
    const value = arr[1];
    return {
      key,
      value,
    };
  })
  // convert array to config object
  .reduce((prev, cur) => ({
    ...prev,
    [cur.key]: cur.value,
  }), {});
  