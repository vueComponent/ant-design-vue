export function getScopedSlots(context) {
  return context.$attrs && context.$attrs.scopedSlots ? context.$attrs.scopedSlots : context.$slots;
}
