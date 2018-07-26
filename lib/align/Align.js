'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _domAlign = require('dom-align');

var _domAlign2 = _interopRequireDefault(_domAlign);

var _addEventListener = require('../_util/Dom/addEventListener');

var _addEventListener2 = _interopRequireDefault(_addEventListener);

var _vnode = require('../_util/vnode.js');

var _isWindow = require('./isWindow');

var _isWindow2 = _interopRequireDefault(_isWindow);

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

function buffer(fn, ms) {
  var timer = void 0;

  function clear() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function bufferFn() {
    clear();
    timer = setTimeout(fn, ms);
  }

  bufferFn.clear = clear;

  return bufferFn;
}

exports['default'] = {
  props: {
    childrenProps: _vueTypes2['default'].object,
    align: _vueTypes2['default'].object.isRequired,
    target: _vueTypes2['default'].func.def(noop),
    monitorBufferTime: _vueTypes2['default'].number.def(50),
    monitorWindowResize: _vueTypes2['default'].bool.def(false),
    disabled: _vueTypes2['default'].bool.def(false),
    visible: _vueTypes2['default'].bool.def(false)
  },
  data: function data() {
    this.aligned = false;
    return {};
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.prevProps = (0, _extends3['default'])({}, _this.$props);
      var props = _this.$props;
      // if parent ref not attached .... use document.getElementById
      !_this.aligned && _this.forceAlign();
      if (!props.disabled && props.monitorWindowResize) {
        _this.startMonitorWindowResize();
      }
    });
  },
  updated: function updated() {
    var _this2 = this;

    this.$nextTick(function () {
      var prevProps = _this2.prevProps;
      var props = _this2.$props;
      var reAlign = false;
      if (!props.disabled && _this2.visible) {
        if (prevProps.disabled || !(0, _shallowequal2['default'])(prevProps.align, props.align)) {
          reAlign = true;
        } else {
          var lastTarget = prevProps.target();
          var currentTarget = props.target();
          if ((0, _isWindow2['default'])(lastTarget) && (0, _isWindow2['default'])(currentTarget)) {
            reAlign = false;
          } else if (lastTarget !== currentTarget) {
            reAlign = true;
          }
        }
      }

      if (reAlign) {
        _this2.forceAlign();
      }

      if (props.monitorWindowResize && !props.disabled) {
        _this2.startMonitorWindowResize();
      } else {
        _this2.stopMonitorWindowResize();
      }
      _this2.prevProps = (0, _extends3['default'])({}, _this2.$props, { align: (0, _cloneDeep2['default'])(_this2.$props.align) });
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.stopMonitorWindowResize();
  },

  methods: {
    startMonitorWindowResize: function startMonitorWindowResize() {
      if (!this.resizeHandler) {
        this.bufferMonitor = buffer(this.forceAlign, this.$props.monitorBufferTime);
        this.resizeHandler = (0, _addEventListener2['default'])(window, 'resize', this.bufferMonitor);
      }
    },
    stopMonitorWindowResize: function stopMonitorWindowResize() {
      if (this.resizeHandler) {
        this.bufferMonitor.clear();
        this.resizeHandler.remove();
        this.resizeHandler = null;
      }
    },
    forceAlign: function forceAlign() {
      var props = this.$props;
      if (!props.disabled) {
        var source = this.$el;
        this.aligned = true;
        this.$listeners.align && this.$listeners.align(source, (0, _domAlign2['default'])(source, props.target(), props.align));
      }
    }
  },

  render: function render() {
    var childrenProps = this.$props.childrenProps;

    var child = this.$slots['default'][0];
    if (childrenProps) {
      return (0, _vnode.cloneElement)(child, { props: childrenProps });
    }
    return child;
  }
};
module.exports = exports['default'];