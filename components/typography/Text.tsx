import { FunctionalComponent } from 'vue';
import warning from '../_util/warning';
import Base, { BlockProps } from './Base';

export interface TextProps extends BlockProps {
  ellipsis: boolean;
}

const Text: FunctionalComponent<TextProps> = (props, { slots }) => {
  const { ellipsis } = props;
  warning(
    typeof ellipsis !== 'object',
    'Typography.Text',
    '`ellipsis` is only support boolean value.',
  );
  const textProps = {
    ...props,
    ellipsis: !!ellipsis,
    component: 'span',
  };

  return <Base {...textProps}>{slots.default?.()}</Base>;
};

Text.displayName = 'ATypographyText';

export default Text;
