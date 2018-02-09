export function cloneVNode (vnode, deep) {
  const componentOptions = vnode.componentOptions
  const data = vnode.data

  let listeners = {}
  if (componentOptions && componentOptions.listeners) {
    listeners = { ...componentOptions.listeners }
  }

  let on = {}
  if (data && data.on) {
    on = { ...data.on }
  }

  const cloned = new vnode.constructor(
    vnode.tag,
    data ? { ...data, on } : data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    componentOptions ? { ...componentOptions, listeners } : componentOptions,
    vnode.asyncFactory
  )
  cloned.ns = vnode.ns
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.fnContext = vnode.fnContext
  cloned.fnOptions = vnode.fnOptions
  cloned.fnScopeId = vnode.fnScopeId
  cloned.isCloned = true
  if (deep) {
    if (vnode.children) {
      cloned.children = cloneVNodes(vnode.children, true)
    }
    if (componentOptions && componentOptions.children) {
      componentOptions.children = cloneVNodes(componentOptions.children, true)
    }
  }
  return cloned
}

export function cloneVNodes (vnodes, deep) {
  const len = vnodes.length
  const res = new Array(len)
  for (let i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i], deep)
  }
  return res
}

export function cloneElement (n, nodeProps, clone) {
  let ele = n
  if (Array.isArray(n)) {
    ele = filterEmpty(n)[0]
  }
  if (!ele) {
    return null
  }
  const node = clone ? cloneVNode(ele, true) : ele
  const { props = {}, key, on = {}, children } = nodeProps
  const data = node.data || {}
  const { style = data.style,
    class: cls = data.class,
    attrs = data.attrs,
    ref,
    domProps = data.domProps,
  } = nodeProps
  node.data = Object.assign({}, data, { style, attrs, class: cls, domProps })
  if (node.componentOptions) {
    node.componentOptions.propsData = node.componentOptions.propsData || {}
    node.componentOptions.listeners = node.componentOptions.listeners || {}
    node.componentOptions.propsData = { ...node.componentOptions.propsData, ...props }
    node.componentOptions.listeners = { ...node.componentOptions.listeners, ...on }
    if (children) {
      node.componentOptions.children = children
    }
  } else {
    node.data.on = { ...(node.data.on || {}), ...on }
  }

  if (key !== undefined) {
    node.key = key
    node.data.key = key
  }
  if (typeof ref === 'string') {
    node.data.ref = ref
  }
  return node
}
export function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

export function isValidElement (ele) {
  return !!ele.tag
}
export function isEmptyElement (ele) {
  return !(ele.tag || ele.text.trim() !== '')
}

export function getClass (ele) {
  let data = {}
  if (ele.data) {
    data = ele.data
  } else if (ele.$vnode && ele.$vnode.data) {
    data = ele.$vnode.data
  }
  return data.class || data.staticClass
}

export function getStyle (ele) {
  let data = {}
  if (ele.data) {
    data = ele.data
  } else if (ele.$vnode && ele.$vnode.data) {
    data = ele.$vnode.data
  }
  return data.style || data.staticStyle
}

export function filterEmpty (children = []) {
  return children.filter(c => c.tag || c.text.trim() !== '')
}

export function getPropsData (ele) {
  return ele.componentOptions && ele.componentOptions.propsData
}
export function getValueByProp (ele, prop) {
  return ele.componentOptions && ele.componentOptions.propsData[prop]
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
