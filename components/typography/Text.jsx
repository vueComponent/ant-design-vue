import warning from '../_util/warning';
import Base, { BlockProps } from './Base';
import PropTypes from '../_util/vue-types';

const TextProps = {
  ...BlockProps,
  ellipsis: PropTypes.bool,
};

const Text = {
  functional: true,
  name: 'ATypographyText',
  props: TextProps,
  render(h, ctx) {
    const { props, children, data } = ctx;
    const { ellipsis } = props;
    warning(
      typeof ellipsis !== 'object',
      'Typography.Text',
      '`ellipsis` is only support boolean value.',
    );
    const textProps = {
      ...data,
      props: {
        ...props,
        ellipsis: !!ellipsis,
        component: 'span',
      },
    };
    return <Base {...textProps}>{children}</Base>;
  },
};

export default Text;
