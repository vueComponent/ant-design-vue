/**
 * source by `dom-matches`
 * https://github.com/necolas/dom-matches.git
 */

/**
 * Determine if a DOM element matches a CSS selector
 *
 * @param {Element} elem
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

export default function matches(elem, selector) {
  // Vendor-specific implementations of `Element.prototype.matches()`.
  const proto = window.Element.prototype;
  const nativeMatches =
    proto.matches ||
    proto.mozMatchesSelector ||
    proto.msMatchesSelector ||
    proto.oMatchesSelector ||
    proto.webkitMatchesSelector;

  if (!elem || elem.nodeType !== 1) {
    return false;
  }

  const parentElem = elem.parentNode;

  // use native 'matches'
  if (nativeMatches) {
    return nativeMatches.call(elem, selector);
  }

  // native support for `matches` is missing and a fallback is required
  const nodes = parentElem.querySelectorAll(selector);
  const len = nodes.length;

  for (let i = 0; i < len; i++) {
    if (nodes[i] === elem) {
      return true;
    }
  }

  return false;
}
