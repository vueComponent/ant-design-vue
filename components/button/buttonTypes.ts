import { tuple } from '../_util/type';
import PropTypes from '../_util/vue-types';

import type { ExtractPropTypes, PropType } from 'vue';
import type { SizeType } from '../config-provider';

const ButtonTypes = tuple('default', 'primary', 'ghost', 'dashed', 'link', 'text');
export type ButtonType = typeof ButtonTypes[number];
const ButtonShapes = tuple('circle', 'round');
export type ButtonShape = typeof ButtonShapes[number];

const ButtonHTMLTypes = tuple('submit', 'button', 'reset');
export type ButtonHTMLType = typeof ButtonHTMLTypes[number];

export type LegacyButtonType = ButtonType | 'danger';
export function convertLegacyProps(type?: LegacyButtonType): ButtonProps {
  if (type === 'danger') {
    return { danger: true };
  }
  return { type };
}

const buttonProps = () => ({
  prefixCls: PropTypes.string,
  type: PropTypes.oneOf(ButtonTypes),
  htmlType: PropTypes.oneOf(ButtonHTMLTypes).def('button'),
  shape: PropTypes.oneOf(ButtonShapes),
  size: {
    type: String as PropType<SizeType>,
  },
  loading: {
    type: [Boolean, Object] as PropType<boolean | { delay?: number }>,
    default: (): boolean | { delay?: number } => false,
  },
  disabled: PropTypes.looseBool,
  ghost: PropTypes.looseBool,
  block: PropTypes.looseBool,
  danger: PropTypes.looseBool,
  icon: PropTypes.VNodeChild,
  href: PropTypes.string,
  target: PropTypes.string,
  title: PropTypes.string,
  onClick: {
    type: Function as PropType<(event: MouseEvent) => void>,
  },
});

export type ButtonProps = Partial<ExtractPropTypes<ReturnType<typeof buttonProps>>>;

export default buttonProps;
