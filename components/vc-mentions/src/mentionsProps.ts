import type { PropType } from 'vue';
import PropTypes from '../../_util/vue-types';
import { initDefaultProps } from '../../_util/props-util';
import {
  filterOption as defaultFilterOption,
  validateSearch as defaultValidateSearch,
} from './util';
import { PlaceMent } from './placement';

export const mentionsProps = {
  autofocus: PropTypes.looseBool,
  prefix: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  prefixCls: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  disabled: PropTypes.looseBool,
  notFoundContent: PropTypes.VNodeChild,
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
};

export const vcMentionsProps = {
  ...mentionsProps,
  children: PropTypes.any,
};

export const defaultProps = {
  prefix: '@',
  split: ' ',
  validateSearch: defaultValidateSearch,
  filterOption: defaultFilterOption,
};

export default initDefaultProps(vcMentionsProps, defaultProps);
