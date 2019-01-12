function getScroll(w, top) {
  let ret = top ? w.pageYOffset : w.pageXOffset;
  const method = top ? 'scrollTop' : 'scrollLeft';
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

function getClientPosition(elem) {
  let x;
  let y;
  const doc = elem.ownerDocument;
  const body = doc.body;
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

export function getOffsetLeft(el) {
  const pos = getClientPosition(el);
  const doc = el.ownerDocument;
  const w = doc.defaultView || doc.parentWindow;
  pos.left += getScroll(w);
  return pos.left;
}
