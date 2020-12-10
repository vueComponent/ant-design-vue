// Test via a getter in the options object to see if the passive property is accessed
let supportsPassive = false;
try {
  let opts = Object.defineProperty({}, 'passive', {
    get() {
      supportsPassive = true;
    },
  });
  window.addEventListener('testPassive', null, opts);
  window.removeEventListener('testPassive', null, opts);
} catch (e) {}

export default supportsPassive;
