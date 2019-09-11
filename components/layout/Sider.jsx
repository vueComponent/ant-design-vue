// matchMedia polyfill for
// https://github.com/WickyNilliams/enquire.js/issues/82
if (typeof window !== 'undefined') {
  const matchMediaPolyfill = mediaQuery => {
    return {
      media: mediaQuery,
      matches: false,
      addListener() {},
      removeListener() {},
    };
  };
  window.matchMedia = window.matchMedia || matchMediaPolyfill;
}

import classNames from 'classnames';
import PropTypes from '../_util/vue-types';
import Icon from '../icon';
import {
  initDefaultProps,
  getOptionProps,
  hasProp,
  getComponentFromProp,
} from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import isNumeric from '../_util/isNumeric';
import { ConfigConsumerProps } from '../config-provider';

const dimensionMap = {
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1600px',
};

// export type CollapseType = 'clickTrigger' | 'responsive';

export const SiderProps = {
  prefixCls: PropTypes.string,
  collapsible: PropTypes.bool,
  collapsed: PropTypes.bool,
  defaultCollapsed: PropTypes.bool,
  reverseArrow: PropTypes.bool,
  // onCollapse?: (collapsed: boolean, type: CollapseType) => void;
  trigger: PropTypes.any,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  collapsedWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  breakpoint: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'xxl']),
  theme: PropTypes.oneOf(['light', 'dark']).def('dark'),
};

// export interface SiderState {
//   collapsed?: boolean;
//   below: boolean;
//   belowShow?: boolean;
// }

// export interface SiderContext {
//   siderCollapsed: boolean;
// }

const generateId = (() => {
  let i = 0;
  return (prefix = '') => {
    i += 1;
    return `${prefix}${i}`;
  };
})();

export default {
  name: 'ALayoutSider',
  __ANT_LAYOUT_SIDER: true,
  mixins: [BaseMixin],
  model: {
    prop: 'collapsed',
    event: 'collapse',
  },
  props: initDefaultProps(SiderProps, {
    collapsible: false,
    defaultCollapsed: false,
    reverseArrow: false,
    width: 200,
    collapsedWidth: 80,
  }),
  data() {
    this.uniqueId = generateId('ant-sider-');
    let matchMedia;
    if (typeof window !== 'undefined') {
      matchMedia = window.matchMedia;
    }
    const props = getOptionProps(this);
    if (matchMedia && props.breakpoint && props.breakpoint in dimensionMap) {
      this.mql = matchMedia(`(max-width: ${dimensionMap[props.breakpoint]})`);
    }
    let sCollapsed;
    if ('collapsed' in props) {
      sCollapsed = props.collapsed;
    } else {
      sCollapsed = props.defaultCollapsed;
    }
    return {
      sCollapsed,
      below: false,
      belowShow: false,
    };
  },
  provide() {
    return {
      layoutSiderContext: this, // menu组件中使用
    };
  },
  inject: {
    siderHook: { default: () => ({}) },
    configProvider: { default: () => ConfigConsumerProps },
  },
  // getChildContext() {
  //   return {
  //     siderCollapsed: this.state.collapsed,
  //     collapsedWidth: this.props.collapsedWidth,
  //   };
  // }
  watch: {
    collapsed(val) {
      this.setState({
        sCollapsed: val,
      });
    },
  },

  mounted() {
    this.$nextTick(() => {
      if (this.mql) {
        this.mql.addListener(this.responsiveHandler);
        this.responsiveHandler(this.mql);
      }

      if (this.siderHook.addSider) {
        this.siderHook.addSider(this.uniqueId);
      }
    });
  },

  beforeDestroy() {
    if (this.mql) {
      this.mql.removeListener(this.responsiveHandler);
    }

    if (this.siderHook.removeSider) {
      this.siderHook.removeSider(this.uniqueId);
    }
  },
  methods: {
    responsiveHandler(mql) {
      this.setState({ below: mql.matches });
      this.$emit('breakpoint', mql.matches);
      if (this.sCollapsed !== mql.matches) {
        this.setCollapsed(mql.matches, 'responsive');
      }
    },

    setCollapsed(collapsed, type) {
      if (!hasProp(this, 'collapsed')) {
        this.setState({
          sCollapsed: collapsed,
        });
      }
      this.$emit('collapse', collapsed, type);
    },

    toggle() {
      const collapsed = !this.sCollapsed;
      this.setCollapsed(collapsed, 'clickTrigger');
    },

    belowShowChange() {
      this.setState({ belowShow: !this.belowShow });
    },
  },

  render() {
    const {
      prefixCls: customizePrefixCls,
      theme,
      collapsible,
      reverseArrow,
      width,
      collapsedWidth,
    } = getOptionProps(this);
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('layout-sider', customizePrefixCls);

    const trigger = getComponentFromProp(this, 'trigger');
    const rawWidth = this.sCollapsed ? collapsedWidth : width;
    // use "px" as fallback unit for width
    const siderWidth = isNumeric(rawWidth) ? `${rawWidth}px` : String(rawWidth);
    // special trigger when collapsedWidth == 0
    const zeroWidthTrigger =
      parseFloat(String(collapsedWidth || 0)) === 0 ? (
        <span
          onClick={this.toggle}
          class={`${prefixCls}-zero-width-trigger ${prefixCls}-zero-width-trigger-${
            reverseArrow ? 'right' : 'left'
          }`}
        >
          <Icon type="bars" />
        </span>
      ) : null;
    const iconObj = {
      expanded: reverseArrow ? <Icon type="right" /> : <Icon type="left" />,
      collapsed: reverseArrow ? <Icon type="left" /> : <Icon type="right" />,
    };
    const status = this.sCollapsed ? 'collapsed' : 'expanded';
    const defaultTrigger = iconObj[status];
    const triggerDom =
      trigger !== null
        ? zeroWidthTrigger || (
            <div class={`${prefixCls}-trigger`} onClick={this.toggle} style={{ width: siderWidth }}>
              {trigger || defaultTrigger}
            </div>
          )
        : null;
    const divStyle = {
      // ...style,
      flex: `0 0 ${siderWidth}`,
      maxWidth: siderWidth, // Fix width transition bug in IE11
      minWidth: siderWidth, // https://github.com/ant-design/ant-design/issues/6349
      width: siderWidth,
    };
    const siderCls = classNames(prefixCls, `${prefixCls}-${theme}`, {
      [`${prefixCls}-collapsed`]: !!this.sCollapsed,
      [`${prefixCls}-has-trigger`]: collapsible && trigger !== null && !zeroWidthTrigger,
      [`${prefixCls}-below`]: !!this.below,
      [`${prefixCls}-zero-width`]: parseFloat(siderWidth) === 0,
    });
    const divProps = {
      on: this.$listeners,
      class: siderCls,
      style: divStyle,
    };
    return (
      <div {...divProps}>
        <div class={`${prefixCls}-children`}>{this.$slots.default}</div>
        {collapsible || (this.below && zeroWidthTrigger) ? triggerDom : null}
      </div>
    );
  },
};
