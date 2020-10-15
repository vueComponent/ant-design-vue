function onCompositionStart(e) {
  e.target.composing = true;
}

function onCompositionEnd(e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) return;
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger(el, type) {
  const e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

export function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
const antInput = {
  created(el, binding) {
    if (!binding.modifiers || !binding.modifiers.lazy) {
      addEventListener(el, 'compositionstart', onCompositionStart);
      addEventListener(el, 'compositionend', onCompositionEnd);
      // Safari < 10.2 & UIWebView doesn't fire compositionend when
      // switching focus before confirming composition choice
      // this also fixes the issue where some browsers e.g. iOS Chrome
      // fires "change" instead of "input" on autocomplete.
      addEventListener(el, 'change', onCompositionEnd);
    }
  },
};

export default antInput;
