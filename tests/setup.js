import Vue from 'vue';
import Base from '../components/base';
// Vue.config.silent = true

/* eslint-disable global-require */
if (typeof window !== 'undefined') {
  global.window.resizeTo = (width, height) => {
    global.window.innerWidth = width || global.window.innerWidth;
    global.window.innerHeight = height || global.window.innerHeight;
    global.window.dispatchEvent(new Event('resize'));
  };
  global.window.scrollTo = () => {};
}

// The built-in requestAnimationFrame and cancelAnimationFrame not working with jest.runFakeTimes()
// https://github.com/facebook/jest/issues/5147
global.requestAnimationFrame = function(cb) {
  return setTimeout(cb, 0);
};

global.cancelAnimationFrame = function(cb) {
  return clearTimeout(cb, 0);
};

const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;

Vue.use(Base);
Vue.component('transition-group', {
  props: ['tag'],
  render(createElement) {
    return createElement(this.tag || 'div', null, this.$slots.default);
  },
});

Vue.prototype.$emit = function() {
  const vm = this;
  const args = [].slice.call(arguments, 0);
  const filterEvent = [];
  const eventName = args[0];
  if (args.length && vm.$listeners[eventName]) {
    if (filterEvent.includes(eventName)) {
      vm.$emit(eventName, ...args.slice(1));
    } else {
      vm.$listeners[eventName](...args.slice(1));
    }
  }
};
