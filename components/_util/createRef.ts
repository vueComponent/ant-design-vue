interface RefObject<T> extends Function {
  current?: T | null;
}

function createRef<T>(): RefObject<T> {
  const func: RefObject<T> = (node: T | null) => {
    func.current = node;
  };
  return func;
}

export default createRef;
