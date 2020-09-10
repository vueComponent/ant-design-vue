import classNames from '../_util/classNames';
import { inject, provide } from 'vue';
import PropTypes from '../_util/vue-types';
import {
  initDefaultProps,
  getOptionProps,
  hasProp,
  getComponent,
  getSlot,
} from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import isNumeric from '../_util/isNumeric';
import { ConfigConsumerProps } from '../config-provider';
import BarsOutlined from '@ant-design/icons-vue/BarsOutlined';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import LeftOutlined from '@ant-design/icons-vue/LeftOutlined';
import omit from 'omit.js';

const dimensionMaxMap = {
  xs: '479.98px',
  sm: '575.98px',
  md: '767.98px',
  lg: '991.98px',
  xl: '1199.98px',
  xxl: '1599.98px',
};

// export type CollapseType = 'clickTrigger' | 'responsive';

export const SiderProps = {
  prefixCls: PropTypes.string,
  collapsible: PropTypes.bool,
  collapsed: PropTypes.bool,
  defaultCollapsed: PropTypes.bool,
  reverseArrow: PropTypes.bool,
  // onCollapse?: (collapsed: boolean, type: CollapseType) => void;
  zeroWidthTriggerStyle: PropTypes.object,
  trigger: PropTypes.any,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  collapsedWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  breakpoint: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'xxl']),
  theme: PropTypes.oneOf(['light', 'dark']).def('dark'),
  onBreakpoint: PropTypes.func,
  onCollapse: PropTypes.func,
  'onUpdate:collapse': PropTypes.func,
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
    if (matchMedia && props.breakpoint && props.breakpoint in dimensionMaxMap) {
      this.mql = matchMedia(`(max-width: ${dimensionMaxMap[props.breakpoint]})`);
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
  watch: {
    collapsed(val) {
      this.setState({
        sCollapsed: val,
      });
    },
  },
  created() {
    provide('layoutSiderContext', this); // menu组件中使用
  },
  setup() {
    return {
      siderHook: inject('siderHook', {}),
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
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

  beforeUnmount() {
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
      this.$emit('update:collapsed', collapsed);
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
      class: className,
      theme,
      collapsible,
      reverseArrow,
      style,
      width,
      collapsedWidth,
      zeroWidthTriggerStyle,
      ...others
    } = { ...getOptionProps(this), ...this.$attrs };
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('layout-sider', customizePrefixCls);
    const divProps = omit(others, [
      'collapsed',
      'defaultCollapsed',
      'onCollapse',
      'breakpoint',
      'onBreakpoint',
      'siderHook',
      'zeroWidthTriggerStyle',
      'trigger',
      'onUpdate:collapse',
    ]);
    const trigger = getComponent(this, 'trigger');
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
          style={zeroWidthTriggerStyle}
        >
          <BarsOutlined />
        </span>
      ) : null;
    const iconObj = {
      expanded: reverseArrow ? <RightOutlined /> : <LeftOutlined />,
      collapsed: reverseArrow ? <LeftOutlined /> : <RightOutlined />,
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
      ...style,
      flex: `0 0 ${siderWidth}`,
      maxWidth: siderWidth, // Fix width transition bug in IE11
      minWidth: siderWidth, // https://github.com/ant-design/ant-design/issues/6349
      width: siderWidth,
    };
    const siderCls = classNames(className, prefixCls, `${prefixCls}-${theme}`, {
      [`${prefixCls}-collapsed`]: !!this.sCollapsed,
      [`${prefixCls}-has-trigger`]: collapsible && trigger !== null && !zeroWidthTrigger,
      [`${prefixCls}-below`]: !!this.below,
      [`${prefixCls}-zero-width`]: parseFloat(siderWidth) === 0,
    });
    return (
      <aside class={siderCls} {...divProps} style={divStyle}>
        <div class={`${prefixCls}-children`}>{getSlot(this)}</div>
        {collapsible || (this.below && zeroWidthTrigger) ? triggerDom : null}
      </aside>
    );
  },
};
