'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SiderProps = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _propsUtil = require('../_util/props-util');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// matchMedia polyfill for
// https://github.com/WickyNilliams/enquire.js/issues/82
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
}

var dimensionMap = {
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1600px'

  // export type CollapseType = 'clickTrigger' | 'responsive';

};var SiderProps = exports.SiderProps = {
  prefixCls: _vueTypes2['default'].string,
  collapsible: _vueTypes2['default'].bool,
  collapsed: _vueTypes2['default'].bool,
  defaultCollapsed: _vueTypes2['default'].bool,
  reverseArrow: _vueTypes2['default'].bool,
  // onCollapse?: (collapsed: boolean, type: CollapseType) => void;
  trigger: _vueTypes2['default'].any,
  width: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].string]),
  collapsedWidth: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].string]),
  breakpoint: _vueTypes2['default'].oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'xxl'])

  // export interface SiderState {
  //   collapsed?: boolean;
  //   below: boolean;
  //   belowShow?: boolean;
  // }

  // export interface SiderContext {
  //   siderCollapsed: boolean;
  // }

};var generateId = function () {
  var i = 0;
  return function () {
    var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    i += 1;
    return '' + prefix + i;
  };
}();

exports['default'] = {
  name: 'ALayoutSider',
  __ANT_LAYOUT_SIDER: true,
  mixins: [_BaseMixin2['default']],
  props: (0, _propsUtil.initDefaultProps)(SiderProps, {
    prefixCls: 'ant-layout-sider',
    collapsible: false,
    defaultCollapsed: false,
    reverseArrow: false,
    width: 200,
    collapsedWidth: 80
  }),

  // static childContextTypes = {
  //   siderCollapsed: PropTypes.bool,
  //   collapsedWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  // };

  // static contextTypes = {
  //   siderHook: PropTypes.object,
  // };

  // private mql: MediaQueryList;
  // private uniqueId: string;

  data: function data() {
    this.uniqueId = generateId('ant-sider-');
    var matchMedia = void 0;
    if (typeof window !== 'undefined') {
      matchMedia = window.matchMedia;
    }
    var props = (0, _propsUtil.getOptionProps)(this);
    if (matchMedia && props.breakpoint && props.breakpoint in dimensionMap) {
      this.mql = matchMedia('(max-width: ' + dimensionMap[props.breakpoint] + ')');
    }
    var sCollapsed = void 0;
    if ('collapsed' in props) {
      sCollapsed = props.collapsed;
    } else {
      sCollapsed = props.defaultCollapsed;
    }
    return {
      sCollapsed: sCollapsed,
      below: false,
      belowShow: false
    };
  },
  provide: function provide() {
    return {
      layoutSiderContext: this // menu组件中使用
    };
  },

  inject: {
    siderHook: { 'default': {} }
  },
  // getChildContext() {
  //   return {
  //     siderCollapsed: this.state.collapsed,
  //     collapsedWidth: this.props.collapsedWidth,
  //   };
  // }
  watch: {
    collapsed: function collapsed(val) {
      this.setState({
        sCollapsed: val
      });
    }
  },

  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      if (_this.mql) {
        _this.mql.addListener(_this.responsiveHandler);
        _this.responsiveHandler(_this.mql);
      }

      if (_this.siderHook.addSider) {
        _this.siderHook.addSider(_this.uniqueId);
      }
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this.mql) {
      this.mql.removeListener(this.responsiveHandler);
    }

    if (this.siderHook.removeSider) {
      this.siderHook.removeSider(this.uniqueId);
    }
  },

  model: {
    prop: 'collapsed',
    event: 'collapse'
  },
  methods: {
    responsiveHandler: function responsiveHandler(mql) {
      this.setState({ below: mql.matches });
      if (this.sCollapsed !== mql.matches) {
        this.setCollapsed(mql.matches, 'responsive');
      }
    },
    setCollapsed: function setCollapsed(collapsed, type) {
      if (!(0, _propsUtil.hasProp)(this, 'collapsed')) {
        this.setState({
          sCollapsed: collapsed
        });
      }
      this.$emit('collapse', collapsed, type);
    },
    toggle: function toggle() {
      var collapsed = !this.sCollapsed;
      this.setCollapsed(collapsed, 'clickTrigger');
    },
    belowShowChange: function belowShowChange() {
      this.setState({ belowShow: !this.belowShow });
    }
  },

  render: function render() {
    var _classNames;

    var h = arguments[0];

    var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
        prefixCls = _getOptionProps.prefixCls,
        collapsible = _getOptionProps.collapsible,
        reverseArrow = _getOptionProps.reverseArrow,
        width = _getOptionProps.width,
        collapsedWidth = _getOptionProps.collapsedWidth;

    var trigger = (0, _propsUtil.getComponentFromProp)(this, 'trigger');
    var siderWidth = this.sCollapsed ? collapsedWidth : width;
    siderWidth = typeof siderWidth === 'string' ? siderWidth.replace('px', '') : siderWidth;
    // special trigger when collapsedWidth == 0
    var zeroWidthTrigger = collapsedWidth === 0 || collapsedWidth === '0' || collapsedWidth === '0px' ? h(
      'span',
      {
        on: {
          'click': this.toggle
        },
        'class': prefixCls + '-zero-width-trigger' },
      [h(_icon2['default'], {
        attrs: { type: 'bars' }
      })]
    ) : null;
    var iconObj = {
      'expanded': reverseArrow ? h(_icon2['default'], {
        attrs: { type: 'right' }
      }) : h(_icon2['default'], {
        attrs: { type: 'left' }
      }),
      'collapsed': reverseArrow ? h(_icon2['default'], {
        attrs: { type: 'left' }
      }) : h(_icon2['default'], {
        attrs: { type: 'right' }
      })
    };
    var status = this.sCollapsed ? 'collapsed' : 'expanded';
    var defaultTrigger = iconObj[status];
    var triggerDom = trigger !== null ? zeroWidthTrigger || h(
      'div',
      { 'class': prefixCls + '-trigger', on: {
          'click': this.toggle
        },
        style: { width: siderWidth + 'px' } },
      [trigger || defaultTrigger]
    ) : null;
    var divStyle = {
      // ...style,
      flex: '0 0 ' + siderWidth + 'px',
      maxWidth: siderWidth + 'px', // Fix width transition bug in IE11
      minWidth: siderWidth + 'px', // https://github.com/ant-design/ant-design/issues/6349
      width: siderWidth + 'px'
    };
    var siderCls = (0, _classnames2['default'])(prefixCls, (_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-collapsed', !!this.sCollapsed), (0, _defineProperty3['default'])(_classNames, prefixCls + '-has-trigger', collapsible && trigger !== null && !zeroWidthTrigger), (0, _defineProperty3['default'])(_classNames, prefixCls + '-below', !!this.below), (0, _defineProperty3['default'])(_classNames, prefixCls + '-zero-width', siderWidth === 0 || siderWidth === '0' || siderWidth === '0px'), _classNames));
    var divProps = {
      on: this.$listeners,
      'class': siderCls,
      style: divStyle
    };
    return h(
      'div',
      divProps,
      [h(
        'div',
        { 'class': prefixCls + '-children' },
        [this.$slots['default']]
      ), collapsible || this.below && zeroWidthTrigger ? triggerDom : null]
    );
  }
};