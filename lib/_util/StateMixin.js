"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

exports["default"] = {
  methods: {
    setState: function setState(state, callback) {
      (0, _extends3["default"])(this.$data, state);
      this.$nextTick(function () {
        callback && callback();
      });
    }
  }
};
module.exports = exports["default"];