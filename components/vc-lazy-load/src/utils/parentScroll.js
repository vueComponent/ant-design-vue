const style = (element, prop) => {
  let styleVal = '';
  if (typeof getComputedStyle !== 'undefined') {
    styleVal = window.getComputedStyle(element, null).getPropertyValue(prop);
  } else {
    styleVal = element.style[prop];
  }
  return styleVal;
};

const overflow = element =>
  style(element, 'overflow') + style(element, 'overflow-y') + style(element, 'overflow-x');

const scrollParent = element => {
  if (!(element instanceof window.HTMLElement)) {
    return window;
  }

  let parent = element;

  while (parent) {
    if (parent === document.body || parent === document.documentElement) {
      break;
    }

    if (!parent.parentNode) {
      break;
    }
    if (/(scroll|auto)/.test(overflow(parent))) {
      return parent;
    }

    parent = parent.parentNode;
  }

  return window;
};

export default scrollParent;
