// type JSONValue = string | number | boolean | { [key: string]: JSONValue };

// interface JSONObject {
//   [key: string]: JSONValue;
// }

export function flattenJson(jsonArray: object[]): object[] {
  const flattenedArray: object[] = [];

  for (const obj of jsonArray) {
    const flattenedObj: object = {};

    for (const key in obj) {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        const nestedObject = obj[key] as object;
        for (const nestedKey in nestedObject) {
          flattenedObj[`${key.toLowerCase()}.${nestedKey}`] =
            nestedObject[nestedKey];
        }
      } else {
        flattenedObj[key] = obj[key];
      }
    }

    flattenedArray.push(flattenedObj);
  }

  return flattenedArray;
}
