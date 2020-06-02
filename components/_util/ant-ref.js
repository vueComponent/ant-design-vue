import { nextTick } from 'vue';
const antvRef = {
  beforeMount: function bind(el, binding, vnode) {
    nextTick(function() {
      binding.value(el, vnode.key);
    });
    binding.value(el, vnode.key);
  },
  updated: function update(el, binding, vnode, oldVnode) {
    if (oldVnode && oldVnode.directives) {
      let oldBinding = oldVnode.directives.find(function(directive) {
        return directive === antvRef;
      });
      if (oldBinding && oldBinding.value !== binding.value) {
        oldBinding && oldBinding.value(null, oldVnode.key);
        binding.value(el, vnode.key);
        return;
      }
    }
    // Should not have this situation
    if (vnode.el !== oldVnode.el) {
      binding.value(el, vnode.key);
    }
  },
  unmounted: function unbind(el, binding, vnode) {
    binding.value(null, vnode.key);
  },
};

export default antvRef;
