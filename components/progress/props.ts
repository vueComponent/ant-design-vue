import PropTypes from '../_util/vue-types';
import { tuple } from '../_util/type';

export const ProgressStatuses = tuple('normal', 'exception', 'active', 'success');
export const ProgressType = PropTypes.oneOf(tuple('line', 'circle', 'dashboard'));
export const ProgressSize = PropTypes.oneOf(tuple('default', 'small'));

export const ProgressProps = {
  prefixCls: PropTypes.string,
  type: ProgressType,
  percent: PropTypes.number,
  successPercent: PropTypes.number,
  format: PropTypes.func,
  status: PropTypes.oneOf(ProgressStatuses),
  showInfo: PropTypes.looseBool,
  strokeWidth: PropTypes.number,
  strokeLinecap: PropTypes.oneOf(['butt', 'round', 'square']),
  strokeColor: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  trailColor: PropTypes.string,
  width: PropTypes.number,
  gapDegree: PropTypes.number,
  gapPosition: PropTypes.oneOf(tuple('top', 'bottom', 'left', 'right')),
  size: ProgressSize,
};
