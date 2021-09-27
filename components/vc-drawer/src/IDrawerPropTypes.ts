import PropTypes from '../../_util/vue-types';
import type { PropType, ExtractPropTypes } from 'vue';

export type IPlacement = 'left' | 'top' | 'right' | 'bottom';

const Props = {
  prefixCls: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.object,
  placement: {
    type: String as PropType<IPlacement>,
  },
  class: PropTypes.string,
  level: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  levelMove: PropTypes.oneOfType([PropTypes.number, PropTypes.func, PropTypes.array]),
  duration: PropTypes.string,
  ease: PropTypes.string,
  showMask: PropTypes.looseBool,
  maskClosable: PropTypes.looseBool,
  maskStyle: PropTypes.object,
  afterVisibleChange: PropTypes.func,
  keyboard: PropTypes.looseBool,
  contentWrapperStyle: PropTypes.object,
  autoFocus: PropTypes.looseBool,
  open: PropTypes.looseBool,
};

const DrawerProps = {
  ...Props,
  wrapperClassName: PropTypes.string,
  forceRender: PropTypes.looseBool,
  getContainer: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
    PropTypes.looseBool,
  ]),
};

type IDrawerProps = Partial<ExtractPropTypes<typeof DrawerProps>>;

const DrawerChildProps = {
  ...Props,
  getContainer: PropTypes.func,
  getOpenCount: PropTypes.func,
  scrollLocker: PropTypes.any,
  switchScrollingEffect: PropTypes.func,
};

type IDrawerChildProps = Partial<ExtractPropTypes<typeof DrawerChildProps>>;

export { DrawerProps, DrawerChildProps, IDrawerProps, IDrawerChildProps };
