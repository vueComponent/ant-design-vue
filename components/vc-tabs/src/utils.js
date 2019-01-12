export function toArray(children) {
  const c = [];
  children.forEach(child => {
    if (child.data) {
      c.push(child);
    }
  });
  return c;
}

export function getActiveIndex(children, activeKey) {
  const c = toArray(children);
  for (let i = 0; i < c.length; i++) {
    if (c[i].key === activeKey) {
      return i;
    }
  }
  return -1;
}

export function getActiveKey(children, index) {
  const c = toArray(children);
  return c[index].key;
}

export function setTransform(style, v) {
  style.transform = v;
  style.webkitTransform = v;
  style.mozTransform = v;
}

export function isTransformSupported(style) {
  return 'transform' in style || 'webkitTransform' in style || 'MozTransform' in style;
}

export function setTransition(style, v) {
  style.transition = v;
  style.webkitTransition = v;
  style.MozTransition = v;
}
export function getTransformPropValue(v) {
  return {
    transform: v,
    WebkitTransform: v,
    MozTransform: v,
  };
}

export function isVertical(tabBarPosition) {
  return tabBarPosition === 'left' || tabBarPosition === 'right';
}

export function getTransformByIndex(index, tabBarPosition) {
  const translate = isVertical(tabBarPosition) ? 'translateY' : 'translateX';
  return `${translate}(${-index * 100}%) translateZ(0)`;
}

export function getMarginStyle(index, tabBarPosition) {
  const marginDirection = isVertical(tabBarPosition) ? 'marginTop' : 'marginLeft';
  return {
    [marginDirection]: `${-index * 100}%`,
  };
}

export function getStyle(el, property) {
  return +window
    .getComputedStyle(el)
    .getPropertyValue(property)
    .replace('px', '');
}

export function setPxStyle(el, value, vertical) {
  value = vertical ? `0px, ${value}px, 0px` : `${value}px, 0px, 0px`;
  setTransform(el.style, `translate3d(${value})`);
}

export function getDataAttr(props) {
  return Object.keys(props).reduce((prev, key) => {
    if (key.substr(0, 5) === 'aria-' || key.substr(0, 5) === 'data-' || key === 'role') {
      prev[key] = props[key];
    }
    return prev;
  }, {});
}

function toNum(style, property) {
  return +style.getPropertyValue(property).replace('px', '');
}

function getTypeValue(start, current, end, tabNode, wrapperNode) {
  let total = getStyle(wrapperNode, `padding-${start}`);
  if (!tabNode || !tabNode.parentNode) {
    return total;
  }

  const { childNodes } = tabNode.parentNode;
  Array.prototype.some.call(childNodes, node => {
    const style = window.getComputedStyle(node);
    if (node !== tabNode) {
      total += toNum(style, `margin-${start}`);
      total += node[current];
      total += toNum(style, `margin-${end}`);

      if (style.boxSizing === 'content-box') {
        total += toNum(style, `border-${start}-width`) + toNum(style, `border-${end}-width`);
      }
      return false;
    }

    // We need count current node margin
    // ref: https://github.com/react-component/tabs/pull/139#issuecomment-431005262
    total += toNum(style, `margin-${start}`);

    return true;
  });

  return total;
}

export function getLeft(tabNode, wrapperNode) {
  return getTypeValue('left', 'offsetWidth', 'right', tabNode, wrapperNode);
}

export function getTop(tabNode, wrapperNode) {
  return getTypeValue('top', 'offsetHeight', 'bottom', tabNode, wrapperNode);
}
