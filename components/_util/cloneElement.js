export default (node, nodeProps) => {
  const { props, style, class: cls, attrs, key } = nodeProps
  if (node.componentOptions) {
    const propsData = node.componentOptions.propsData
    Object.assign(propsData, nodeProps)
  }
  return node
}
