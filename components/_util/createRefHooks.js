const createRef = fn => {
  return {
    onVnodeBeforeMounted: vnode => {
      fn(vnode.component || vnode.el, vnode.key);
    },
    onVnodeUpdated: vnode => {
      fn(vnode.component || vnode.el, vnode.key);
    },
    onVnodeDestroyed: vnode => {
      fn(vnode.component || vnode.el, vnode.key);
    },
  };
};
export default createRef;
