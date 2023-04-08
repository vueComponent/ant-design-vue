import classNames from '../_util/classNames';
import type { PropType, ExtractPropTypes, CSSProperties } from 'vue';
import {
  inject,
  defineComponent,
  shallowRef,
  watch,
  onMounted,
  onBeforeUnmount,
  provide,
} from 'vue';
import PropTypes from '../_util/vue-types';
import { tuple } from '../_util/type';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import isNumeric from '../_util/isNumeric';
import BarsOutlined from '@ant-design/icons-vue/BarsOutlined';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import LeftOutlined from '@ant-design/icons-vue/LeftOutlined';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { SiderCollapsedKey, SiderHookProviderKey } from './injectionKey';

const dimensionMaxMap = {
  xs: '479.98px',
  sm: '575.98px',
  md: '767.98px',
  lg: '991.98px',
  xl: '1199.98px',
  xxl: '1599.98px',
  xxxl: '1999.98px',
};

export type CollapseType = 'clickTrigger' | 'responsive';

export const siderProps = () => ({
  prefixCls: String,
  collapsible: { type: Boolean, default: undefined },
  collapsed: { type: Boolean, default: undefined },
  defaultCollapsed: { type: Boolean, default: undefined },
  reverseArrow: { type: Boolean, default: undefined },
  zeroWidthTriggerStyle: {
    type: Object as PropType<CSSProperties>,
    default: undefined as CSSProperties,
  },
  trigger: PropTypes.any,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  collapsedWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  breakpoint: PropTypes.oneOf(tuple('xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl')),
  theme: PropTypes.oneOf(tuple('light', 'dark')).def('dark'),
  onBreakpoint: Function as PropType<(broken: boolean) => void>,
  onCollapse: Function as PropType<(collapsed: boolean, type: CollapseType) => void>,
});

export type SiderProps = Partial<ExtractPropTypes<ReturnType<typeof siderProps>>>;

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
  compatConfig: { MODE: 3 },
  name: 'ALayoutSider',
  inheritAttrs: false,
  props: initDefaultProps(siderProps(), {
    collapsible: false,
    defaultCollapsed: false,
    reverseArrow: false,
    width: 200,
    collapsedWidth: 80,
  }),
  emits: ['breakpoint', 'update:collapsed', 'collapse'],
  setup(props, { emit, attrs, slots }) {
    const { prefixCls } = useConfigInject('layout-sider', props);
    const siderHook = inject(SiderHookProviderKey, undefined);
    const collapsed = shallowRef(
      !!(props.collapsed !== undefined ? props.collapsed : props.defaultCollapsed),
    );
    const below = shallowRef(false);

    watch(
      () => props.collapsed,
      () => {
        collapsed.value = !!props.collapsed;
      },
    );

    provide(SiderCollapsedKey, collapsed);

    const handleSetCollapsed = (value: boolean, type: CollapseType) => {
      if (props.collapsed === undefined) {
        collapsed.value = value;
      }
      emit('update:collapsed', value);
      emit('collapse', value, type);
    };

    // ========================= Responsive =========================
    const responsiveHandlerRef = shallowRef<(mql: MediaQueryListEvent | MediaQueryList) => void>(
      (mql: MediaQueryListEvent | MediaQueryList) => {
        below.value = mql.matches;
        emit('breakpoint', mql.matches);

        if (collapsed.value !== mql.matches) {
          handleSetCollapsed(mql.matches, 'responsive');
        }
      },
    );
    let mql: MediaQueryList;
    function responsiveHandler(mql: MediaQueryListEvent | MediaQueryList) {
      return responsiveHandlerRef.value!(mql);
    }
    const uniqueId = generateId('ant-sider-');
    siderHook && siderHook.addSider(uniqueId);

    onMounted(() => {
      watch(
        () => props.breakpoint,
        () => {
          try {
            mql?.removeEventListener('change', responsiveHandler);
          } catch (error) {
            mql?.removeListener(responsiveHandler);
          }
          if (typeof window !== 'undefined') {
            const { matchMedia } = window;
            if (matchMedia! && props.breakpoint && props.breakpoint in dimensionMaxMap) {
              mql = matchMedia(`(max-width: ${dimensionMaxMap[props.breakpoint]})`);
              try {
                mql.addEventListener('change', responsiveHandler);
              } catch (error) {
                mql.addListener(responsiveHandler);
              }
              responsiveHandler(mql);
            }
          }
        },
        {
          immediate: true,
        },
      );
    });
    onBeforeUnmount(() => {
      try {
        mql?.removeEventListener('change', responsiveHandler);
      } catch (error) {
        mql?.removeListener(responsiveHandler);
      }
      siderHook && siderHook.removeSider(uniqueId);
    });

    const toggle = () => {
      handleSetCollapsed(!collapsed.value, 'clickTrigger');
    };

    return () => {
      const pre = prefixCls.value;
      const {
        collapsedWidth,
        width,
        reverseArrow,
        zeroWidthTriggerStyle,
        trigger = slots.trigger?.(),
        collapsible,
        theme,
      } = props;
      const rawWidth = collapsed.value ? collapsedWidth : width;
      // use "px" as fallback unit for width
      const siderWidth = isNumeric(rawWidth) ? `${rawWidth}px` : String(rawWidth);
      // special trigger when collapsedWidth == 0
      const zeroWidthTrigger =
        parseFloat(String(collapsedWidth || 0)) === 0 ? (
          <span
            onClick={toggle}
            class={classNames(
              `${pre}-zero-width-trigger`,
              `${pre}-zero-width-trigger-${reverseArrow ? 'right' : 'left'}`,
            )}
            style={zeroWidthTriggerStyle}
          >
            {trigger || <BarsOutlined />}
          </span>
        ) : null;
      const iconObj = {
        expanded: reverseArrow ? <RightOutlined /> : <LeftOutlined />,
        collapsed: reverseArrow ? <LeftOutlined /> : <RightOutlined />,
      };
      const status = collapsed.value ? 'collapsed' : 'expanded';
      const defaultTrigger = iconObj[status];
      const triggerDom =
        trigger !== null
          ? zeroWidthTrigger || (
              <div class={`${pre}-trigger`} onClick={toggle} style={{ width: siderWidth }}>
                {trigger || defaultTrigger}
              </div>
            )
          : null;
      const divStyle = [
        attrs.style as CSSProperties,
        {
          flex: `0 0 ${siderWidth}`,
          maxWidth: siderWidth, // Fix width transition bug in IE11
          minWidth: siderWidth, // https://github.com/ant-design/ant-design/issues/6349
          width: siderWidth,
        },
      ];
      const siderCls = classNames(
        pre,
        `${pre}-${theme}`,
        {
          [`${pre}-collapsed`]: !!collapsed.value,
          [`${pre}-has-trigger`]: collapsible && trigger !== null && !zeroWidthTrigger,
          [`${pre}-below`]: !!below.value,
          [`${pre}-zero-width`]: parseFloat(siderWidth) === 0,
        },
        attrs.class,
      );
      return (
        <aside {...attrs} class={siderCls} style={divStyle}>
          <div class={`${pre}-children`}>{slots.default?.()}</div>
          {collapsible || (below.value && zeroWidthTrigger) ? triggerDom : null}
        </aside>
      );
    };
  },
});
