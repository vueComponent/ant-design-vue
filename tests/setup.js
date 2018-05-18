// import Vue from 'vue'
// Vue.config.silent = true

/* eslint-disable global-require */
if (typeof window !== 'undefined') {
  global.window.resizeTo = (width, height) => {
    global.window.innerWidth = width || global.window.innerWidth
    global.window.innerHeight = height || global.window.innerHeight
    global.window.dispatchEvent(new Event('resize'))
  }
}

// The built-in requestAnimationFrame and cancelAnimationFrame not working with jest.runFakeTimes()
// https://github.com/facebook/jest/issues/5147
global.requestAnimationFrame = function (cb) {
  return setTimeout(cb, 0)
}

global.cancelAnimationFrame = function (cb) {
  return clearTimeout(cb, 0)
}

