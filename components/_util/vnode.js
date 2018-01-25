import cloneDeep from 'lodash.clonedeep'
export function cloneVNode (vnode, deep) {
  const componentOptions = vnode.componentOptions
  // if (componentOptions && componentOptions.listeners) {
  //   componentOptions.listeners = cloneDeep(componentOptions.listeners)
  // }

  // const data = vnode.data ? cloneDeep(vnode.data) : vnode.data
  const cloned = new vnode.constructor(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    componentOptions,
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
  const node = clone ? cloneVNode(n, true) : n
  const { props = {}, key, on = {}, listeners = {}} = nodeProps
  const data = node.data || {}
  const { style = data.style,
    class: cls = data.class,
    attrs = data.attrs,
    ref,
  } = nodeProps
  node.data = Object.assign({}, data, { style, attrs, class: cls })
  if (node.componentOptions) {
    node.componentOptions.propsData = node.componentOptions.propsData || {}
    node.componentOptions.listeners = node.componentOptions.listeners || {}
    node.componentOptions.propsData = { ...node.componentOptions.propsData, ...props }
    node.componentOptions.listeners = { ...node.componentOptions.listeners, ...listeners }
  }
  node.data.on = { ...(node.data.on || {}), ...on }

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
  return ele.data && (ele.data.class || ele.data.staticClass)
}

export function getStyle (ele) {
  return ele.data && (ele.data.style || ele.data.staticStyle)
}

export function filterEmpty (children = []) {
  return children.filter(c => c.tag || c.text.trim() !== '')
}

export function getEvents (child) {
  let events = {}
  if (child.componentOptions && child.componentOptions.listeners) {
    events = child.componentOptions.listeners
  } else if (child.data && child.data.on) {
    events = child.data.on
  }
  return events
}
