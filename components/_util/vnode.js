import { filterEmpty } from './props-util'
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

