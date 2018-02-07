const hasProp = (instance, prop) => {
  const $options = instance.$options || {}
  const propsData = $options.propsData || {}
  return prop in propsData
}
const slotHasProp = (slot, prop) => {
  const $options = slot.componentOptions || {}
  const propsData = $options.propsData || {}
  return prop in propsData
}
const filterProps = (props, propsData = {}) => {
  const res = {}
  Object.keys(props).forEach((k) => {
    if (k in propsData || props[k] !== undefined) {
      res[k] = props[k]
    }
  })
  return res
}
const getSlotOptions = (ele) => {
  let componentOptions = ele.componentOptions
  if (ele.$vnode) {
    componentOptions = ele.$vnode.componentOptions
  }
  return componentOptions.Ctor.options
}
const getOptionProps = (instance) => {
  const { $options = {}, $props = {}} = instance
  return filterProps($props, $options.propsData)
}

const getComponentFromProp = (instance, prop) => {
  const h = instance.$createElement
  const temp = instance[prop]
  if (temp !== undefined) {
    return typeof temp === 'function' ? temp(h) : temp
  }
  return instance.$slots[prop]
}

const getPropsData = (ele) => {
  let componentOptions = ele.componentOptions
  if (ele.$vnode) {
    componentOptions = ele.$vnode.componentOptions
  }
  return componentOptions && componentOptions.propsData
}
const getKey = (ele) => {
  let key = ele.key
  if (ele.$vnode) {
    key = ele.$vnode.key
  }
  return key
}
export { hasProp, filterProps, getOptionProps, getComponentFromProp, getSlotOptions, slotHasProp, getPropsData, getKey }
export default hasProp
