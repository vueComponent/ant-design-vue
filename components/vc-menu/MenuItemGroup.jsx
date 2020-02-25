import PropTypes from '../_util/vue-types';
import { getComponentFromProp, getListeners } from '../_util/props-util';
// import { menuAllProps } from './util'

const MenuItemGroup = {
  name: 'MenuItemGroup',

  props: {
    renderMenuItem: PropTypes.func,
    index: PropTypes.number,
    className: PropTypes.string,
    subMenuKey: PropTypes.string,
    rootPrefixCls: PropTypes.string,
    disabled: PropTypes.bool.def(true),
    title: PropTypes.any,
  },
  isMenuItemGroup: true,
  methods: {
    renderInnerMenuItem(item) {
      const { renderMenuItem, index, subMenuKey } = this.$props;
      return renderMenuItem(item, index, subMenuKey);
    },
  },
  render() {
    const props = { ...this.$props };
    const { rootPrefixCls, title } = props;
    const titleClassName = `${rootPrefixCls}-item-group-title`;
    const listClassName = `${rootPrefixCls}-item-group-list`;
    // menuAllProps.props.forEach(key => delete props[key])
    const listeners = { ...getListeners(this) };
    delete listeners.click;

    return (
      <li {...{ on: listeners, class: `${rootPrefixCls}-item-group` }}>
        <div class={titleClassName} title={typeof title === 'string' ? title : undefined}>
          {getComponentFromProp(this, 'title')}
        </div>
        <ul class={listClassName}>
          {this.$slots.default && this.$slots.default.map(this.renderInnerMenuItem)}
        </ul>
      </li>
    );
  },
};

export default MenuItemGroup;
