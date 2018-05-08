export default {
  install: (Vue, options) => {
    Vue.directive('ant-ref', {
      bind: function (el, binding, vnode) {
        binding.value(vnode)
      },
      unbind: function (el, binding, vnode) {
        binding.value()
      },
    })
  },
}
