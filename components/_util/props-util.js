const hasProp = (instance, prop) => {
  const $options = instance.$options || {}
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

const getOptionProps = (instance) => {
  const { $options = {}, $props = {}} = instance
  return filterProps($props, $options.propsData)
}

export { hasProp, filterProps, getOptionProps }
export default hasProp
