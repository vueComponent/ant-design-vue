function createRef() {
  const func = function setRef(node) {
    func.current = node;
  };
  return func;
}

export default createRef;
