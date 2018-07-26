import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';

import PropTypes from '../_util/vue-types';
import animation from '../_util/openAnimation';
import { getOptionProps } from '../_util/props-util';
import RcCollapse from './src';
import { collapseProps } from './src/commonProps';

export default {
  name: 'ACollapse',
  model: {
    prop: 'activeKey',
    event: 'change'
  },
  props: _extends({}, collapseProps, {
    bordered: PropTypes.bool.def(true),
    openAnimation: PropTypes.any.def(animation),
    change: PropTypes.func.def(function () {}),
    accordion: PropTypes.bool
  }),
  render: function render() {
    var h = arguments[0];
    var prefixCls = this.prefixCls,
        bordered = this.bordered,
        $listeners = this.$listeners;

    var collapseClassName = _defineProperty({}, prefixCls + '-borderless', !bordered);
    var rcCollapeProps = {
      props: _extends({}, getOptionProps(this)),
      'class': collapseClassName,
      on: $listeners
    };
    return h(
      RcCollapse,
      rcCollapeProps,
      [this.$slots['default']]
    );
  }
};