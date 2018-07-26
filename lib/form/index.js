'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormItemProps = exports.ValidationRule = exports.FormCreateOption = exports.FormProps = undefined;

var _Form = require('./Form');

Object.defineProperty(exports, 'FormProps', {
  enumerable: true,
  get: function get() {
    return _Form.FormProps;
  }
});
Object.defineProperty(exports, 'FormCreateOption', {
  enumerable: true,
  get: function get() {
    return _Form.FormCreateOption;
  }
});
Object.defineProperty(exports, 'ValidationRule', {
  enumerable: true,
  get: function get() {
    return _Form.ValidationRule;
  }
});

var _FormItem = require('./FormItem');

Object.defineProperty(exports, 'FormItemProps', {
  enumerable: true,
  get: function get() {
    return _FormItem.FormItemProps;
  }
});

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _Form2 = _interopRequireDefault(_Form);

var _antRefDirective = require('../_util/antRefDirective');

var _antRefDirective2 = _interopRequireDefault(_antRefDirective);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_vue2['default'].use(_antRefDirective2['default']);

exports['default'] = _Form2['default'];