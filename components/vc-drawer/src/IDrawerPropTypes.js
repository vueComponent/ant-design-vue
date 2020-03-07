import PropTypes from '../../_util/vue-types';

const IProps = {
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
  handler: PropTypes.any,
  showMask: PropTypes.bool,
  maskStyle: PropTypes.object,
  className: PropTypes.string,
  wrapStyle: PropTypes.object,
  maskClosable: PropTypes.bool,
  afterVisibleChange: PropTypes.func,
  keyboard: PropTypes.bool,
};

const IDrawerProps = {
  ...IProps,
  wrapperClassName: PropTypes.string,
  forceRender: PropTypes.bool,
  getContainer: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
    PropTypes.bool,
  ]),
};

const IDrawerChildProps = {
  ...IProps,
  getContainer: PropTypes.func,
  getOpenCount: PropTypes.func,
  switchScrollingEffect: PropTypes.func,
};

export { IDrawerProps, IDrawerChildProps };
