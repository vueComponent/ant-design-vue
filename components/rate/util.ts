function getScroll(w: Window) {
  let ret = w.scrollX;
  const method = 'scrollLeft';
  if (typeof ret !== 'number') {
    const d = w.document;
    // ie6,7,8 standard mode
    ret = d.documentElement[method];
    if (typeof ret !== 'number') {
      // quirks mode
      ret = d.body[method];
    }
  }
  return ret;
}

function getClientPosition(elem: HTMLElement) {
  let x: number;
  let y: number;
  const doc = elem.ownerDocument;
  const { body } = doc;
  const docElem = doc && doc.documentElement;
  const box = elem.getBoundingClientRect();
  x = box.left;
  y = box.top;
  x -= docElem.clientLeft || body.clientLeft || 0;
  y -= docElem.clientTop || body.clientTop || 0;
  return {
    left: x,
    top: y,
  };
}

export function getOffsetLeft(el: HTMLElement) {
  const pos = getClientPosition(el);
  const doc = el.ownerDocument;
  // Only IE use `parentWindow`
  const w: Window = doc.defaultView || (doc as any).parentWindow;
  pos.left += getScroll(w);
  return pos.left;
}
