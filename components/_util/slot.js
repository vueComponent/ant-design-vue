import Vue from 'vue';

// 获取插槽
export function getSlot(vm, name = 'default', props = {}) {
  if (!(vm instanceof Vue)) throw Error('Please input vue instance');
  const nodes1 = (vm.$scopedSlots[name] && vm.$scopedSlots[name](props)) || [];
  const nodes2 = vm.$slots[name] || [];
  if (nodes1.length && nodes2.length) {
    return [...nodes1, ...nodes2];
  } else if (nodes1.length) {
    return [...nodes1];
  } else if (nodes2.length) {
    return [...nodes2];
  } else {
    return [];
  }
}

// 判断是否有插槽
export function hasSlot(vm, name = 'default', props = {}) {
  if (!(vm instanceof Vue)) throw Error('Please input vue instance');
  const nodes1 = (vm.$scopedSlots[name] && vm.$scopedSlots[name](props)) || [];
  const nodes2 = vm.$slots[name] || [];
  if (nodes1.length || nodes2.length) {
    return true;
  } else {
    return false;
  }
}
