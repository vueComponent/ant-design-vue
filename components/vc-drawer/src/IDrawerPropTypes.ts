import PropTypes from '../../_util/vue-types';
import type { CSSProperties, PropType } from 'vue';

export type IPlacement = 'left' | 'top' | 'right' | 'bottom';
type ILevelMove = number | [number, number];
const props = () => ({
  prefixCls: String,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
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
  maskStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  afterVisibleChange: Function,
  keyboard: { type: Boolean, default: undefined },
  contentWrapperStyle: {
    type: Object as PropType<CSSProperties>,
    default: undefined as CSSProperties,
  },
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
  getOpenCount: Function as PropType<() => number>,
  scrollLocker: PropTypes.any,
  switchScrollingEffect: Function,
});

export { drawerProps, drawerChildProps };
