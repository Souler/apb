function arrayEqual(arr1, arr2) {
  return arr1.length == arr2.length
    && arr1.every((u, i) => u === arr2[i]);
}

export {
  arrayEqual,
};
