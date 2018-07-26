
import PropTypes from '../_util/vue-types';
import { getComponentFromProp } from '../_util/props-util';

var MenuItemGroup = {
  name: 'MenuItemGroup',

  props: {
    renderMenuItem: PropTypes.func,
    index: PropTypes.number,
    className: PropTypes.string,
    rootPrefixCls: PropTypes.string,
    disabled: PropTypes.bool.def(true),
    title: PropTypes.any
  },
  isMenuItemGroup: true,
  methods: {
    renderInnerMenuItem: function renderInnerMenuItem(item, subIndex) {
      var _$props = this.$props,
          renderMenuItem = _$props.renderMenuItem,
          index = _$props.index;

      return renderMenuItem(item, index, subIndex);
    }
  },
  render: function render() {
    var h = arguments[0];

    var props = this.$props;
    var rootPrefixCls = props.rootPrefixCls;

    var titleClassName = rootPrefixCls + '-item-group-title';
    var listClassName = rootPrefixCls + '-item-group-list';
    return h(
      'li',
      { 'class': rootPrefixCls + '-item-group' },
      [h(
        'div',
        {
          'class': titleClassName,
          attrs: { title: typeof props.title === 'string' ? props.title : undefined
          }
        },
        [getComponentFromProp(this, 'title')]
      ), h(
        'ul',
        { 'class': listClassName },
        [this.$slots['default'] && this.$slots['default'].map(this.renderInnerMenuItem)]
      )]
    );
  }
};

export default MenuItemGroup;