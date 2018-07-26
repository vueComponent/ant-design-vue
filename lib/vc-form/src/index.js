'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formShape = exports.createFormField = exports.createForm = undefined;

var _createForm = require('./createForm');

var _createForm2 = _interopRequireDefault(_createForm);

var _createFormField = require('./createFormField');

var _createFormField2 = _interopRequireDefault(_createFormField);

var _propTypes = require('./propTypes');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _antRefDirective = require('../../_util/antRefDirective');

var _antRefDirective2 = _interopRequireDefault(_antRefDirective);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_vue2['default'].use(_antRefDirective2['default']); // export this package's api
exports.createForm = _createForm2['default'];
exports.createFormField = _createFormField2['default'];
exports.formShape = _propTypes2['default'];