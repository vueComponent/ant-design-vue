import type { AnchorHTMLAttributes, FunctionalComponent } from 'vue';
import warning from '../_util/warning';
import type { BlockProps } from './Base';
import Base, { baseProps } from './Base';
import PropTypes from '../_util/vue-types';
import omit from '../_util/omit';

export interface LinkProps extends BlockProps, Omit<AnchorHTMLAttributes, 'type'> {
  ellipsis?: boolean;
}

const Link: FunctionalComponent<LinkProps> = (props, { slots, attrs }) => {
  const { ellipsis, rel, ...restProps } = { ...props, ...attrs };
  warning(
    typeof ellipsis !== 'object',
    'Typography.Link',
    '`ellipsis` only supports boolean value.',
  );
  const mergedProps = {
    ...restProps,
    rel: rel === undefined && restProps.target === '_blank' ? 'noopener noreferrer' : rel,
    ellipsis: !!ellipsis,
    component: 'a',
  };
  // https://github.com/ant-design/ant-design/issues/26622
  // @ts-ignore
  delete mergedProps.navigate;

  return <Base {...mergedProps} v-slots={slots}></Base>;
};

Link.displayName = 'ATypographyLink';
Link.inheritAttrs = false;
Link.props = omit({ ...baseProps(), ellipsis: PropTypes.looseBool }, ['component']) as any;

export default Link;
