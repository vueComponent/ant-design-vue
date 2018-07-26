'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = function () {
  return {
    trigger: _vueTypes2['default'].array.def(['hover']),
    overlay: _vueTypes2['default'].any,
    visible: _vueTypes2['default'].bool,
    disabled: _vueTypes2['default'].bool,
    align: _vueTypes2['default'].object,
    getPopupContainer: _vueTypes2['default'].func,
    prefixCls: _vueTypes2['default'].string,
    transitionName: _vueTypes2['default'].string,
    placement: _vueTypes2['default'].oneOf(['topLeft', 'topCenter', 'topRight', 'bottomLeft', 'bottomCenter', 'bottomRight']),
    forceRender: _vueTypes2['default'].bool
  };
};

module.exports = exports['default'];