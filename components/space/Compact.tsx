import classNames from '../_util/classNames';

import type { DirectionType, SizeType } from '../config-provider';
import createContext from '../_util/createContext';
import useConfigInject from '../config-provider/hooks/useConfigInject';

import useStyle from './style';
import { computed, defineComponent } from 'vue';
import type { PropType, ExtractPropTypes } from 'vue';
import PropTypes from '../_util/vue-types';
import { tuple } from '../_util/type';

export const spaceCompactItemProps = () => ({
  compactSize: String as PropType<SizeType>,
  compactDirection: PropTypes.oneOf(tuple('horizontal', 'vertical')).def('horizontal'),
  isFirstItem: { type: Boolean, default: undefined },
  isLastItem: { type: Boolean, default: undefined },
});

export type SpaceCompactItemContextType = Partial<
  ExtractPropTypes<ReturnType<typeof spaceCompactItemProps>>
>;

export const SpaceCompactItemContext = createContext<SpaceCompactItemContextType | null>(null);

export const useCompactItemContext = (prefixCls: string, direction: DirectionType) => {
  const compactItemContext = SpaceCompactItemContext.useInject();

  const compactItemClassnames = computed(() => {
    if (!compactItemContext) return '';

    const { compactDirection, isFirstItem, isLastItem } = compactItemContext;
    const separator = compactDirection === 'vertical' ? '-vertical-' : '-';

    return classNames({
      [`${prefixCls}-compact${separator}item`]: true,
      [`${prefixCls}-compact${separator}first-item`]: isFirstItem,
      [`${prefixCls}-compact${separator}last-item`]: isLastItem,
      [`${prefixCls}-compact${separator}item-rtl`]: direction === 'rtl',
    });
  });

  return {
    compactSize: compactItemContext?.compactSize,
    compactDirection: compactItemContext?.compactDirection,
    compactItemClassnames,
  };
};

export const NoCompactStyle = defineComponent({
  name: 'NoCompactStyle',
  setup(_, { slots }) {
    SpaceCompactItemContext.useProvide(null);
    return () => {
      return slots.default?.();
    };
  },
});

export const spaceCompactProps = () => ({
  prefixCls: String,
  size: {
    type: [String, Number, Array] as PropType<SizeType>,
  },
  direction: PropTypes.oneOf(tuple('horizontal', 'vertical')).def('horizontal'),
  align: PropTypes.oneOf(tuple('start', 'end', 'center', 'baseline')),
  block: { type: Boolean, default: undefined },
});

export type SpaceCompactProps = Partial<ExtractPropTypes<ReturnType<typeof spaceCompactProps>>>;

const CompactItem = defineComponent({
  name: 'CompactItem',
  props: spaceCompactItemProps(),
  setup(props, { slots }) {
    SpaceCompactItemContext.useProvide(props);

    return () => slots.default?.();
  },
});

const Compact = defineComponent({
  name: 'ASpaceCompact',
  inheritAttrs: false,
  props: spaceCompactProps(),
  setup(props, { attrs, slots }) {
    const { prefixCls, direction: directionConfig } = useConfigInject('space-compact', props);

    const [wrapSSR, hashId] = useStyle(prefixCls);
    const clx = computed(() => {
      return classNames(prefixCls.value, hashId.value, {
        [`${prefixCls.value}-rtl`]: directionConfig.value === 'rtl',
        [`${prefixCls.value}-block`]: props.block,
        [`${prefixCls.value}-vertical`]: props.direction === 'vertical',
      });
    });

    const compactItemContext = SpaceCompactItemContext.useInject();

    const nodes = computed(() => {
      const childNodes = slots.default?.() || [];

      return childNodes.map((child, i) => {
        const key = (child && child.key) || `${prefixCls.value}-item-${i}`;

        return (
          <CompactItem
            key={key}
            compactSize={props.size}
            compactDirection={props.direction}
            isFirstItem={i === 0 && (!compactItemContext || compactItemContext?.isFirstItem)}
            isLastItem={
              i === childNodes.length - 1 && (!compactItemContext || compactItemContext?.isLastItem)
            }
          >
            {child}
          </CompactItem>
        );
      });
    });

    return () => {
      // =========================== Render ===========================
      if (slots.default?.()?.length === 0) {
        return null;
      }

      return wrapSSR(
        <div class={clx.value} {...attrs}>
          {nodes.value}
        </div>,
      );
    };
  },
});

export default Compact;
