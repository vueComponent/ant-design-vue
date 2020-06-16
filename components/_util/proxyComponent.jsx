import { createVNode } from 'vue';
import PropTypes from './vue-types';
import { getOptionProps } from './props-util';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.name || 'Component';
}
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
    model: WrappedComponent.model,
    name: `Proxy_${getDisplayName(WrappedComponent)}`,
    methods: {
      getProxyWrappedInstance() {
        return this.$refs.wrappedInstance;
      },
    },
    render() {
      const { $slots = {} } = this;
      const props = getOptionProps(this);
      const wrapProps = {
        ...props,
        __propsSymbol__: Symbol(),
        componentWillReceiveProps: { ...props },
        children: props.children || $slots?.default() || [],
        slots: $slots,
        ref: 'wrappedInstance',
      };
      return createVNode(WrappedComponent, wrapProps);
      // return (
      //   <WrappedComponent {...wrapProps} ref="wrappedInstance">
      //   </WrappedComponent>
      // );
    },
  };
  Object.keys(methods).map(m => {
    ProxyWrappedComponent.methods[m] = function() {
      return this.getProxyWrappedInstance()[m](...arguments);
    };
  });
  return ProxyWrappedComponent;
}
