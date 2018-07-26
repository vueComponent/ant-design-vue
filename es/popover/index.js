import _extends from 'babel-runtime/helpers/extends';

import Tooltip from '../tooltip';
import abstractTooltipProps from '../tooltip/abstractTooltipProps';
import PropTypes from '../_util/vue-types';
import { getOptionProps, getComponentFromProp } from '../_util/props-util';

var props = abstractTooltipProps();
export default {
  name: 'APopover',
  props: _extends({}, props, {
    prefixCls: PropTypes.string.def('ant-popover'),
    transitionName: PropTypes.string.def('zoom-big'),
    content: PropTypes.any,
    title: PropTypes.any
  }),
  model: {
    prop: 'visible',
    event: 'visibleChange'
  },
  methods: {
    getPopupDomNode: function getPopupDomNode() {
      return this.$refs.tooltip.getPopupDomNode();
    }
  },

  render: function render(h) {
    var title = this.title,
        prefixCls = this.prefixCls,
        $slots = this.$slots;

    var props = getOptionProps(this);
    delete props.title;
    delete props.content;
    var tooltipProps = {
      props: _extends({}, props),
      ref: 'tooltip',
      on: this.$listeners
    };
    return h(
      Tooltip,
      tooltipProps,
      [h(
        'template',
        { slot: 'title' },
        [h('div', [(title || $slots.title) && h(
          'div',
          { 'class': prefixCls + '-title' },
          [getComponentFromProp(this, 'title')]
        ), h(
          'div',
          { 'class': prefixCls + '-inner-content' },
          [getComponentFromProp(this, 'content')]
        )])]
      ), this.$slots['default']]
    );
  }
};