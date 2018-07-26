import _extends from 'babel-runtime/helpers/extends';
import shallowEqual from 'shallowequal';
import omit from 'omit.js';
import { getOptionProps } from '../props-util';
import PropTypes from '../vue-types';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.name || 'Component';
}

var defaultMapStateToProps = function defaultMapStateToProps() {
  return {};
};
export default function connect(mapStateToProps) {
  var shouldSubscribe = !!mapStateToProps;
  var finnalMapStateToProps = mapStateToProps || defaultMapStateToProps;
  return function wrapWithConnect(WrappedComponent) {
    var tempProps = omit(WrappedComponent.props || {}, ['store']);
    var props = {};
    Object.keys(tempProps).forEach(function (k) {
      props[k] = PropTypes.any;
    });
    var Connect = {
      name: 'Connect_' + getDisplayName(WrappedComponent),
      props: props,
      inject: {
        _store: { 'default': {} }
      },
      data: function data() {
        this.store = this._store.store;
        return {
          subscribed: finnalMapStateToProps(this.store.getState(), this.$props)
        };
      },
      mounted: function mounted() {
        this.trySubscribe();
      },
      beforeDestroy: function beforeDestroy() {
        this.tryUnsubscribe();
      },

      methods: {
        handleChange: function handleChange() {
          if (!this.unsubscribe) {
            return;
          }

          var nextState = finnalMapStateToProps(this.store.getState(), this.$props);
          if (!shallowEqual(this.nextState, nextState)) {
            this.nextState = nextState;
            this.subscribed = nextState;
          }
        },
        trySubscribe: function trySubscribe() {
          if (shouldSubscribe) {
            this.unsubscribe = this.store.subscribe(this.handleChange);
            this.handleChange();
          }
        },
        tryUnsubscribe: function tryUnsubscribe() {
          if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
          }
        }
      },
      render: function render() {
        var h = arguments[0];
        var $listeners = this.$listeners,
            $slots = this.$slots,
            $attrs = this.$attrs,
            $scopedSlots = this.$scopedSlots,
            subscribed = this.subscribed,
            store = this.store;

        var props = getOptionProps(this);
        var wrapProps = {
          props: _extends({}, props, subscribed, {
            store: store
          }),
          on: $listeners,
          attrs: $attrs,
          slots: $slots,
          scopedSlots: $scopedSlots
        };
        return h(WrappedComponent, wrapProps);
      }
    };
    return Connect;
  };
}