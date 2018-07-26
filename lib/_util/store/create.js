"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

exports["default"] = create;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function create(initialState) {
  var state = initialState;
  var listeners = [];

  function setState(partial) {
    state = (0, _extends3["default"])({}, state, partial);
    for (var i = 0; i < listeners.length; i++) {
      listeners[i]();
    }
  }

  function getState() {
    return state;
  }

  function subscribe(listener) {
    listeners.push(listener);

    return function unsubscribe() {
      var index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  return {
    setState: setState,
    getState: getState,
    subscribe: subscribe
  };
}
module.exports = exports["default"];