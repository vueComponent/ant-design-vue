
import PropTypes from './vue-types'
import { getOptionProps } from './props-util'

function getDisplayName (WrappedComponent) {
  return WrappedComponent.name || 'Component'
}
export default function wrapWithConnect (WrappedComponent) {
  const tempProps = WrappedComponent.props || {}
  const methods = WrappedComponent.methods || {}
  const props = {}
  Object.keys(tempProps).forEach(k => { props[k] = PropTypes.any })
  WrappedComponent.props.__propsSymbol__ = PropTypes.any
  WrappedComponent.props.children = PropTypes.array.def([])
  const ProxyWrappedComponent = {
    props,
    model: WrappedComponent.model,
    name: `Proxy_${getDisplayName(WrappedComponent)}`,
    methods: {
      getProxyWrappedInstance () {
        return this.$refs.wrappedInstance
      },
    },
    render () {
      const { $listeners, $slots = {}, $attrs } = this
      const props = getOptionProps(this)
      const wrapProps = {
        props: {
          ...props,
          __propsSymbol__: Symbol(),
          children: $slots.default || [],
        },
        on: $listeners,
        attrs: $attrs,
      }
      return (
        <WrappedComponent {...wrapProps} ref='wrappedInstance'/>
      )
    },
  }
  Object.keys(methods).map(m => {
    ProxyWrappedComponent.methods[m] = function () {
      this.getProxyWrappedInstance()[m](...arguments)
    }
  })
  return ProxyWrappedComponent
}
