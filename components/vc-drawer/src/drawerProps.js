import PropTypes from '../../_util/vue-types';

export default {
  wrapperClassName: PropTypes.string,
  width: PropTypes.any,
  height: PropTypes.any,
  defaultOpen: PropTypes.bool,
  firstEnter: PropTypes.bool,
  open: PropTypes.bool,
  prefixCls: PropTypes.string,
  placement: PropTypes.string,
  level: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  levelMove: PropTypes.oneOfType([PropTypes.number, PropTypes.func, PropTypes.array]),
  ease: PropTypes.string,
  duration: PropTypes.string,
  getContainer: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
    PropTypes.bool,
  ]),
  handler: PropTypes.any,
  showMask: PropTypes.bool,
  maskStyle: PropTypes.object,
  className: PropTypes.string,
  wrapStyle: PropTypes.object,
};
