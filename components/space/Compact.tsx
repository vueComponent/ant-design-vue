import classNames from '../_util/classNames';
import type { DirectionType, SizeType } from '../config-provider';
import createContext from '../_util/createContext';
import useConfigInject from '../config-provider/hooks/useConfigInject';

import useStyle from './style';
import { computed, defineComponent } from 'vue';
import type { PropType, ExtractPropTypes, Ref } from 'vue';
import PropTypes from '../_util/vue-types';
import { booleanType, tuple } from '../_util/type';
import { isEmpty } from 'lodash-es';
import { flattenChildren } from '../_util/props-util';

export const spaceCompactItemProps = () => ({
  compactSize: String as PropType<SizeType>,
  compactDirection: PropTypes.oneOf(tuple('horizontal', 'vertical')).def('horizontal'),
  isFirstItem: booleanType(),
  isLastItem: booleanType(),
});

export type SpaceCompactItemContextType = Partial<
  ExtractPropTypes<ReturnType<typeof spaceCompactItemProps>>
>;

export const SpaceCompactItemContext = createContext<SpaceCompactItemContextType | null>(null);

export const useCompactItemContext = (prefixCls: Ref<string>, direction: Ref<DirectionType>) => {
  const compactItemContext = SpaceCompactItemContext.useInject();

  const compactItemClassnames = computed(() => {
    if (!compactItemContext || isEmpty(compactItemContext)) return '';

    const { compactDirection, isFirstItem, isLastItem } = compactItemContext;
    const separator = compactDirection === 'vertical' ? '-vertical-' : '-';

    return classNames({
      [`${prefixCls.value}-compact${separator}item`]: true,
      [`${prefixCls.value}-compact${separator}first-item`]: isFirstItem,
      [`${prefixCls.value}-compact${separator}last-item`]: isLastItem,
      [`${prefixCls.value}-compact${separator}item-rtl`]: direction.value === 'rtl',
    });
  });

  return {
    compactSize: computed(() => compactItemContext?.compactSize),
    compactDirection: computed(() => compactItemContext?.compactDirection),
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
    type: String as PropType<SizeType>,
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
    const compactItemContext = SpaceCompactItemContext.useInject();

    const [wrapSSR, hashId] = useStyle(prefixCls);

    const clx = computed(() => {
      return classNames(prefixCls.value, hashId.value, {
        [`${prefixCls.value}-rtl`]: directionConfig.value === 'rtl',
        [`${prefixCls.value}-block`]: props.block,
        [`${prefixCls.value}-vertical`]: props.direction === 'vertical',
      });
    });

    return () => {
      const childNodes = flattenChildren(slots.default?.() || []);
      // =========================== Render ===========================
      if (childNodes.length === 0) {
        return null;
      }

      return wrapSSR(
        <div {...attrs} class={[clx.value, attrs.class]}>
          {childNodes.map((child, i) => {
            const key = (child && child.key) || `${prefixCls.value}-item-${i}`;
            const noCompactItemContext = !compactItemContext || isEmpty(compactItemContext);

            return (
              <CompactItem
                key={key}
                compactSize={props.size ?? 'middle'}
                compactDirection={props.direction}
                isFirstItem={i === 0 && (noCompactItemContext || compactItemContext?.isFirstItem)}
                isLastItem={
                  i === childNodes.length - 1 &&
                  (noCompactItemContext || compactItemContext?.isLastItem)
                }
              >
                {child}
              </CompactItem>
            );
          })}
        </div>,
      );
    };
  },
});

export default Compact;
