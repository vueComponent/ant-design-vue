'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = {
  install: function install(Vue, options) {
    Vue.directive('ant-ref', {
      bind: function bind(el, binding, vnode) {
        binding.value(vnode);
      },
      update: function update(el, binding, vnode) {
        binding.value(vnode);
      },
      unbind: function unbind(el, binding, vnode) {
        binding.value(null);
      }
    });
  }
};
module.exports = exports['default'];