'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  methods: {
    setState: function setState(state, callback) {
      (0, _extends3['default'])(this.$data, typeof state === 'function' ? state(this.$data) : state);
      this.$nextTick(function () {
        callback && callback();
      });
    },
    __emit: function __emit() {
      // 直接调用listeners，底层组件不需要vueTool记录events
      var args = [].slice.call(arguments, 0);
      var filterEvent = [];
      var eventName = args[0];
      if (args.length && this.$listeners[eventName]) {
        if (filterEvent.includes(eventName)) {
          this.$emit.apply(this, [eventName].concat((0, _toConsumableArray3['default'])(args.slice(1))));
        } else {
          var _$listeners;

          (_$listeners = this.$listeners)[eventName].apply(_$listeners, (0, _toConsumableArray3['default'])(args.slice(1)));
        }
      }
    }
  }
};
module.exports = exports['default'];