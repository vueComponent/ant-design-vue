import _defineProperty from 'babel-runtime/helpers/defineProperty';
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

import classNames from 'classnames';
import PropTypes from '../_util/vue-types';
import Icon from '../icon';
import { initDefaultProps, getOptionProps, hasProp, getComponentFromProp } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';

var dimensionMap = {
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1600px'

  // export type CollapseType = 'clickTrigger' | 'responsive';

};export var SiderProps = {
  prefixCls: PropTypes.string,
  collapsible: PropTypes.bool,
  collapsed: PropTypes.bool,
  defaultCollapsed: PropTypes.bool,
  reverseArrow: PropTypes.bool,
  // onCollapse?: (collapsed: boolean, type: CollapseType) => void;
  trigger: PropTypes.any,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  collapsedWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  breakpoint: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'xxl'])

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

export default {
  name: 'ALayoutSider',
  __ANT_LAYOUT_SIDER: true,
  mixins: [BaseMixin],
  props: initDefaultProps(SiderProps, {
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
    var props = getOptionProps(this);
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
      if (!hasProp(this, 'collapsed')) {
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

    var _getOptionProps = getOptionProps(this),
        prefixCls = _getOptionProps.prefixCls,
        collapsible = _getOptionProps.collapsible,
        reverseArrow = _getOptionProps.reverseArrow,
        width = _getOptionProps.width,
        collapsedWidth = _getOptionProps.collapsedWidth;

    var trigger = getComponentFromProp(this, 'trigger');
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
      [h(Icon, {
        attrs: { type: 'bars' }
      })]
    ) : null;
    var iconObj = {
      'expanded': reverseArrow ? h(Icon, {
        attrs: { type: 'right' }
      }) : h(Icon, {
        attrs: { type: 'left' }
      }),
      'collapsed': reverseArrow ? h(Icon, {
        attrs: { type: 'left' }
      }) : h(Icon, {
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
    var siderCls = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-collapsed', !!this.sCollapsed), _defineProperty(_classNames, prefixCls + '-has-trigger', collapsible && trigger !== null && !zeroWidthTrigger), _defineProperty(_classNames, prefixCls + '-below', !!this.below), _defineProperty(_classNames, prefixCls + '-zero-width', siderWidth === 0 || siderWidth === '0' || siderWidth === '0px'), _classNames));
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