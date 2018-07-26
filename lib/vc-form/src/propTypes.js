'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var formShape = _vueTypes2['default'].shape({
  getFieldsValue: _vueTypes2['default'].func,
  getFieldValue: _vueTypes2['default'].func,
  getFieldInstance: _vueTypes2['default'].func,
  setFieldsValue: _vueTypes2['default'].func,
  setFields: _vueTypes2['default'].func,
  setFieldsInitialValue: _vueTypes2['default'].func,
  getFieldDecorator: _vueTypes2['default'].func,
  getFieldProps: _vueTypes2['default'].func,
  getFieldsError: _vueTypes2['default'].func,
  getFieldError: _vueTypes2['default'].func,
  isFieldValidating: _vueTypes2['default'].func,
  isFieldsValidating: _vueTypes2['default'].func,
  isFieldsTouched: _vueTypes2['default'].func,
  isFieldTouched: _vueTypes2['default'].func,
  isSubmitting: _vueTypes2['default'].func,
  submit: _vueTypes2['default'].func,
  validateFields: _vueTypes2['default'].func,
  resetFields: _vueTypes2['default'].func
}).loose;

exports['default'] = formShape;
module.exports = exports['default'];