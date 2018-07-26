import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';

import PropTypes from '../_util/vue-types';
import { getOptionProps } from '../_util/props-util';
import RcCollapse from './src';
import { panelProps } from './src/commonProps';

export default {
  name: 'ACollapsePanel',
  props: _extends({
    name: PropTypes.string
  }, panelProps),
  render: function render() {
    var h = arguments[0];
    var prefixCls = this.prefixCls,
        _showArrow = this.showArrow,
        showArrow = _showArrow === undefined ? true : _showArrow,
        $listeners = this.$listeners;

    var collapsePanelClassName = _defineProperty({}, prefixCls + '-no-arrow', !showArrow);
    var rcCollapePanelProps = {
      props: _extends({}, getOptionProps(this)),
      'class': collapsePanelClassName,
      on: $listeners
    };
    var _$slots = this.$slots,
        defaultSlots = _$slots['default'],
        header = _$slots.header;

    return h(
      RcCollapse.Panel,
      rcCollapePanelProps,
      [defaultSlots, header ? h(
        'template',
        { slot: 'header' },
        [header]
      ) : null]
    );
  }
};