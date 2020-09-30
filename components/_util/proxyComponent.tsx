import { createVNode } from 'vue';
import PropTypes from './vue-types';
import { getOptionProps } from './props-util';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.name || 'Component';
}
let k = 1;
export default function wrapWithConnect(WrappedComponent) {
  const tempProps = WrappedComponent.props || {};
  const methods = WrappedComponent.methods || {};
  const props = {};
  Object.keys(tempProps).forEach(k => {
    props[k] = { ...tempProps[k], required: false };
  });
  WrappedComponent.props.__propsSymbol__ = PropTypes.any;
  WrappedComponent.props.children = PropTypes.array.def([]);
  const ProxyWrappedComponent = {
    props,
    inheritAttrs: false,
    name: `Proxy_${getDisplayName(WrappedComponent)}`,
    methods: {
      getProxyWrappedInstance() {
        return this.$refs.wrappedInstance;
      },
    },
    render() {
      const { $slots = {}, $attrs } = this;
      const props = getOptionProps(this);
      const wrapProps = {
        ...props,
        ...$attrs,
        __propsSymbol__: k++,
        ref: 'wrappedInstance',
      };
      const slots = {};
      for (let [key, value] of Object.entries($slots)) {
        slots[key] = () => value();
      }
      return createVNode(WrappedComponent, wrapProps, slots);
    },
  };
  Object.keys(methods).map(m => {
    ProxyWrappedComponent.methods[m] = function() {
      return this.getProxyWrappedInstance()[m](...arguments);
    };
  });
  return ProxyWrappedComponent;
}
