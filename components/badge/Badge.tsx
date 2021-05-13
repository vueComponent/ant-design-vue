import PropTypes from '../_util/vue-types';
import ScrollNumber from './ScrollNumber';
import classNames from '../_util/classNames';
import { getPropsSlot, flattenChildren } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import { getTransitionProps, Transition } from '../_util/transition';
import isNumeric from '../_util/isNumeric';
import { defaultConfigProvider } from '../config-provider';
import {
  inject,
  defineComponent,
  ExtractPropTypes,
  CSSProperties,
  VNode,
  App,
  Plugin,
  reactive,
  computed,
} from 'vue';
import { tuple } from '../_util/type';
import Ribbon from './Ribbon';
import { isPresetColor } from './utils';

export const badgeProps = {
  /** Number to show in badge */
  count: PropTypes.VNodeChild,
  showZero: PropTypes.looseBool,
  /** Max count to show */
  overflowCount: PropTypes.number.def(99),
  /** whether to show red dot without number */
  dot: PropTypes.looseBool,
  prefixCls: PropTypes.string,
  scrollNumberPrefixCls: PropTypes.string,
  status: PropTypes.oneOf(tuple('success', 'processing', 'default', 'error', 'warning')),
  // sync antd@4.6.0
  size: PropTypes.oneOf(tuple('default', 'small')).def('default'),
  color: PropTypes.string,
  text: PropTypes.VNodeChild,
  offset: PropTypes.arrayOf(PropTypes.oneOfType([String, Number])),
  numberStyle: PropTypes.style,
  title: PropTypes.string,
};

export type BadgeProps = Partial<ExtractPropTypes<typeof badgeProps>>;

const Badge = defineComponent({
  name: 'ABadge',
  Ribbon,
  props: badgeProps,
  setup(props, { slots }) {
    const configProvider = inject('configProvider', defaultConfigProvider);
    const state = reactive({
      badgeCount: undefined,
    });

    const getNumberedDispayCount = () => {
      const { overflowCount } = props;
      const count = state.badgeCount;
      const displayCount = count > overflowCount ? `${overflowCount}+` : count;
      return displayCount;
    };

    const getDispayCount = computed(() => {
      // dot mode don't need count
      if (isDot.value) {
        return '';
      }
      return getNumberedDispayCount();
    });

    const getScrollNumberTitle = () => {
      const { title } = props;
      const count = state.badgeCount;
      if (title) {
        return title;
      }
      return typeof count === 'string' || typeof count === 'number' ? count : undefined;
    };

    const getStyleWithOffset = () => {
      const { offset, numberStyle } = props;
      return offset
        ? {
            right: `${-parseInt(offset[0] as string, 10)}px`,
            marginTop: isNumeric(offset[1]) ? `${offset[1]}px` : offset[1],
            ...numberStyle,
          }
        : { ...numberStyle };
    };

    const hasStatus = computed(() => {
      const { status, color } = props;
      return !!status || !!color;
    });

    const isZero = computed(() => {
      const numberedDispayCount = getNumberedDispayCount();
      return numberedDispayCount === '0' || numberedDispayCount === 0;
    });

    const isDot = computed(() => {
      const { dot } = props;
      return (dot && !isZero.value) || hasStatus.value;
    });

    const isHidden = computed(() => {
      const { showZero } = props;
      const isEmpty =
        getDispayCount.value === null ||
        getDispayCount.value === undefined ||
        getDispayCount.value === '';
      return (isEmpty || (isZero.value && !showZero)) && !isDot.value;
    });

    const renderStatusText = (prefixCls: string) => {
      const text = getPropsSlot(slots, props, 'text');
      const hidden = isHidden.value;
      return hidden || !text ? null : <span class={`${prefixCls}-status-text`}>{text}</span>;
    };

    const getBadgeClassName = (prefixCls: string, children: VNode[]) => {
      const status = hasStatus.value;
      return classNames(prefixCls, {
        [`${prefixCls}-status`]: status,
        [`${prefixCls}-dot-status`]: status && props.dot && !isZero.value,
        [`${prefixCls}-not-a-wrapper`]: !children.length,
      });
    };

    const renderDispayComponent = () => {
      const count = state.badgeCount;
      const customNode = count;
      if (!customNode || typeof customNode !== 'object') {
        return undefined;
      }
      return cloneElement(
        customNode,
        {
          style: getStyleWithOffset(),
        },
        false,
      );
    };

    const renderBadgeNumber = (prefixCls: string, scrollNumberPrefixCls: string) => {
      const { status, color, size } = props;
      const count = state.badgeCount;
      const displayCount = getDispayCount.value;

      const scrollNumberCls = {
        [`${prefixCls}-dot`]: isDot.value,
        [`${prefixCls}-count`]: !isDot.value,
        [`${prefixCls}-count-sm`]: size === 'small',
        [`${prefixCls}-multiple-words`]:
          !isDot.value && count && count.toString && count.toString().length > 1,
        [`${prefixCls}-status-${status}`]: !!status,
        [`${prefixCls}-status-${color}`]: isPresetColor(color),
      };

      let statusStyle = getStyleWithOffset();
      if (color && !isPresetColor(color)) {
        statusStyle = statusStyle || {};
        statusStyle.background = color;
      }

      return isHidden.value ? null : (
        <ScrollNumber
          prefixCls={scrollNumberPrefixCls}
          data-show={!isHidden.value}
          v-show={!isHidden.value}
          class={scrollNumberCls}
          count={displayCount}
          displayComponent={renderDispayComponent()}
          title={getScrollNumberTitle()}
          style={statusStyle}
          key="scrollNumber"
        />
      );
    };

    return () => {
      const {
        prefixCls: customizePrefixCls,
        scrollNumberPrefixCls: customizeScrollNumberPrefixCls,
        status,
        color,
      } = props;

      const text = getPropsSlot(slots, props, 'text');
      const getPrefixCls = configProvider.getPrefixCls;
      const prefixCls = getPrefixCls('badge', customizePrefixCls);
      const scrollNumberPrefixCls = getPrefixCls('scroll-number', customizeScrollNumberPrefixCls);

      const children = flattenChildren(slots.default?.());
      let count = getPropsSlot(slots, props, 'count');
      if (Array.isArray(count)) {
        count = count[0];
      }
      state.badgeCount = count;
      const scrollNumber = renderBadgeNumber(prefixCls, scrollNumberPrefixCls);
      const statusText = renderStatusText(prefixCls);
      const statusCls = classNames({
        [`${prefixCls}-status-dot`]: hasStatus.value,
        [`${prefixCls}-status-${status}`]: !!status,
        [`${prefixCls}-status-${color}`]: isPresetColor(color),
      });
      const statusStyle: CSSProperties = {};
      if (color && !isPresetColor(color)) {
        statusStyle.background = color;
      }
      // <Badge status="success" />
      if (!children.length && hasStatus.value) {
        const styleWithOffset = getStyleWithOffset();
        const statusTextColor = styleWithOffset && styleWithOffset.color;
        return (
          <span class={getBadgeClassName(prefixCls, children)} style={styleWithOffset}>
            <span class={statusCls} style={statusStyle} />
            <span style={{ color: statusTextColor }} class={`${prefixCls}-status-text`}>
              {text}
            </span>
          </span>
        );
      }

      const transitionProps = getTransitionProps(children.length ? `${prefixCls}-zoom` : '');

      return (
        <span class={getBadgeClassName(prefixCls, children)}>
          {children}
          <Transition {...transitionProps}>{scrollNumber}</Transition>
          {statusText}
        </span>
      );
    };
  },
});

Badge.install = function(app: App) {
  app.component(Badge.name, Badge);
  app.component(Badge.Ribbon.displayName, Badge.Ribbon);
  return app;
};

export default Badge as typeof Badge &
  Plugin & {
    readonly Ribbon: typeof Ribbon;
  };
