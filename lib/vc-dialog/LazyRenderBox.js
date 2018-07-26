'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ILazyRenderBoxPropTypes = {
  visible: _vueTypes2['default'].bool,
  hiddenClassName: _vueTypes2['default'].string
};

exports['default'] = {
  props: ILazyRenderBoxPropTypes,
  render: function render() {
    var h = arguments[0];

    return h('div', [this.$slots['default']]);
  }
};
module.exports = exports['default'];