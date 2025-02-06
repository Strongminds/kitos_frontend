// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyArrayContainsObject(arr: any[], obj: any) {
  console.log('arr: ', arr);
  console.log('obj: ', obj);
  return arr.some((entry) => {
    const keys = Object.keys(obj);
    return keys.every((key) => obj[key] === entry[key]);
  });
}
