import _defineProperty from 'babel-runtime/helpers/defineProperty';

import { filterEmpty } from '../_util/props-util';
var ButtonGroupProps = {
  prefixCls: {
    'default': 'ant-btn-group',
    type: String
  },
  size: {
    validator: function validator(value) {
      return ['small', 'large', 'default'].includes(value);
    }
  }
};
export { ButtonGroupProps };
export default {
  name: 'AButtonGroup',
  props: ButtonGroupProps,
  data: function data() {
    return {
      sizeMap: {
        large: 'lg',
        small: 'sm'
      }
    };
  },

  computed: {
    classes: function classes() {
      var _ref;

      var prefixCls = this.prefixCls,
          size = this.size,
          sizeMap = this.sizeMap;

      var sizeCls = sizeMap[size] || '';
      return [(_ref = {}, _defineProperty(_ref, '' + prefixCls, true), _defineProperty(_ref, prefixCls + '-' + sizeCls, sizeCls), _ref)];
    }
  },
  render: function render() {
    var h = arguments[0];
    var classes = this.classes,
        $slots = this.$slots;

    return h(
      'div',
      { 'class': classes },
      [filterEmpty($slots['default'])]
    );
  }
};