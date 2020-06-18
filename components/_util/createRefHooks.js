const createRefHooks = fn => {
  return {
    onVnodeBeforeMount: vnode => {
      fn(vnode.component || vnode.el, vnode.key);
    },
    onVnodeUpdated: vnode => {
      fn(vnode.component || vnode.el, vnode.key);
    },
    onVnodeUnmounted: vnode => {
      fn(null, vnode.key);
    },
  };
};
export default createRefHooks;
