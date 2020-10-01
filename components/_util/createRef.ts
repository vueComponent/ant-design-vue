interface RefObject<T> {
  readonly current: T | null;
}
function createRef<T>() {
  // const refObject = {
  //   current: null
  // }

  // Object.seal(refObject);

  // return refObject;
  function setRef(node: T) {
    Object.assign(setRef, { current: node });
  }
  return setRef;
}

export default createRef;
