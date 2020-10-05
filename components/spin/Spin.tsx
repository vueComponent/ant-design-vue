import {
  inject,
  cloneVNode,
  isVNode,
  onMounted,
  onBeforeUnmount,
  onUpdated,
  defineComponent,
  nextTick,
  ref,
  computed,
  unref,
} from 'vue';
import debounce from 'lodash-es/debounce';
import { getComponentFromSetup } from '../_util/props-util';
import { defaultConfigProvider, ConfigConsumerProps } from '../config-provider';
import getSpinProps from './spinProps';
import { SpinProps, VNodeElement } from './spinTypes';

// Render indicator
let defaultIndicator;

function shouldDelay(spinning, delay) {
  return !!spinning && !!delay && !isNaN(Number(delay));
}

export function setDefaultIndicator(Content) {
  const Indicator = Content.indicator;
  defaultIndicator =
    typeof Indicator === 'function'
      ? Indicator
      : () => {
          return <Indicator />;
        };
}

export default defineComponent({
  name: 'ASpin',
  inheritAttrs: false,
  props: getSpinProps(),
  setup(propsValues, { slots, attrs }) {
    const propsRef = computed(() => {
      return { ...attrs, ...propsValues } as SpinProps;
    });
    const { getPrefixCls } = inject<ConfigConsumerProps>('configProvider', defaultConfigProvider);

    const { spinning, delay } = propsRef.value;
    const shouldBeDelayed = shouldDelay(spinning, delay);
    const originalUpdateSpinning = updateSpinning;
    debouncifyUpdateSpinning(propsRef.value);
    const spinningRef = ref(spinning && !shouldBeDelayed);

    let debounceUpdateSpinning: ReturnType<typeof debounce> | null = null;

    function debouncifyUpdateSpinning(_props?: SpinProps) {
      const { delay } = _props || unref(propsRef);
      if (delay) {
        cancelExistingSpin();
        debounceUpdateSpinning = debounce(originalUpdateSpinning, delay);
      }
    }

    function updateSpinning() {
      const { spinning } = unref(propsRef);
      if (spinningRef.value !== spinning) {
        spinningRef.value = !!spinning;
      }
    }

    function cancelExistingSpin() {
      if (debounceUpdateSpinning && debounceUpdateSpinning.cancel) {
        debounceUpdateSpinning.cancel();
      }
    }

    function renderIndicator(prefixCls: string) {
      const dotClassName = `${prefixCls}-dot`;
      let indicator = getComponentFromSetup(unref(propsRef), slots, 'indicator') as VNodeElement;
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

    onMounted(() => {
      updateSpinning();
    });

    onUpdated(() => {
      nextTick(() => {
        debouncifyUpdateSpinning();
        updateSpinning();
      });
    });

    onBeforeUnmount(() => {
      cancelExistingSpin();
    });

    return () => {
      const { size, prefixCls: customizePrefixCls, tip, wrapperClassName } = unref(propsRef);
      const { class: cls, style, ...divProps } = attrs;
      const prefixCls = getPrefixCls('spin', customizePrefixCls);

      const sSpinning = spinningRef.value;
      const spinClassName = {
        [prefixCls]: true,
        [`${prefixCls}-sm`]: size === 'small',
        [`${prefixCls}-lg`]: size === 'large',
        [`${prefixCls}-spinning`]: sSpinning,
        [`${prefixCls}-show-text`]: !!tip,
        [cls as string]: !!cls,
      };

      const spinElement = (
        <div {...divProps} style={style as any} class={spinClassName}>
          {renderIndicator(prefixCls)}
          {tip ? <div class={`${prefixCls}-text`}>{tip}</div> : null}
        </div>
      );
      const children = slots.default?.();
      if (children && children.length) {
        const containerClassName = {
          [`${prefixCls}-container`]: true,
          [`${prefixCls}-blur`]: sSpinning,
        };

        return (
          <div class={[`${prefixCls}-nested-loading`, wrapperClassName]}>
            {sSpinning && <div key="loading">{spinElement}</div>}
            <div class={containerClassName} key="container">
              {children}
            </div>
          </div>
        );
      }
      return spinElement;
    };
  },
});
