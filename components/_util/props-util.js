import isPlainObject from 'lodash/isPlainObject'

const camelizeRE = /-(\w)/g
const camelize = (str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
}
const parseStyleText = (cssText = '', camel) => {
  const res = {}
  const listDelimiter = /;(?![^(]*\))/g
  const propertyDelimiter = /:(.+)/
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      const tmp = item.split(propertyDelimiter)
      if (tmp.length > 1) {
        const k = camel ? camelize(tmp[0].trim()) : tmp[0].trim()
        res[k] = tmp[1].trim()
      }
    }
  })
  return res
}

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
  return componentOptions ? componentOptions.Ctor.options || {} : {}
}
const getOptionProps = (instance) => {
  if (instance.componentOptions) {
    const componentOptions = instance.componentOptions
    const { propsData = {}, Ctor = {}} = componentOptions
    const props = (Ctor.options || {}).props || {}
    const res = {}
    for (const [k, v] of Object.entries(props)) {
      if (v.default !== undefined) {
        res[k] = typeof v.default === 'function' ? v.default() : v.default
      }
    }
    return { ...res, ...propsData }
  }
  const { $options = {}, $props = {}} = instance
  return filterProps($props, $options.propsData)
}

const getComponentFromProp = (instance, prop) => {
  if (instance.$createElement) {
    const h = instance.$createElement
    const temp = instance[prop]
    if (temp !== undefined) {
      return typeof temp === 'function' ? temp(h) : temp
    }
    return instance.$slots[prop]
  } else {
    const h = instance.context.$createElement
    const temp = getPropsData(instance)[prop]
    if (temp !== undefined) {
      return typeof temp === 'function' ? temp(h) : temp
    }
    const slotsProp = []
    const componentOptions = instance.componentOptions || {};
    (componentOptions.children || []).forEach((child) => {
      if (child.data && child.data.slot === prop) {
        if (child.tag === 'template') {
          slotsProp.push(child.children)
        } else {
          slotsProp.push(child)
        }
      }
    })
    return slotsProp.length ? slotsProp : undefined
  }
}

const getPropsData = (ele) => {
  let componentOptions = ele.componentOptions
  if (ele.$vnode) {
    componentOptions = ele.$vnode.componentOptions
  }
  return componentOptions ? componentOptions.propsData || {} : {}
}
const getValueByProp = (ele, prop) => {
  return getPropsData(ele)[prop]
}

const getAttrs = (ele) => {
  let data = ele.data
  if (ele.$vnode) {
    data = ele.$vnode.data
  }
  return data ? data.attrs || {} : {}
}

const getKey = (ele) => {
  let key = ele.key
  if (ele.$vnode) {
    key = ele.$vnode.key
  }
  return key
}

export function getEvents (child) {
  let events = {}
  if (child.componentOptions && child.componentOptions.listeners) {
    events = child.componentOptions.listeners
  } else if (child.data && child.data.on) {
    events = child.data.on
  }
  return { ...events }
}
export function getClass (ele) {
  let data = {}
  if (ele.data) {
    data = ele.data
  } else if (ele.$vnode && ele.$vnode.data) {
    data = ele.$vnode.data
  }
  const tempCls = data.class || data.staticClass
  let cls = {}
  if (typeof tempCls === 'string') {
    tempCls.split(' ').forEach(c => { cls[c.trim()] = true })
  } else {
    cls = tempCls
  }
  return cls
}
export function getStyle (ele, camel) {
  let data = {}
  if (ele.data) {
    data = ele.data
  } else if (ele.$vnode && ele.$vnode.data) {
    data = ele.$vnode.data
  }
  let style = data.style || data.staticStyle
  if (typeof style === 'string') {
    style = parseStyleText(style, camel)
  } else if (camel && style) { // 驼峰化
    const res = {}
    Object.keys(style).forEach(k => (res[camelize(k)] = style[k]))
    return res
  }
  return style
}

export function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

export function isEmptyElement (ele) {
  return !(ele.tag || ele.text.trim() !== '')
}

export function filterEmpty (children = []) {
  return children.filter(c => c.tag || c.text.trim() !== '')
}
const initDefaultProps = (propTypes, defaultProps) => {
  Object.keys(defaultProps).forEach(k => {
    if (propTypes[k]) {
      propTypes[k].def && (propTypes[k] = propTypes[k].def(defaultProps[k]))
    } else {
      throw new Error(
        `not have ${k} prop`,
      )
    }
  })
  return propTypes
}

export function mergeProps () {
  const args = [].slice.call(arguments, 0)
  const props = {}
  args.forEach((p, i) => {
    for (const [k, v] of Object.entries(p)) {
      props[k] = props[k] || {}
      if (isPlainObject(v)) {
        Object.assign(props[k], v)
      } else {
        props[k] = v
      }
    }
  })
  return props
}

function isValidElement (element) {
  const name = element.constructor.name
  return element.tag && (name === 'VNode' || name === 'VueComponent')
}

export {
  hasProp,
  filterProps,
  getOptionProps,
  getComponentFromProp,
  getSlotOptions,
  slotHasProp,
  getPropsData,
  getKey,
  getAttrs,
  getValueByProp,
  parseStyleText,
  initDefaultProps,
  isValidElement,
}
export default hasProp
