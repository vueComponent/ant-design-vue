import PropTypes from '../_util/vue-types';
import { getComponent, getSlot } from '../_util/props-util';
import { menuAllProps } from './util';
import { defineComponent, inject } from 'vue';
import classNames from '../_util/classNames';
import { injectExtraPropsKey } from './FunctionProvider';
const MenuItemGroup = {
  name: 'MenuItemGroup',
  inheritAttrs: false,
  setup() {
    return {
      injectExtraProps: inject(injectExtraPropsKey, () => ({})),
    };
  },
  props: {
    renderMenuItem: PropTypes.func,
    index: PropTypes.number,
    className: PropTypes.string,
    subMenuKey: PropTypes.string,
    rootPrefixCls: PropTypes.string,
    disabled: PropTypes.looseBool.def(true),
    title: PropTypes.any,
  },
  isMenuItemGroup: true,
  methods: {
    renderInnerMenuItem(item) {
      const { renderMenuItem, index, subMenuKey } = { ...this.$props, ...this.injectExtraProps };
      return renderMenuItem(item, index, subMenuKey);
    },
  },
  render() {
    const props = { ...this.$props, ...this.injectExtraProps, ...this.$attrs };
    const { class: cls = '', rootPrefixCls, title } = props;
    const titleClassName = `${rootPrefixCls}-item-group-title`;
    const listClassName = `${rootPrefixCls}-item-group-list`;
    menuAllProps.forEach(key => delete props[key]);
    // Set onClick to null, to ignore propagated onClick event
    delete props.onClick;
    const children = getSlot(this);
    return (
      <li {...props} class={classNames(cls, `${rootPrefixCls}-item-group`)}>
        <div class={titleClassName} title={typeof title === 'string' ? title : undefined}>
          {getComponent(this, 'title')}
        </div>
        <ul class={listClassName}>{children && children.map(this.renderInnerMenuItem)}</ul>
      </li>
    );
  },
};

export default defineComponent(MenuItemGroup);
