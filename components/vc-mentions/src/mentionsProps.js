import PropTypes from '../../_util/vue-types';
import { initDefaultProps } from '../../_util/props-util';
import {
  filterOption as defaultFilterOption,
  validateSearch as defaultValidateSearch,
} from './util';
import { PlaceMent } from './placement';

export const mentionsProps = {
  autoFocus: PropTypes.bool,
  prefix: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  prefixCls: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
  notFoundContent: PropTypes.any,
  split: PropTypes.string,
  transitionName: PropTypes.string,
  placement: PropTypes.oneOf(PlaceMent),
  character: PropTypes.any,
  characterRender: PropTypes.func,
  filterOption: PropTypes.func,
  validateSearch: PropTypes.func,
  getPopupContainer: PropTypes.func,
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
