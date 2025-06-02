import type { VNode, ExtractPropTypes, PropType } from 'vue';
import {
  onBeforeUnmount,
  cloneVNode,
  isVNode,
  defineComponent,
  shallowRef,
  watch,
  computed,
} from 'vue';
import { debounce } from 'throttle-debounce';
import PropTypes from '../_util/vue-types';
import { filterEmpty, getPropsSlot } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import useStyle from './style';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useCSSVarCls from '../config-provider/hooks/useCssVarCls';
import Progress from './Progress';
import usePercent from './usePercent';

export type SpinSize = 'small' | 'default' | 'large';
export const spinProps = () => ({
  prefixCls: String,
  spinning: { type: Boolean, default: undefined },
  size: String as PropType<SpinSize>,
  wrapperClassName: String,
  tip: PropTypes.any,
  delay: Number,
  indicator: PropTypes.any,
  fullscreen: Boolean,
  percent: [Number, String] as PropType<number | 'auto'>,
});

export type SpinProps = Partial<ExtractPropTypes<ReturnType<typeof spinProps>>>;

// Render indicator
let defaultIndicator: () => VNode = null;

function shouldDelay(spinning?: boolean, delay?: number): boolean {
  return !!spinning && !!delay && !isNaN(Number(delay));
}

export function setDefaultIndicator(Content: any) {
  const Indicator = Content.indicator;
  defaultIndicator = typeof Indicator === 'function' ? Indicator : () => <Indicator />;
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ASpin',
  inheritAttrs: false,
  props: initDefaultProps(spinProps(), {
    size: 'default',
    spinning: true,
    wrapperClassName: '',
    fullscreen: false,
  }),
  setup(props, { attrs, slots }) {
    const { prefixCls, size, direction } = useConfigInject('spin', props);
    const rootCls = useCSSVarCls(prefixCls);
    const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls, rootCls);
    const sSpinning = shallowRef(props.spinning && !shouldDelay(props.spinning, props.delay));

    const mergedPercent = computed(() => usePercent(sSpinning.value, props.percent));

    let updateSpinning: any;
    watch(
      [() => props.spinning, () => props.delay],
      () => {
        updateSpinning?.cancel();
        updateSpinning = debounce(props.delay, () => {
          sSpinning.value = props.spinning;
        });
        updateSpinning?.();
      },
      {
        immediate: true,
        flush: 'post',
      },
    );
    onBeforeUnmount(() => {
      updateSpinning?.cancel();
    });

    return () => {
      const { class: cls, ...divProps } = attrs;
      const { tip = slots.tip?.() } = props;
      const children = slots.default?.();
      const spinClassName = {
        [hashId.value]: true,
        [prefixCls.value]: true,
        [`${prefixCls.value}-sm`]: size.value === 'small',
        [`${prefixCls.value}-lg`]: size.value === 'large',
        [`${prefixCls.value}-spinning`]: sSpinning.value,
        [`${prefixCls.value}-show-text`]: !!tip,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [cls as string]: !!cls,
      };

      function renderIndicator(prefixCls: string, percent: number) {
        const dotClassName = `${prefixCls}-dot`;
        const holderClassName = `${dotClassName}-holder`;
        const hideClassName = `${holderClassName}-hidden`;

        let indicator = getPropsSlot(slots, props, 'indicator');
        // should not be render default indicator when indicator value is null
        if (indicator === null) {
          return null;
        }
        if (Array.isArray(indicator)) {
          indicator = indicator.length === 1 ? indicator[0] : indicator;
        }
        if (isVNode(indicator)) {
          return cloneVNode(indicator, { class: dotClassName, percent });
        }

        if (defaultIndicator && isVNode(defaultIndicator())) {
          return cloneVNode(defaultIndicator(), { class: dotClassName, percent });
        }

        return (
          <>
            <span class={[holderClassName, percent > 0 && hideClassName]}>
              <span class={[dotClassName, `${prefixCls}-dot-spin`]}>
                {[1, 2, 3, 4].map(i => (
                  <i class={`${prefixCls}-dot-item`} key={i} />
                ))}
              </span>
            </span>
            {props.percent && <Progress prefixCls={prefixCls} percent={percent} />}
          </>
        );
      }
      const spinElement = (
        <div
          {...divProps}
          key="loading"
          class={[spinClassName, rootCls.value, cssVarCls.value]}
          aria-live="polite"
          aria-busy={sSpinning.value}
        >
          {renderIndicator(prefixCls.value, mergedPercent.value.value)}
          {tip ? (
            <div class={[`${prefixCls.value}-text`, hashId.value, rootCls.value, cssVarCls.value]}>
              {tip}
            </div>
          ) : null}
        </div>
      );
      if (children && filterEmpty(children).length && !props.fullscreen) {
        const containerClassName = {
          [`${prefixCls.value}-container`]: true,
          [`${prefixCls.value}-blur`]: sSpinning.value,
          [rootCls.value]: true,
          [cssVarCls.value]: true,
          [hashId.value]: true,
        };
        return wrapCSSVar(
          <div
            class={[
              `${prefixCls.value}-nested-loading`,
              props.wrapperClassName,
              hashId.value,
              rootCls.value,
              cssVarCls.value,
            ]}
          >
            {sSpinning.value && spinElement}
            <div class={containerClassName} key="container">
              {children}
            </div>
          </div>,
        );
      }

      if (props.fullscreen) {
        return wrapCSSVar(
          <div
            class={[
              `${prefixCls.value}-fullscreen`,
              {
                [`${prefixCls.value}-fullscreen-show`]: sSpinning.value,
              },
              hashId.value,
              rootCls.value,
              cssVarCls.value,
            ]}
          >
            {spinElement}
          </div>,
        );
      }

      return wrapCSSVar(spinElement);
    };
  },
});
