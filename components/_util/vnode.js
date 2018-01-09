import clonedeep from 'lodash.clonedeep'
// export function cloneVNode (vnode, deep) {
//   const cloned = new vnode.constructor(
//     vnode.tag,
//     clonedeep(vnode.data),
//     vnode.children,
//     vnode.text,
//     vnode.elm,
//     vnode.context,
//     clonedeep(vnode.componentOptions),
//     vnode.asyncFactory
//   )
//   cloned.ns = vnode.ns
//   cloned.isStatic = vnode.isStatic
//   cloned.key = vnode.key
//   cloned.isComment = vnode.isComment
//   cloned.isCloned = true
//   if (deep && vnode.children) {
//     cloned.children = cloneVNodes(vnode.children, deep)
//   }
//   return cloned
// }
export function cloneVNode (vnode, deep) {
  const componentOptions = vnode.componentOptions
  // if (componentOptions) {
  //   componentOptions.propsData = componentOptions.propsData ? clonedeep(componentOptions.propsData) : componentOptions.propsData
  // }

  const cloned = new vnode.constructor(
    vnode.tag,
    clonedeep(vnode.data),
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
  const { props = {}, key, on = {}} = nodeProps
  if (node.componentOptions) {
    node.componentOptions.propsData = node.componentOptions.propsData || {}
    node.componentOptions.listeners = node.componentOptions.listeners || {}
    Object.assign(node.componentOptions.propsData, props)
    Object.assign(node.componentOptions.listeners, on)
  }

  const data = node.data || {}
  const { style = data.style,
    class: cls = data.class,
    attrs = data.attrs,
    ref,
  } = nodeProps
  node.data = Object.assign(data, { style, attrs, class: cls, on: { ...(data.on || {}), ...on }})
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
