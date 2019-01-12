import scrollIntoView from 'dom-scroll-into-view';
import has from 'lodash/has';
import createBaseForm from './createBaseForm';
import { mixin as formMixin } from './createForm';
import { getParams } from './utils';

function computedStyle(el, prop) {
  const getComputedStyle = window.getComputedStyle;
  const style =
    // If we have getComputedStyle
    getComputedStyle
      ? // Query it
        // TODO: From CSS-Query notes, we might need (node, null) for FF
        getComputedStyle(el)
      : // Otherwise, we are in IE and use currentStyle
        el.currentStyle;
  if (style) {
    return style[
      // Switch to camelCase for CSSOM
      // DEV: Grabbed from jQuery
      // https://github.com/jquery/jquery/blob/1.9-stable/src/css.js#L191-L194
      // https://github.com/jquery/jquery/blob/1.9-stable/src/core.js#L593-L597
      prop.replace(/-(\w)/gi, (word, letter) => {
        return letter.toUpperCase();
      })
    ];
  }
  return undefined;
}

function getScrollableContainer(n) {
  let node = n;
  let nodeName;
  /* eslint no-cond-assign:0 */
  while ((nodeName = node.nodeName.toLowerCase()) !== 'body') {
    const overflowY = computedStyle(node, 'overflowY');
    // https://stackoverflow.com/a/36900407/3040605
    if (
      node !== n &&
      (overflowY === 'auto' || overflowY === 'scroll') &&
      node.scrollHeight > node.clientHeight
    ) {
      return node;
    }
    node = node.parentNode;
  }
  return nodeName === 'body' ? node.ownerDocument : node;
}

const mixin = {
  methods: {
    getForm() {
      return {
        ...formMixin.methods.getForm.call(this),
        validateFieldsAndScroll: this.validateFieldsAndScroll,
      };
    },

    validateFieldsAndScroll(ns, opt, cb) {
      const { names, callback, options } = getParams(ns, opt, cb);

      const newCb = (error, values) => {
        if (error) {
          const validNames = this.fieldsStore.getValidFieldsName();
          let firstNode;
          let firstTop;
          validNames.forEach(name => {
            if (has(error, name)) {
              const instance = this.getFieldInstance(name);
              if (instance) {
                const node = instance.$el || instance.elm;
                const top = node.getBoundingClientRect().top;
                if (node.type !== 'hidden' && (firstTop === undefined || firstTop > top)) {
                  firstTop = top;
                  firstNode = node;
                }
              }
            }
          });

          if (firstNode) {
            const c = options.container || getScrollableContainer(firstNode);
            scrollIntoView(firstNode, c, {
              onlyScrollIfNeeded: true,
              ...options.scroll,
            });
          }
        }

        if (typeof callback === 'function') {
          callback(error, values);
        }
      };

      return this.validateFields(names, options, newCb);
    },
  },
};

function createDOMForm(option) {
  return createBaseForm(
    {
      ...option,
    },
    [mixin],
  );
}

export default createDOMForm;
