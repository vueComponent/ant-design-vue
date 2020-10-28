import PropTypes from '../_util/vue-types';
import { getComponentFromProp, getListeners } from '../_util/props-util';
import { injectExtraPropsKey } from './FunctionProvider';

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
  inject: {
    injectExtraProps: {
      from: injectExtraPropsKey,
      default: () => ({}),
    },
  },
  methods: {
    renderInnerMenuItem(item) {
      const { renderMenuItem, index, subMenuKey } = {
        ...this.$props,
        ...this.injectExtraProps.$attrs,
      };
      return renderMenuItem(item, index, subMenuKey);
    },
  },
  render() {
    const props = { ...this.$props, ...this.injectExtraProps.$attrs, ...this.$attrs };
    const { rootPrefixCls, title } = props;
    const titleClassName = `${rootPrefixCls}-item-group-title`;
    const listClassName = `${rootPrefixCls}-item-group-list`;
    // menuAllProps.props.forEach(key => delete props[key])
    const listeners = { ...getListeners(this), ...this.injectExtraProps.$listeners };
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
