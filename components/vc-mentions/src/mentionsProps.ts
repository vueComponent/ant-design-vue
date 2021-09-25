import type { PropType } from 'vue';
import PropTypes from '../../_util/vue-types';
import { initDefaultProps } from '../../_util/props-util';
import {
  filterOption as defaultFilterOption,
  validateSearch as defaultValidateSearch,
} from './util';
import { tuple } from '../../_util/type';
import type { OptionProps } from './Option';

export const PlaceMent = tuple('top', 'bottom');
export type Direction = 'ltr' | 'rtl';

export const mentionsProps = {
  autofocus: PropTypes.looseBool,
  prefix: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  prefixCls: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.looseBool,
  split: PropTypes.string,
  transitionName: PropTypes.string,
  placement: PropTypes.oneOf(PlaceMent),
  character: PropTypes.any,
  characterRender: PropTypes.func,
  filterOption: {
    type: [Boolean, Function] as PropType<typeof defaultFilterOption | false>,
  },
  validateSearch: PropTypes.func,
  getPopupContainer: {
    type: Function as PropType<() => HTMLElement>,
  },
  options: {
    type: Array as PropType<OptionProps>,
    default: () => undefined,
  },
  loading: PropTypes.looseBool,
  rows: [Number, String],
  direction: { type: String as PropType<Direction> },
};

export const vcMentionsProps = {
  ...mentionsProps,
};

export const defaultProps = {
  prefix: '@',
  split: ' ',
  rows: 1,
  validateSearch: defaultValidateSearch,
  filterOption: (() => defaultFilterOption) as any,
};

export default initDefaultProps(vcMentionsProps, defaultProps);
