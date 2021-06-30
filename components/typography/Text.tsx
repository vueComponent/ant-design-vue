import type { FunctionalComponent } from 'vue';
import warning from '../_util/warning';
import type { BlockProps, EllipsisConfig } from './Base';
import Base, { baseProps } from './Base';
import Omit from 'omit.js';

export interface TextProps extends BlockProps {
  ellipsis?: boolean | Omit<EllipsisConfig, 'expandable' | 'rows' | 'onExpand'>;
}

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
        ? Omit(ellipsis as any, ['expandable', 'rows'])
        : ellipsis,
    component: 'span',
    ...attrs,
  };
  return <Base {...textProps} v-slots={slots}></Base>;
};

Text.displayName = 'ATypographyText';
Text.inheritAttrs = false;
Text.props = Omit(baseProps(), ['component']);

export default Text;
