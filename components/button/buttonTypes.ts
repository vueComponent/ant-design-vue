import { ExtractPropTypes } from 'vue';

import { tuple } from '../_util/type';
import PropTypes, { withUndefined } from '../_util/vue-types';

const ButtonTypes = tuple('default', 'primary', 'ghost', 'dashed', 'danger', 'link');
export type ButtonType = typeof ButtonTypes[number];
const ButtonShapes = tuple('circle', 'circle-outline', 'round');
export type ButtonShape = typeof ButtonShapes[number];
const ButtonSizes = tuple('large', 'default', 'small');
export type ButtonSize = typeof ButtonSizes[number];
const ButtonHTMLTypes = tuple('submit', 'button', 'reset');
export type ButtonHTMLType = typeof ButtonHTMLTypes[number];

const buttonProps = () => ({
  prefixCls: PropTypes.string,
  type: PropTypes.oneOf(ButtonTypes),
  htmlType: PropTypes.oneOf(ButtonHTMLTypes).def('button'),
  // icon: PropTypes.string,
  shape: PropTypes.oneOf(ButtonShapes),
  size: PropTypes.oneOf(ButtonSizes).def('default'),
  loading: withUndefined(PropTypes.oneOfType([PropTypes.looseBool, PropTypes.object])),
  disabled: PropTypes.looseBool,
  ghost: PropTypes.looseBool,
  block: PropTypes.looseBool,
  icon: PropTypes.VNodeChild,
  href: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
});

export type ButtonProps = Partial<ExtractPropTypes<ReturnType<typeof buttonProps>>>;

export default buttonProps;
