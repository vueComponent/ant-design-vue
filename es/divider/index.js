import _defineProperty from 'babel-runtime/helpers/defineProperty';

import PropTypes from '../_util/vue-types';
export default {
  name: 'ADivider',
  props: {
    prefixCls: PropTypes.string.def('ant'),
    type: PropTypes.oneOf(['horizontal', 'vertical']).def('horizontal'),
    dashed: PropTypes.bool,
    orientation: PropTypes.oneOf(['left', 'right'])
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

      return _ref = {}, _defineProperty(_ref, prefixCls + '-divider', true), _defineProperty(_ref, prefixCls + '-divider-' + type, true), _defineProperty(_ref, prefixCls + '-divider-with-text' + orientationPrefix, $slots['default']), _defineProperty(_ref, prefixCls + '-divider-dashed', !!dashed), _ref;
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