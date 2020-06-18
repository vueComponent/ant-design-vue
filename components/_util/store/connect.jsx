import shallowEqual from 'shallowequal';
import { inject, createVNode, watchEffect } from 'vue';
import omit from 'omit.js';
import { getOptionProps } from '../props-util';
import PropTypes from '../vue-types';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.name || 'Component';
}

const defaultMapStateToProps = () => ({});
export default function connect(mapStateToProps) {
  const shouldSubscribe = !!mapStateToProps;
  const finnalMapStateToProps = mapStateToProps || defaultMapStateToProps;
  return function wrapWithConnect(WrappedComponent) {
    const tempProps = omit(WrappedComponent.props || {}, ['store']);
    const props = {
      __propsSymbol__: PropTypes.any,
    };
    Object.keys(tempProps).forEach(k => {
      props[k] = { ...tempProps[k], required: false };
    });
    const Connect = {
      name: `Connect_${getDisplayName(WrappedComponent)}`,
      inheritAttrs: false,
      props,
      setup() {
        return {
          storeContext: inject('storeContext', {}),
        };
      },
      data() {
        this.store = this.storeContext.store;
        this.preProps = omit(getOptionProps(this), ['__propsSymbol__']);
        watchEffect(() => {
          if (mapStateToProps && mapStateToProps.length === 2) {
            this.subscribed = finnalMapStateToProps(this.store.getState(), this.$props);
          }
        });
        return {
          subscribed: finnalMapStateToProps(this.store.getState(), this.$props),
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
          const props = getOptionProps(this);
          const nextSubscribed = finnalMapStateToProps(this.store.getState(), props);
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
        const props = getOptionProps(this);
        this.preProps = { ...props };
        const wrapProps = {
          ...props,
          ...subscribed,
          ...$attrs,
          store,
          ref: 'wrappedInstance',
        };
        return createVNode(WrappedComponent, wrapProps, $slots);
      },
    };
    return Connect;
  };
}
