import PropTypes from '../../_util/vue-types';
import type { PropType } from 'vue';

export type IPlacement = 'left' | 'top' | 'right' | 'bottom';
type ILevelMove = number | [number, number];
const props = () => ({
  prefixCls: String,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.style,
  class: String,
  placement: {
    type: String as PropType<IPlacement>,
  },
  wrapperClassName: String,
  level: { type: [String, Array] as PropType<string | string[]> },
  levelMove: {
    type: [Number, Function, Array] as PropType<
      ILevelMove | ((e: { target: HTMLElement; open: boolean }) => ILevelMove)
    >,
  },
  duration: String,
  ease: String,
  showMask: { type: Boolean, default: undefined },
  maskClosable: { type: Boolean, default: undefined },
  maskStyle: PropTypes.style,
  afterVisibleChange: Function,
  keyboard: { type: Boolean, default: undefined },
  contentWrapperStyle: PropTypes.style,
  autofocus: { type: Boolean, default: undefined },
  open: { type: Boolean, default: undefined },
});

const drawerProps = () => ({
  ...props(),
  forceRender: { type: Boolean, default: undefined },
  getContainer: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
    PropTypes.looseBool,
  ]),
});

const drawerChildProps = () => ({
  ...props(),
  getContainer: Function,
  getOpenCount: Function,
  scrollLocker: PropTypes.any,
  switchScrollingEffect: Function,
});

export { drawerProps, drawerChildProps };
