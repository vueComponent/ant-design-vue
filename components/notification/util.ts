import type { CSSProperties } from 'vue';
import type { NotificationPlacement } from './interface';
import type { CSSMotionProps } from '../_util/transition';

export function getPlacementStyle(
  placement: NotificationPlacement,
  top: number | string,
  bottom: number | string,
) {
  let style: CSSProperties;
  top = typeof top === 'number' ? `${top}px` : top;
  bottom = typeof bottom === 'number' ? `${bottom}px` : bottom;
  switch (placement) {
    case 'top':
      style = {
        left: '50%',
        transform: 'translateX(-50%)',
        right: 'auto',
        top,
        bottom: 'auto',
      };
      break;

    case 'topLeft':
      style = {
        left: 0,
        top,
        bottom: 'auto',
      };
      break;

    case 'topRight':
      style = {
        right: 0,
        top,
        bottom: 'auto',
      };
      break;

    case 'bottom':
      style = {
        left: '50%',
        transform: 'translateX(-50%)',
        right: 'auto',
        top: 'auto',
        bottom,
      };
      break;

    case 'bottomLeft':
      style = {
        left: 0,
        top: 'auto',
        bottom,
      };
      break;

    default:
      style = {
        right: 0,
        top: 'auto',
        bottom,
      };
      break;
  }
  return style;
}

export function getMotion(prefixCls: string): CSSMotionProps {
  return {
    name: `${prefixCls}-fade`,
  };
}
