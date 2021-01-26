import { createVNode, defineComponent, inject, provide, watch } from 'vue';
import { injectExtraPropsKey } from './FunctionProvider';

export default function wrapWithConnect(WrappedComponent) {
  const tempProps = WrappedComponent.props || {};
  const props = {};
  Object.keys(tempProps).forEach(k => {
    props[k] = { ...tempProps[k], required: false };
  });
  const Connect = {
    name: `Connect_${WrappedComponent.name}`,
    inheritAttrs: false,
    props,
    setup(props) {
      provide(injectExtraPropsKey, undefined); // 断掉 injectExtraPropsKey 的依赖
      const injectExtraProps = injectExtraPropsKey ? inject(injectExtraPropsKey, () => ({})) : {};
      watch(injectExtraProps, () => {
        // 神奇的问题，vue 3.0.3 之后，没能正确响应式，暂时加个 watch hack 一下
      });
      return {
        props,
        injectExtraProps,
      };
    },
    methods: {
      getWrappedInstance() {
        return this.$refs.wrappedInstance;
      },
    },
    render() {
      const { $slots = {}, $attrs } = this;
      const props = { ...this.props, ...this.injectExtraProps };
      const wrapProps = {
        ...$attrs,
        ...props,
        ref: 'wrappedInstance',
      };
      // const slots = {};
      // for (let [key, value] of Object.entries($slots)) {
      //   slots[key] = () => value();
      // }
      return createVNode(WrappedComponent, wrapProps, $slots);
    },
  };
  return defineComponent(Connect);
}
