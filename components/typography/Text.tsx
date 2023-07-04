import type { ExtractPropTypes, FunctionalComponent, PropType } from 'vue';
import omit from '../_util/omit';
import warning from '../_util/warning';
import type { EllipsisConfig } from './Base';
import Base, { baseProps } from './Base';

export const textProps = () => ({
  ...omit(baseProps(), ['component']),
  ellipsis: {
    type: [Boolean, Object] as PropType<
      boolean | Omit<EllipsisConfig, 'expandable' | 'rows' | 'onExpand'>
    >,
    default: undefined as boolean | Omit<EllipsisConfig, 'expandable' | 'rows' | 'onExpand'>,
  },
});

export type TextProps = Partial<ExtractPropTypes<ReturnType<typeof textProps>>>;

const Text: FunctionalComponent<TextProps> = (props, { slots, attrs }) => {
  const { ellipsis } = props;
  warning(
    typeof ellipsis !== 'object' ||
      !ellipsis ||
      (!('expandable' in ellipsis) && !('rows' in ellipsis)),
    'Typography.Text',
    '`ellipsis` do not support `expandable` or `rows` props.',
  );
  const textProps = {
    ...props,
    ellipsis:
      ellipsis && typeof ellipsis === 'object'
        ? omit(ellipsis as any, ['expandable', 'rows'])
        : ellipsis,
    component: 'span',
    ...attrs,
  };
  return <Base {...textProps} v-slots={slots}></Base>;
};

Text.displayName = 'ATypographyText';
Text.inheritAttrs = false;
Text.props = textProps();

export default Text;
