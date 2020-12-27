import classNames from '../_util/classNames';
import { inject, provide, PropType, defineComponent, nextTick } from 'vue';
import PropTypes from '../_util/vue-types';
import { tuple } from '../_util/type';
import { getOptionProps, hasProp, getComponent, getSlot } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import BaseMixin from '../_util/BaseMixin';
import isNumeric from '../_util/isNumeric';
import { defaultConfigProvider } from '../config-provider';
import BarsOutlined from '@ant-design/icons-vue/BarsOutlined';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import LeftOutlined from '@ant-design/icons-vue/LeftOutlined';
import omit from 'omit.js';
import { SiderHookProvider } from './layout';

const dimensionMaxMap = {
  xs: '479.98px',
  sm: '575.98px',
  md: '767.98px',
  lg: '991.98px',
  xl: '1199.98px',
  xxl: '1599.98px',
};

export type CollapseType = 'clickTrigger' | 'responsive';

export const SiderProps = {
  prefixCls: PropTypes.string,
  collapsible: PropTypes.looseBool,
  collapsed: PropTypes.looseBool,
  defaultCollapsed: PropTypes.looseBool,
  reverseArrow: PropTypes.looseBool,
  zeroWidthTriggerStyle: PropTypes.style,
  trigger: PropTypes.VNodeChild,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  collapsedWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  breakpoint: PropTypes.oneOf(tuple('xs', 'sm', 'md', 'lg', 'xl', 'xxl')),
  theme: PropTypes.oneOf(tuple('light', 'dark')).def('dark'),
  onBreakpoint: Function as PropType<(broken: boolean) => void>,
  onCollapse: Function as PropType<(collapsed: boolean, type: CollapseType) => void>,
};

// export interface SiderState {
//   collapsed?: boolean;
//   below: boolean;
//   belowShow?: boolean;
// }

export interface SiderContextProps {
  sCollapsed?: boolean;
  collapsedWidth?: string | number;
}

const generateId = (() => {
  let i = 0;
  return (prefix = '') => {
    i += 1;
    return `${prefix}${i}`;
  };
})();

export default defineComponent({
  name: 'ALayoutSider',
  mixins: [BaseMixin],
  inheritAttrs: false,
  __ANT_LAYOUT_SIDER: true,
  props: initDefaultProps(SiderProps, {
    collapsible: false,
    defaultCollapsed: false,
    reverseArrow: false,
    width: 200,
    collapsedWidth: 80,
  }),
  emits: ['breakpoint', 'update:collapsed', 'collapse'],
  setup() {
    return {
      siderHook: inject<SiderHookProvider>('siderHook', {}),
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  data() {
    const uniqueId = generateId('ant-sider-');
    let matchMedia: typeof window.matchMedia;
    if (typeof window !== 'undefined') {
      matchMedia = window.matchMedia;
    }
    const props = getOptionProps(this) as any;
    let mql: MediaQueryList;
    if (matchMedia && props.breakpoint && props.breakpoint in dimensionMaxMap) {
      mql = matchMedia(`(max-width: ${dimensionMaxMap[props.breakpoint]})`);
    }
    let sCollapsed: boolean;
    if ('collapsed' in props) {
      sCollapsed = props.collapsed;
    } else {
      sCollapsed = props.defaultCollapsed;
    }
    return {
      sCollapsed,
      below: false,
      belowShow: false,
      uniqueId,
      mql,
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

  mounted() {
    nextTick(() => {
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
    responsiveHandler(mql: MediaQueryListEvent | MediaQueryList) {
      this.setState({ below: mql.matches });
      this.$emit('breakpoint', mql.matches);
      if (this.sCollapsed !== mql.matches) {
        this.setCollapsed(mql.matches, 'responsive');
      }
    },

    setCollapsed(collapsed: boolean, type: CollapseType) {
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
    } = { ...getOptionProps(this), ...this.$attrs } as any;
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
});
