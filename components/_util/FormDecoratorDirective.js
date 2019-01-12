export function antDecorator(Vue) {
  return Vue.directive('decorator', {});
}

export default {
  // just for tag
  install: (Vue, options) => {
    antDecorator(Vue);
  },
};
