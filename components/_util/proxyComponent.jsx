
import PropTypes from './vue-types'
import { getOptionProps } from './props-util'

function getDisplayName (WrappedComponent) {
  return WrappedComponent.name || 'Component'
}
export default function wrapWithConnect (WrappedComponent) {
  const tempProps = WrappedComponent.props || {}
  const methods = WrappedComponent.methods || {}
  const props = {}
  Object.keys(tempProps).forEach(k => { props[k] = ({ ...k, required: false }) })
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
      const { $listeners, $slots = {}, $attrs, $scopedSlots } = this
      const props = getOptionProps(this)
      const wrapProps = {
        props: {
          ...props,
          __propsSymbol__: Symbol(),
          children: $slots.default || props.children || [],
        },
        on: $listeners,
        attrs: $attrs,
        scopedSlots: $scopedSlots,
      }
      return (
        <WrappedComponent {...wrapProps} ref='wrappedInstance'>
          {Object.keys($slots).map(name => {
            return <template slot={name}>{$slots[name]}</template>
          })}
        </WrappedComponent>
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
