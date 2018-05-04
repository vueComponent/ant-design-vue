// export this package's api
import createForm from './createForm'
import createFormField from './createFormField'
import formShape from './propTypes'
import Vue from 'vue'

Vue.directive('ant-ref', {
  bind: function (el, binding, vnode) {
    binding.value(vnode)
  },
  unbind: function (el, binding, vnode) {
    binding.value()
  },
})

export { createForm, createFormField, formShape }
