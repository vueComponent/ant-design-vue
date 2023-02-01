import type { VNode, ExtractPropTypes, PropType } from 'vue';
import { cloneVNode, isVNode, defineComponent, nextTick, shallowRef, computed } from 'vue';
import debounce from 'lodash-es/debounce';
import PropTypes from '../_util/vue-types';
import { getPropsSlot } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import useStyle from './style';
import useConfigInject from '../config-provider/hooks/useConfigInject';

export type SpinSize = 'small' | 'default' | 'large';
export const spinProps = () => ({
  prefixCls: String,
  spinning: { type: Boolean, default: undefined },
  size: String as PropType<SpinSize>,
  wrapperClassName: String,
  tip: PropTypes.any,
  delay: Number,
  indicator: PropTypes.any,
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
  }),
  setup(props, { attrs, slots }) {
    const { prefixCls, size, direction } = useConfigInject('spin', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const children = slots.default?.();
    const shouldBeDelayed = computed(() => shouldDelay(props.spinning, props.delay));
    const sSpinning = shallowRef(props.spinning && shouldBeDelayed.value);
    return () => {
      const { class: cls, ...divProps } = attrs;
      const { tip = slots.tip?.() } = props;
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

      function renderIndicator(prefixCls: string) {
        const dotClassName = `${prefixCls}-dot`;
        let indicator = getPropsSlot(slots, props, 'indicator');
        // should not be render default indicator when indicator value is null
        if (indicator === null) {
          return null;
        }
        if (Array.isArray(indicator)) {
          indicator = indicator.length === 1 ? indicator[0] : indicator;
        }
        if (isVNode(indicator)) {
          return cloneVNode(indicator, { class: dotClassName });
        }

        if (defaultIndicator && isVNode(defaultIndicator())) {
          return cloneVNode(defaultIndicator(), { class: dotClassName });
        }

        return (
          <span class={`${dotClassName} ${prefixCls}-dot-spin`}>
            <i class={`${prefixCls}-dot-item`} />
            <i class={`${prefixCls}-dot-item`} />
            <i class={`${prefixCls}-dot-item`} />
            <i class={`${prefixCls}-dot-item`} />
          </span>
        );
      }
      const spinElement = (
        <div {...divProps} class={spinClassName} aria-live="polite" aria-busy={sSpinning.value}>
          {renderIndicator(prefixCls.value)}
          {tip ? <div class={`${prefixCls.value}-text`}>{tip}</div> : null}
        </div>
      );
      if (children && children.length) {
        const containerClassName = {
          [`${prefixCls.value}-container`]: true,
          [`${prefixCls.value}-blur`]: sSpinning.value,
        };
        return wrapSSR(
          <div class={[`${prefixCls.value}-nested-loading`, props.wrapperClassName, hashId.value]}>
            {sSpinning.value && <div key="loading">{spinElement}</div>}
            <div class={containerClassName} key="container">
              {slots?.default?.()}
            </div>
          </div>,
        );
      }
      return wrapSSR(spinElement);
    };
  },
  data() {
    const { spinning, delay } = this;
    const shouldBeDelayed = shouldDelay(spinning, delay);
    return {
      sSpinning: spinning && !shouldBeDelayed,
    };
  },
  created() {
    this.originalUpdateSpinning = this.updateSpinning;
    this.debouncifyUpdateSpinning(this.$props);
  },
  mounted() {
    this.updateSpinning();
  },
  updated() {
    nextTick(() => {
      this.debouncifyUpdateSpinning();
      this.updateSpinning();
    });
  },
  beforeUnmount() {
    this.cancelExistingSpin();
  },
  methods: {
    debouncifyUpdateSpinning(props?: any) {
      const { delay } = props || this.$props;
      if (delay) {
        this.cancelExistingSpin();
        this.updateSpinning = debounce(this.originalUpdateSpinning, delay);
      }
    },
    updateSpinning() {
      const { spinning, sSpinning } = this;
      if (sSpinning !== spinning) {
        this.sSpinning = spinning;
      }
    },
    cancelExistingSpin() {
      const { updateSpinning } = this;
      if (updateSpinning && (updateSpinning as any).cancel) {
        (updateSpinning as any).cancel();
      }
    },
  },
});
