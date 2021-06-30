/**
 * source by `component-classes`
 * https://github.com/component/classes.git
 */

import indexOf from 'lodash-es/indexOf';

/**
 * Whitespace regexp.
 */
const re = /\s+/;

export class ClassList {
  el: Element;
  list: DOMTokenList;

  constructor(el: Element) {
    if (!el || !el.nodeType) {
      throw new Error('A DOM element reference is required');
    }
    this.el = el;
    this.list = el.classList;
  }

  array() {
    const className = this.el.getAttribute('class') || '';
    const str = className.replace(/^\s+|\s+$/g, '');
    const arr = str.split(re);
    if ('' === arr[0]) arr.shift();
    return arr;
  }

  /**
   * Add class `name` if not already present.
   *
   * @param {String} name
   * @return {ClassList}
   * @api public
   */
  add(name: string): ClassList {
    // classList
    if (this.list) {
      this.list.add(name);
      return this;
    }

    // fallback
    const arr = this.array();
    const i = indexOf(arr, name);
    if (!~i) arr.push(name);
    this.el.className = arr.join(' ');
    return this;
  }
  /**
   * Remove class `name` when present, or
   * pass a regular expression to remove
   * any which match.
   *
   * @param {String|RegExp} name
   * @return {ClassList}
   * @api public
   */
  remove(name: string | RegExp): ClassList {
    if ('[object RegExp]' === toString.call(name)) {
      return this._removeMatching(name as RegExp);
    }

    // classList
    if (this.list) {
      this.list.remove(name as string);
      return this;
    }

    // fallback
    const arr = this.array();
    const i = indexOf(arr, name);
    if (~i) arr.splice(i, 1);
    this.el.className = arr.join(' ');
    return this;
  }
  /**
   * Remove all classes matching `re`.
   *
   * @param {RegExp} re
   * @return {ClassList}
   * @api private
   */
  _removeMatching(re: RegExp): ClassList {
    const arr = this.array();
    for (let i = 0; i < arr.length; i++) {
      if (re.test(arr[i])) {
        this.remove(arr[i]);
      }
    }
    return this;
  }

  /**
   * Toggle class `name`, can force state via `force`.
   *
   * For browsers that support classList, but do not support `force` yet,
   * the mistake will be detected and corrected.
   *
   * @param {String} name
   * @param {Boolean} force
   * @return {ClassList}
   * @api public
   */
  toggle(name: string, force: boolean): ClassList {
    // classList
    if (this.list) {
      if ('undefined' !== typeof force) {
        if (force !== this.list.toggle(name, force)) {
          this.list.toggle(name); // toggle again to correct
        }
      } else {
        this.list.toggle(name);
      }
      return this;
    }

    // fallback
    if ('undefined' !== typeof force) {
      if (!force) {
        this.remove(name);
      } else {
        this.add(name);
      }
    } else {
      if (this.has(name)) {
        this.remove(name);
      } else {
        this.add(name);
      }
    }

    return this;
  }
  /**
   * Check if class `name` is present.
   *
   * @param {String} name
   * @api public
   */
  has(name: string) {
    return this.list ? this.list.contains(name) : !!~indexOf(this.array(), name);
  }
  /**
   * Check if class `name` is present.
   *
   * @param {String} name
   * @api public
   */
  contains(name: string) {
    return this.has(name);
  }
}

/**
 * Wrap `el` in a `ClassList`.
 *
 * @param {Element} el
 * @return {ClassList}
 * @api public
 */
export default function (el: Element): ClassList {
  return new ClassList(el);
}
