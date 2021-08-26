import contains from '../vc-util/Dom/contains';
import type { TargetPoint } from './interface';
import ResizeObserver from 'resize-observer-polyfill';

export function isSamePoint(prev: TargetPoint, next: TargetPoint) {
  if (prev === next) return true;
  if (!prev || !next) return false;

  if ('pageX' in next && 'pageY' in next) {
    return prev.pageX === next.pageX && prev.pageY === next.pageY;
  }

  if ('clientX' in next && 'clientY' in next) {
    return prev.clientX === next.clientX && prev.clientY === next.clientY;
  }

  return false;
}

export function restoreFocus(activeElement, container) {
  // Focus back if is in the container
  if (
    activeElement !== document.activeElement &&
    contains(container, activeElement) &&
    typeof activeElement.focus === 'function'
  ) {
    activeElement.focus();
  }
}

export function monitorResize(element: HTMLElement, callback: Function) {
  let prevWidth: number = null;
  let prevHeight: number = null;

  function onResize([{ target }]: ResizeObserverEntry[]) {
    if (!document.documentElement.contains(target)) return;
    const { width, height } = target.getBoundingClientRect();
    const fixedWidth = Math.floor(width);
    const fixedHeight = Math.floor(height);

    if (prevWidth !== fixedWidth || prevHeight !== fixedHeight) {
      // https://webkit.org/blog/9997/resizeobserver-in-webkit/
      Promise.resolve().then(() => {
        callback({ width: fixedWidth, height: fixedHeight });
      });
    }

    prevWidth = fixedWidth;
    prevHeight = fixedHeight;
  }

  const resizeObserver = new ResizeObserver(onResize);
  if (element) {
    resizeObserver.observe(element);
  }

  return () => {
    resizeObserver.disconnect();
  };
}
