import _extends from 'babel-runtime/helpers/extends';

import PropTypes from '../_util/vue-types';
import align from 'dom-align';
import addEventListener from '../_util/Dom/addEventListener';
import { cloneElement } from '../_util/vnode.js';
import isWindow from './isWindow';
import clonedeep from 'lodash/cloneDeep';
import shallowequal from 'shallowequal';
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

export default {
  props: {
    childrenProps: PropTypes.object,
    align: PropTypes.object.isRequired,
    target: PropTypes.func.def(noop),
    monitorBufferTime: PropTypes.number.def(50),
    monitorWindowResize: PropTypes.bool.def(false),
    disabled: PropTypes.bool.def(false),
    visible: PropTypes.bool.def(false)
  },
  data: function data() {
    this.aligned = false;
    return {};
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.prevProps = _extends({}, _this.$props);
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
        if (prevProps.disabled || !shallowequal(prevProps.align, props.align)) {
          reAlign = true;
        } else {
          var lastTarget = prevProps.target();
          var currentTarget = props.target();
          if (isWindow(lastTarget) && isWindow(currentTarget)) {
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
      _this2.prevProps = _extends({}, _this2.$props, { align: clonedeep(_this2.$props.align) });
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.stopMonitorWindowResize();
  },

  methods: {
    startMonitorWindowResize: function startMonitorWindowResize() {
      if (!this.resizeHandler) {
        this.bufferMonitor = buffer(this.forceAlign, this.$props.monitorBufferTime);
        this.resizeHandler = addEventListener(window, 'resize', this.bufferMonitor);
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
        this.$listeners.align && this.$listeners.align(source, align(source, props.target(), props.align));
      }
    }
  },

  render: function render() {
    var childrenProps = this.$props.childrenProps;

    var child = this.$slots['default'][0];
    if (childrenProps) {
      return cloneElement(child, { props: childrenProps });
    }
    return child;
  }
};