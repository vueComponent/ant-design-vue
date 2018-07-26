'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Store = undefined;

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _create = require('../_util/store/create');

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Store = exports.Store = _vueTypes2['default'].shape({
  setState: _vueTypes2['default'].func,
  getState: _vueTypes2['default'].func,
  subscribe: _vueTypes2['default'].func
}).loose;

var createStore = _create2['default'];

exports['default'] = createStore;