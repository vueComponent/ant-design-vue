import PropTypes from '../_util/vue-types';
import ScrollNumber from './ScrollNumber';
import classNames from '../_util/classNames';
import { getPropsSlot, flattenChildren } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import { getTransitionProps, Transition } from '../_util/transition';
import type { ExtractPropTypes, CSSProperties, PropType } from 'vue';
import { defineComponent, computed, ref, watch } from 'vue';
import Ribbon from './Ribbon';
import { isPresetColor } from './utils';
import useConfigInject from '../_util/hooks/useConfigInject';
import isNumeric from '../_util/isNumeric';
import type { PresetStatusColorType } from '../_util/colors';

export const badgeProps = () => ({
  /** Number to show in badge */
  count: PropTypes.any,
  showZero: { type: Boolean, default: undefined },
  /** Max count to show */
  overflowCount: { type: Number, default: 99 },
  /** whether to show red dot without number */
  dot: { type: Boolean, default: undefined },
  prefixCls: String,
  scrollNumberPrefixCls: String,
  status: { type: String as PropType<PresetStatusColorType> },
  size: { type: String as PropType<'default' | 'small'>, default: 'default' },
  color: String,
  text: PropTypes.any,
  offset: Array as unknown as PropType<[number | string, number | string]>,
  numberStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  title: String,
});

export type BadgeProps = Partial<ExtractPropTypes<ReturnType<typeof badgeProps>>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ABadge',
  Ribbon,
  inheritAttrs: false,
  props: badgeProps(),
  slots: ['text', 'count'],
  setup(props, { slots, attrs }) {
    const { prefixCls, direction } = useConfigInject('badge', props);

    // ================================ Misc ================================
    const numberedDisplayCount = computed(() => {
      return (
        (props.count as number) > (props.overflowCount as number)
          ? `${props.overflowCount}+`
          : props.count
      ) as string | number | null;
    });

    const hasStatus = computed(
      () =>
        (props.status !== null && props.status !== undefined) ||
        (props.color !== null && props.color !== undefined),
    );

    const isZero = computed(
      () => numberedDisplayCount.value === '0' || numberedDisplayCount.value === 0,
    );

    const showAsDot = computed(() => props.dot && !isZero.value);

    const mergedCount = computed(() => (showAsDot.value ? '' : numberedDisplayCount.value));

    const isHidden = computed(() => {
      const isEmpty =
        mergedCount.value === null || mergedCount.value === undefined || mergedCount.value === '';
      return (isEmpty || (isZero.value && !props.showZero)) && !showAsDot.value;
    });

    // Count should be cache in case hidden change it
    const livingCount = ref(props.count);

    // We need cache count since remove motion should not change count display
    const displayCount = ref(mergedCount.value);

    // We will cache the dot status to avoid shaking on leaved motion
    const isDotRef = ref(showAsDot.value);

    watch(
      [() => props.count, mergedCount, showAsDot],
      () => {
        if (!isHidden.value) {
          livingCount.value = props.count;
          displayCount.value = mergedCount.value;
          isDotRef.value = showAsDot.value;
        }
      },
      { immediate: true },
    );

    // Shared styles
    const statusCls = computed(() => ({
      [`${prefixCls.value}-status-dot`]: hasStatus.value,
      [`${prefixCls.value}-status-${props.status}`]: !!props.status,
      [`${prefixCls.value}-status-${props.color}`]: isPresetColor(props.color),
    }));

    const statusStyle = computed(() => {
      if (props.color && !isPresetColor(props.color)) {
        return { background: props.color };
      } else {
        return {};
      }
    });

    const scrollNumberCls = computed(() => ({
      [`${prefixCls.value}-dot`]: isDotRef.value,
      [`${prefixCls.value}-count`]: !isDotRef.value,
      [`${prefixCls.value}-count-sm`]: props.size === 'small',
      [`${prefixCls.value}-multiple-words`]:
        !isDotRef.value && displayCount.value && displayCount.value.toString().length > 1,
      [`${prefixCls.value}-status-${props.status}`]: !!props.status,
      [`${prefixCls.value}-status-${props.color}`]: isPresetColor(props.color),
    }));

    return () => {
      const { offset, title, color } = props;
      const style = attrs.style as CSSProperties;
      const text = getPropsSlot(slots, props, 'text');
      const pre = prefixCls.value;
      const count = livingCount.value;
      let children = flattenChildren(slots.default?.());
      children = children.length ? children : null;

      const visible = !!(!isHidden.value || slots.count);

      // =============================== Styles ===============================
      const mergedStyle = (() => {
        if (!offset) {
          return { ...style };
        }

        const offsetStyle: CSSProperties = {
          marginTop: isNumeric(offset[1]) ? `${offset[1]}px` : offset[1],
        };
        if (direction.value === 'rtl') {
          offsetStyle.left = `${parseInt(offset[0] as string, 10)}px`;
        } else {
          offsetStyle.right = `${-parseInt(offset[0] as string, 10)}px`;
        }

        return {
          ...offsetStyle,
          ...style,
        };
      })();

      // =============================== Render ===============================
      // >>> Title
      const titleNode =
        title ?? (typeof count === 'string' || typeof count === 'number' ? count : undefined);

      // >>> Status Text
      const statusTextNode =
        visible || !text ? null : <span class={`${pre}-status-text`}>{text}</span>;

      // >>> Display Component
      const displayNode =
        typeof count === 'object' || (count === undefined && slots.count)
          ? cloneElement(
              count ?? slots.count?.(),
              {
                style: mergedStyle,
              },
              false,
            )
          : null;

      const badgeClassName = classNames(
        pre,
        {
          [`${pre}-status`]: hasStatus.value,
          [`${pre}-not-a-wrapper`]: !children,
          [`${pre}-rtl`]: direction.value === 'rtl',
        },
        attrs.class,
      );

      // <Badge status="success" />
      if (!children && hasStatus.value) {
        const statusTextColor = mergedStyle.color;
        return (
          <span {...attrs} class={badgeClassName} style={mergedStyle}>
            <span class={statusCls.value} style={statusStyle.value} />
            <span style={{ color: statusTextColor }} class={`${pre}-status-text`}>
              {text}
            </span>
          </span>
        );
      }

      const transitionProps = getTransitionProps(children ? `${pre}-zoom` : '', {
        appear: false,
      });
      let scrollNumberStyle: CSSProperties = { ...mergedStyle, ...(props.numberStyle as object) };
      if (color && !isPresetColor(color)) {
        scrollNumberStyle = scrollNumberStyle || {};
        scrollNumberStyle.background = color;
      }

      return (
        <span {...attrs} class={badgeClassName}>
          {children}
          <Transition {...transitionProps}>
            <ScrollNumber
              v-show={visible}
              prefixCls={props.scrollNumberPrefixCls}
              show={visible}
              class={scrollNumberCls.value}
              count={displayCount.value}
              title={titleNode}
              style={scrollNumberStyle}
              key="scrollNumber"
            >
              {displayNode}
            </ScrollNumber>
          </Transition>
          {statusTextNode}
        </span>
      );
    };
  },
});
