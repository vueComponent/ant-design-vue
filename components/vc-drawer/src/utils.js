export function dataToArray(vars) {
  if (Array.isArray(vars)) {
    return vars;
  }
  return [vars];
}
const transitionEndObject = {
  transition: 'transitionend',
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'oTransitionEnd otransitionend',
};
export const transitionStr = Object.keys(transitionEndObject).filter(key => {
  if (typeof document === 'undefined') {
    return false;
  }
  const html = document.getElementsByTagName('html')[0];
  return key in (html ? html.style : {});
})[0];
export const transitionEnd = transitionEndObject[transitionStr];

export function addEventListener(target, eventType, callback, options) {
  if (target.addEventListener) {
    target.addEventListener(eventType, callback, options);
  } else if (target.attachEvent) {
    target.attachEvent(`on${eventType}`, callback);
  }
}

export function removeEventListener(target, eventType, callback, options) {
  if (target.removeEventListener) {
    target.removeEventListener(eventType, callback, options);
  } else if (target.attachEvent) {
    target.detachEvent(`on${eventType}`, callback);
  }
}

export function transformArguments(arg, cb) {
  let result;
  if (typeof arg === 'function') {
    result = arg(cb);
  } else {
    result = arg;
  }
  if (Array.isArray(result)) {
    if (result.length === 2) {
      return result;
    }
    return [result[0], result[1]];
  }
  return [result];
}

export const isNumeric = value => {
  return !isNaN(parseFloat(value)) && isFinite(value); // eslint-disable-line
};

export const windowIsUndefined = !(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

export const getTouchParentScroll = (root, currentTarget, differX, differY) => {
  if (!currentTarget || currentTarget === document || currentTarget instanceof Document) {
    return false;
  }
  // root 为 drawer-content 设定了 overflow, 判断为 root 的 parent 时结束滚动；
  if (currentTarget === root.parentNode) {
    return true;
  }

  const isY = Math.max(Math.abs(differX), Math.abs(differY)) === Math.abs(differY);
  const isX = Math.max(Math.abs(differX), Math.abs(differY)) === Math.abs(differX);

  const scrollY = currentTarget.scrollHeight - currentTarget.clientHeight;
  const scrollX = currentTarget.scrollWidth - currentTarget.clientWidth;

  const style = document.defaultView.getComputedStyle(currentTarget);
  const overflowY = style.overflowY === 'auto' || style.overflowY === 'scroll';
  const overflowX = style.overflowX === 'auto' || style.overflowX === 'scroll';

  const y = scrollY && overflowY;
  const x = scrollX && overflowX;

  if (
    (isY &&
      (!y ||
        (y &&
          ((currentTarget.scrollTop >= scrollY && differY < 0) ||
            (currentTarget.scrollTop <= 0 && differY > 0))))) ||
    (isX &&
      (!x ||
        (x &&
          ((currentTarget.scrollLeft >= scrollX && scrollX < 0) ||
            (currentTarget.scrollLeft <= 0 && scrollX > 0)))))
  ) {
    return getTouchParentScroll(root, currentTarget.parentNode, differX, differY);
  }
  return false;
};
