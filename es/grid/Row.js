import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _typeof from 'babel-runtime/helpers/typeof';
import _extends from 'babel-runtime/helpers/extends';

import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import { cloneElement } from '../_util/vnode';
import { isEmptyElement, getStyle, getOptionProps } from '../_util/props-util';
// matchMedia polyfill for
// https://github.com/WickyNilliams/enquire.js/issues/82
var enquire = null;
if (typeof window !== 'undefined') {
  var matchMediaPolyfill = function matchMediaPolyfill(mediaQuery) {
    return {
      media: mediaQuery,
      matches: false,
      addListener: function addListener() {},
      removeListener: function removeListener() {}
    };
  };
  window.matchMedia = window.matchMedia || matchMediaPolyfill;
  enquire = require('enquire.js');
}

var BreakpointMap = PropTypes.shape({
  xs: PropTypes.string,
  sm: PropTypes.string,
  md: PropTypes.string,
  lg: PropTypes.string,
  xl: PropTypes.string,
  xxl: PropTypes.strin
}).loose;

var RowProps = {
  gutter: PropTypes.oneOfType([PropTypes.number, BreakpointMap]),
  type: PropTypes.oneOf(['flex']),
  align: PropTypes.oneOf(['top', 'middle', 'bottom']),
  justify: PropTypes.oneOf(['start', 'end', 'center', 'space-around', 'space-between']),
  prefixCls: PropTypes.string
};

var responsiveArray = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];

var responsiveMap = {
  xs: '(max-width: 575px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1600px)'
};

export default {
  name: 'ARow',
  mixins: [BaseMixin],
  props: _extends({}, RowProps, {
    gutter: PropTypes.oneOfType([PropTypes.number, BreakpointMap]).def(0)
  }),
  data: function data() {
    return {
      screens: {}
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      Object.keys(responsiveMap).map(function (screen) {
        return enquire.register(responsiveMap[screen], {
          match: function match() {
            if (_typeof(_this.gutter) !== 'object') {
              return;
            }
            _this.setState(function (prevState) {
              return {
                screens: _extends({}, prevState.screens, _defineProperty({}, screen, true))
              };
            });
          },
          unmatch: function unmatch() {
            if (_typeof(_this.gutter) !== 'object') {
              return;
            }
            _this.setState(function (prevState) {
              return {
                screens: _extends({}, prevState.screens, _defineProperty({}, screen, false))
              };
            });
          },
          // Keep a empty destory to avoid triggering unmatch when unregister
          destroy: function destroy() {}
        });
      });
    });
  },
  beforeDestroy: function beforeDestroy() {
    Object.keys(responsiveMap).map(function (screen) {
      return enquire.unregister(responsiveMap[screen]);
    });
  },

  methods: {
    getGutter: function getGutter() {
      var gutter = this.gutter;

      if ((typeof gutter === 'undefined' ? 'undefined' : _typeof(gutter)) === 'object') {
        for (var i = 0; i <= responsiveArray.length; i++) {
          var breakpoint = responsiveArray[i];
          if (this.state.screens[breakpoint] && gutter[breakpoint] !== undefined) {
            return gutter[breakpoint];
          }
        }
      }
      return gutter;
    }
  },

  render: function render() {
    var _classes;

    var h = arguments[0];
    var type = this.type,
        justify = this.justify,
        align = this.align,
        _prefixCls = this.prefixCls,
        prefixCls = _prefixCls === undefined ? 'ant-row' : _prefixCls,
        $slots = this.$slots;

    var gutter = this.getGutter();
    var classes = (_classes = {}, _defineProperty(_classes, prefixCls, !type), _defineProperty(_classes, prefixCls + '-' + type, type), _defineProperty(_classes, prefixCls + '-' + type + '-' + justify, type && justify), _defineProperty(_classes, prefixCls + '-' + type + '-' + align, type && align), _classes);
    var rowStyle = gutter > 0 ? {
      marginLeft: gutter / -2 + 'px',
      marginRight: gutter / -2 + 'px'
    } : {};
    var cols = ($slots['default'] || []).map(function (col) {
      if (isEmptyElement(col)) {
        return null;
      }
      if (getOptionProps(col) && gutter > 0) {
        return cloneElement(col, {
          style: _extends({
            paddingLeft: gutter / 2 + 'px',
            paddingRight: gutter / 2 + 'px'
          }, getStyle(col, true))
        });
      }
      return col;
    });
    return h(
      'div',
      { 'class': classes, style: rowStyle },
      [cols]
    );
  }
};