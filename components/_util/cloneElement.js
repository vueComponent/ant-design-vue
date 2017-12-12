export default (node, props) => {
  if (node.componentOptions) {
    const propsData = node.componentOptions.propsData
    Object.assign(propsData, props)
  }
  return node
}
