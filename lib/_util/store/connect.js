'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports['default'] = connect;

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

var _propsUtil = require('../props-util');

var _vueTypes = require('../vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function getDisplayName(WrappedComponent) {
  return WrappedComponent.name || 'Component';
}

var defaultMapStateToProps = function defaultMapStateToProps() {
  return {};
};
function connect(mapStateToProps) {
  var shouldSubscribe = !!mapStateToProps;
  var finnalMapStateToProps = mapStateToProps || defaultMapStateToProps;
  return function wrapWithConnect(WrappedComponent) {
    var tempProps = (0, _omit2['default'])(WrappedComponent.props || {}, ['store']);
    var props = {};
    Object.keys(tempProps).forEach(function (k) {
      props[k] = _vueTypes2['default'].any;
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
          if (!(0, _shallowequal2['default'])(this.nextState, nextState)) {
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

        var props = (0, _propsUtil.getOptionProps)(this);
        var wrapProps = {
          props: (0, _extends3['default'])({}, props, subscribed, {
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
module.exports = exports['default'];