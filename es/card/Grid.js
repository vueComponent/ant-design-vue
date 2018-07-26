import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';

import PropTypes from '../_util/vue-types';

export default {
  name: 'ACardGrid',
  props: {
    prefixCls: PropTypes.string.def('ant-card')
  },
  render: function render() {
    var h = arguments[0];

    var _$props = this.$props,
        _$props$prefixCls = _$props.prefixCls,
        prefixCls = _$props$prefixCls === undefined ? 'ant-card' : _$props$prefixCls,
        others = _objectWithoutProperties(_$props, ['prefixCls']);

    var classString = _defineProperty({}, prefixCls + '-grid', true);
    return h(
      'div',
      _mergeJSXProps([others, { 'class': classString }]),
      [this.$slots['default']]
    );
  }
};