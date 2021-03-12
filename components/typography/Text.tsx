import { FunctionalComponent } from 'vue';
import omit from 'omit.js';
import warning from '../_util/warning';
import Base, { BlockProps, EllipsisConfig } from './Base';

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
        ? omit(ellipsis as any, ['expandable', 'rows'])
        : ellipsis,
    component: 'span',
    ...attrs,
  };

  return <Base {...textProps}>{slots.default?.()}</Base>;
};

Text.displayName = 'ATypographyText';
Text.inheritAttrs = false;

export default Text;
