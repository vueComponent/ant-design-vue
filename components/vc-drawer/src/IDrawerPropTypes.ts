import PropTypes from '../../_util/vue-types';
import type { PropType } from 'vue';

export type IPlacement = 'left' | 'top' | 'right' | 'bottom';
type ILevelMove = number | [number, number];
const props = () => ({
  prefixCls: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.style,
  class: PropTypes.string,
  placement: {
    type: String as PropType<IPlacement>,
  },
  wrapperClassName: PropTypes.string,
  level: { type: [String, Array] as PropType<string | string[]> },
  levelMove: {
    type: [Number, Function, Array] as PropType<
      ILevelMove | ((e: { target: HTMLElement; open: boolean }) => ILevelMove)
    >,
  },
  duration: PropTypes.string,
  ease: PropTypes.string,
  showMask: PropTypes.looseBool,
  maskClosable: PropTypes.looseBool,
  maskStyle: PropTypes.style,
  afterVisibleChange: PropTypes.func,
  keyboard: PropTypes.looseBool,
  contentWrapperStyle: PropTypes.style,
  autofocus: PropTypes.looseBool,
  open: PropTypes.looseBool,
});

const drawerProps = () => ({
  ...props(),
  forceRender: PropTypes.looseBool,
  getContainer: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
    PropTypes.looseBool,
  ]),
});

const drawerChildProps = () => ({
  ...props(),
  getContainer: PropTypes.func,
  getOpenCount: PropTypes.func,
  scrollLocker: PropTypes.any,
  switchScrollingEffect: PropTypes.func,
});

export { drawerProps, drawerChildProps };
