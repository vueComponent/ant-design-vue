'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var warned = {};

exports['default'] = function (valid, message, throwError) {
  if (!valid && !warned[message]) {
    (0, _warning2['default'])(false, message);
    warned[message] = true;
  }
};

module.exports = exports['default'];