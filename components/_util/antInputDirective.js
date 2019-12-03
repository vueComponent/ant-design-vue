/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

export const inBrowser = typeof window !== 'undefined';
export const UA = inBrowser && window.navigator.userAgent.toLowerCase();
export const isIE9 = UA && UA.indexOf('msie 9.0') > 0;
function makeMap(str, expectsLowerCase) {
  const map = Object.create(null);
  const list = str.split(',');
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? val => map[val.toLowerCase()] : val => map[val];
}
const isTextInputType = makeMap('text,number,password,search,email,tel,url');

function onCompositionStart(e) {
  e.target.originPlaceholder = e.target.placeholder;
  e.target.placeholder = '';
  e.target.composing = true;
}

function onCompositionEnd(e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) return;
  e.target.placeholder = e.target.originPlaceholder;
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger(el, type) {
  const e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', () => {
    const el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

export function antInput(Vue) {
  return Vue.directive('ant-input', {
    inserted(el, binding, vnode) {
      if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
        if (!binding.modifiers || !binding.modifiers.lazy) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
          // Safari < 10.2 & UIWebView doesn't fire compositionend when
          // switching focus before confirming composition choice
          // this also fixes the issue where some browsers e.g. iOS Chrome
          // fires "change" instead of "input" on autocomplete.
          el.addEventListener('change', onCompositionEnd);
          /* istanbul ignore if */
          if (isIE9) {
            el.vmodel = true;
          }
        }
      }
    },
  });
}

export default {
  install: Vue => {
    antInput(Vue);
  },
};
