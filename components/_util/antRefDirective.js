export default {
  install: (Vue, options) => {
    Vue.directive('ant-ref', {
      bind: function (el, binding, vnode) {
        binding.value(vnode.componentInstance ? vnode.componentInstance : vnode.elm)
      },
      update: function (el, binding, vnode) {
        binding.value(vnode.componentInstance ? vnode.componentInstance : vnode.elm)
      },
      unbind: function (el, binding, vnode) {
        binding.value(null)
      },
    })
  },
}
