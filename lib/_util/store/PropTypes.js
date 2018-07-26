'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storeShape = undefined;

var _vueTypes = require('../vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var storeShape = exports.storeShape = _vueTypes2['default'].shape({
  subscribe: _vueTypes2['default'].func.isRequired,
  setState: _vueTypes2['default'].func.isRequired,
  getState: _vueTypes2['default'].func.isRequired
});