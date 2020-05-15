export function antPortal(Vue) {
  return Vue.directive('ant-portal', {
    inserted(el, binding) {
      const { value } = binding;
      const parentNode = typeof value === 'function' ? value(el) : value;
      if (parentNode !== el.parentNode) {
        parentNode.appendChild(el);
      }
    },
    componentUpdated(el, binding) {
      const { value } = binding;
      const parentNode = typeof value === 'function' ? value(el) : value;
      if (parentNode !== el.parentNode) {
        parentNode.appendChild(el);
      }
    },
  });
}

export default {
  install: Vue => {
    antPortal(Vue);
  },
};
