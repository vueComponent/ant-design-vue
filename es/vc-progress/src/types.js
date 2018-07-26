import PropTypes from '../../_util/vue-types';

export var defaultProps = {
  // className: '',
  percent: 0,
  prefixCls: 'rc-progress',
  strokeColor: '#2db7f5',
  strokeLinecap: 'round',
  strokeWidth: 1,
  // style: {},
  trailColor: '#D9D9D9',
  trailWidth: 1
};

export var propTypes = {
  // className: PropTypes.string,
  percent: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  prefixCls: PropTypes.string,
  strokeColor: PropTypes.string,
  strokeLinecap: PropTypes.oneOf(['butt', 'round', 'square']),
  strokeWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  // style: PropTypes.object,
  trailColor: PropTypes.string,
  trailWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};