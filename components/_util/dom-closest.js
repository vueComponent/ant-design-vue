/**
 * source by `dom-closest`
 * https://github.com/necolas/dom-closest.git
 */

import matches from './dom-matches';

/**
 * @param element {Element}
 * @param selector {String}
 * @param context {Element=}
 * @return {Element}
 */
export default function (element, selector, context) {
  context = context || document;
  // guard against orphans
  element = { parentNode: element };

  while ((element = element.parentNode) && element !== context) {
    if (matches(element, selector)) {
      return element;
    }
  }
}
