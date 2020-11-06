import shallowEqual from '../shallowequal';
import { inject, createVNode, watchEffect, defineComponent, provide } from 'vue';
import omit from 'omit.js';
import { getOptionProps } from '../props-util';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.name || 'Component';
}

const defaultMapStateToProps = () => ({});
export default function connect(mapStateToProps, injectExtraPropsKey) {
  const shouldSubscribe = !!mapStateToProps;
  const finalMapStateToProps = mapStateToProps || defaultMapStateToProps;
  return function wrapWithConnect(WrappedComponent) {
    const tempProps = omit(WrappedComponent.props || {}, ['store']);
    const props = {};
    Object.keys(tempProps).forEach(k => {
      props[k] = { ...tempProps[k], required: false };
    });
    const Connect = {
      name: `Connect_${getDisplayName(WrappedComponent)}`,
      inheritAttrs: false,
      props,
      setup() {
        provide(injectExtraPropsKey, undefined); // 断掉 injectExtraPropsKey 的依赖
        return {
          storeContext: inject('storeContext', {}),
          injectExtraProps: injectExtraPropsKey ? inject(injectExtraPropsKey, () => ({})) : {},
        };
      },
      data() {
        this.store = this.storeContext.store;
        this.preProps = { ...getOptionProps(this), ...this.injectExtraProps };
        watchEffect(() => {
          if (mapStateToProps && mapStateToProps.length === 2) {
            this.subscribed = finalMapStateToProps(this.store.getState(), {
              ...this.$props,
              ...this.injectExtraProps,
            });
          }
        });
        return {
          subscribed: finalMapStateToProps(this.store.getState(), {
            ...this.$props,
            ...this.injectExtraProps,
          }),
        };
      },
      mounted() {
        this.trySubscribe();
      },

      beforeUnmount() {
        this.tryUnsubscribe();
      },
      methods: {
        handleChange() {
          if (!this.unsubscribe) {
            return;
          }
          const props = { ...getOptionProps(this), ...this.injectExtraProps };
          const nextSubscribed = finalMapStateToProps(this.store.getState(), props);
          if (
            !shallowEqual(this.preProps, props) ||
            !shallowEqual(this.subscribed, nextSubscribed)
          ) {
            this.subscribed = nextSubscribed;
          }
        },

        trySubscribe() {
          if (shouldSubscribe) {
            this.unsubscribe = this.store.subscribe(this.handleChange);
            this.handleChange();
          }
        },

        tryUnsubscribe() {
          if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
          }
        },
        getWrappedInstance() {
          return this.$refs.wrappedInstance;
        },
      },
      render() {
        const { $slots = {}, subscribed, store, $attrs } = this;
        const props = { ...getOptionProps(this), ...this.injectExtraProps };
        this.preProps = { ...props };
        const wrapProps = {
          ...$attrs,
          ...props,
          ...subscribed,
          store,
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
  };
}
