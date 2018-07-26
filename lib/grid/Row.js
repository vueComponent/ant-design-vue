'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _extends4 = require('babel-runtime/helpers/extends');

var _extends5 = _interopRequireDefault(_extends4);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _vnode = require('../_util/vnode');

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

var BreakpointMap = _vueTypes2['default'].shape({
  xs: _vueTypes2['default'].string,
  sm: _vueTypes2['default'].string,
  md: _vueTypes2['default'].string,
  lg: _vueTypes2['default'].string,
  xl: _vueTypes2['default'].string,
  xxl: _vueTypes2['default'].strin
}).loose;

var RowProps = {
  gutter: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, BreakpointMap]),
  type: _vueTypes2['default'].oneOf(['flex']),
  align: _vueTypes2['default'].oneOf(['top', 'middle', 'bottom']),
  justify: _vueTypes2['default'].oneOf(['start', 'end', 'center', 'space-around', 'space-between']),
  prefixCls: _vueTypes2['default'].string
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

exports['default'] = {
  name: 'ARow',
  mixins: [_BaseMixin2['default']],
  props: (0, _extends5['default'])({}, RowProps, {
    gutter: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, BreakpointMap]).def(0)
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
            if ((0, _typeof3['default'])(_this.gutter) !== 'object') {
              return;
            }
            _this.setState(function (prevState) {
              return {
                screens: (0, _extends5['default'])({}, prevState.screens, (0, _defineProperty3['default'])({}, screen, true))
              };
            });
          },
          unmatch: function unmatch() {
            if ((0, _typeof3['default'])(_this.gutter) !== 'object') {
              return;
            }
            _this.setState(function (prevState) {
              return {
                screens: (0, _extends5['default'])({}, prevState.screens, (0, _defineProperty3['default'])({}, screen, false))
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

      if ((typeof gutter === 'undefined' ? 'undefined' : (0, _typeof3['default'])(gutter)) === 'object') {
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
    var classes = (_classes = {}, (0, _defineProperty3['default'])(_classes, prefixCls, !type), (0, _defineProperty3['default'])(_classes, prefixCls + '-' + type, type), (0, _defineProperty3['default'])(_classes, prefixCls + '-' + type + '-' + justify, type && justify), (0, _defineProperty3['default'])(_classes, prefixCls + '-' + type + '-' + align, type && align), _classes);
    var rowStyle = gutter > 0 ? {
      marginLeft: gutter / -2 + 'px',
      marginRight: gutter / -2 + 'px'
    } : {};
    var cols = ($slots['default'] || []).map(function (col) {
      if ((0, _propsUtil.isEmptyElement)(col)) {
        return null;
      }
      if ((0, _propsUtil.getOptionProps)(col) && gutter > 0) {
        return (0, _vnode.cloneElement)(col, {
          style: (0, _extends5['default'])({
            paddingLeft: gutter / 2 + 'px',
            paddingRight: gutter / 2 + 'px'
          }, (0, _propsUtil.getStyle)(col, true))
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
module.exports = exports['default'];