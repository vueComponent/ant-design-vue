'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'ADivider',
  props: {
    prefixCls: _vueTypes2['default'].string.def('ant'),
    type: _vueTypes2['default'].oneOf(['horizontal', 'vertical']).def('horizontal'),
    dashed: _vueTypes2['default'].bool,
    orientation: _vueTypes2['default'].oneOf(['left', 'right'])
  },
  computed: {
    classString: function classString() {
      var _ref;

      var prefixCls = this.prefixCls,
          type = this.type,
          $slots = this.$slots,
          dashed = this.dashed,
          _orientation = this.orientation,
          orientation = _orientation === undefined ? '' : _orientation;

      var orientationPrefix = orientation.length > 0 ? '-' + orientation : orientation;

      return _ref = {}, (0, _defineProperty3['default'])(_ref, prefixCls + '-divider', true), (0, _defineProperty3['default'])(_ref, prefixCls + '-divider-' + type, true), (0, _defineProperty3['default'])(_ref, prefixCls + '-divider-with-text' + orientationPrefix, $slots['default']), (0, _defineProperty3['default'])(_ref, prefixCls + '-divider-dashed', !!dashed), _ref;
    }
  },
  render: function render() {
    var h = arguments[0];
    var classString = this.classString,
        prefixCls = this.prefixCls,
        $slots = this.$slots;

    return h(
      'div',
      { 'class': classString },
      [$slots['default'] && h(
        'span',
        { 'class': prefixCls + '-divider-inner-text' },
        [$slots['default']]
      )]
    );
  }
};
module.exports = exports['default'];