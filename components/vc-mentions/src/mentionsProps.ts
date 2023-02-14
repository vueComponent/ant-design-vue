import type { PropType } from 'vue';
import PropTypes from '../../_util/vue-types';
import { initDefaultProps } from '../../_util/props-util';
import {
  filterOption as defaultFilterOption,
  validateSearch as defaultValidateSearch,
} from './util';
import { arrayType, tuple } from '../../_util/type';
import type { OptionProps } from './Option';

export const PlaceMent = tuple('top', 'bottom');
export type Direction = 'ltr' | 'rtl';

export const mentionsProps = {
  autofocus: { type: Boolean, default: undefined },
  prefix: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  prefixCls: String,
  value: String,
  disabled: { type: Boolean, default: undefined },
  split: String,
  transitionName: String,
  placement: PropTypes.oneOf(PlaceMent),
  character: PropTypes.any,
  characterRender: Function,
  filterOption: {
    type: [Boolean, Function] as PropType<typeof defaultFilterOption | false>,
  },
  validateSearch: Function,
  getPopupContainer: {
    type: Function as PropType<() => HTMLElement>,
  },
  options: arrayType<OptionProps[]>(),
  loading: { type: Boolean, default: undefined },
  rows: [Number, String],
  direction: { type: String as PropType<Direction> },
};

export const vcMentionsProps = {
  ...mentionsProps,
  dropdownClassName: String,
};

export const defaultProps = {
  prefix: '@',
  split: ' ',
  rows: 1,
  validateSearch: defaultValidateSearch,
  filterOption: (() => defaultFilterOption) as any,
};

export default initDefaultProps(vcMentionsProps, defaultProps);
