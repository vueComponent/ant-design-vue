import PropTypes from './vue-types';
import { getOptionProps, getListeners } from './props-util';

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
    model: WrappedComponent.model,
    name: `Proxy_${getDisplayName(WrappedComponent)}`,
    methods: {
      getProxyWrappedInstance() {
        return this.$refs.wrappedInstance;
      },
    },
    render() {
      const { $slots = {}, $scopedSlots } = this;
      const props = getOptionProps(this);
      const wrapProps = {
        props: {
          ...props,
          __propsSymbol__: Symbol(),
          componentWillReceiveProps: { ...props },
          children: $slots.default || props.children || [],
        },
        on: getListeners(this),
      };
      if (Object.keys($scopedSlots).length) {
        wrapProps.scopedSlots = $scopedSlots;
      }
      const slotsKey = Object.keys($slots);
      return (
        <WrappedComponent {...wrapProps} ref="wrappedInstance">
          {slotsKey.length
            ? slotsKey.map(name => {
                return <template slot={name}>{$slots[name]}</template>;
              })
            : null}
        </WrappedComponent>
      );
    },
  };
  Object.keys(methods).map(m => {
    ProxyWrappedComponent.methods[m] = function() {
      return this.getProxyWrappedInstance()[m](...arguments);
    };
  });
  return ProxyWrappedComponent;
}
