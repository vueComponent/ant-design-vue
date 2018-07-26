
import PropTypes from '../_util/vue-types';
import { hasProp, getComponentFromProp } from '../_util/props-util';

export default {
  name: 'ABreadcrumbItem',
  __ANT_BREADCRUMB_ITEM: true,
  props: {
    prefixCls: PropTypes.string.def('ant-breadcrumb'),
    href: PropTypes.string,
    separator: PropTypes.any
  },
  render: function render() {
    var h = arguments[0];
    var prefixCls = this.prefixCls,
        $slots = this.$slots;

    var children = $slots['default'];
    var link = void 0;
    if (hasProp(this, 'href')) {
      link = h(
        'a',
        { 'class': prefixCls + '-link' },
        [children]
      );
    } else {
      link = h(
        'span',
        { 'class': prefixCls + '-link' },
        [children]
      );
    }
    if (children) {
      return h('span', [link, h(
        'span',
        { 'class': prefixCls + '-separator' },
        [getComponentFromProp(this, 'separator') || '/']
      )]);
    }
    return null;
  }
};