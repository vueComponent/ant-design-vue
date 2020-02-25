import PropTypes from '../_util/vue-types';
import { Provider, create } from '../_util/store';
import { default as SubPopupMenu, getActiveKey } from './SubPopupMenu';
import BaseMixin from '../_util/BaseMixin';
import hasProp, {
  getOptionProps,
  getComponentFromProp,
  filterEmpty,
  getListeners,
} from '../_util/props-util';
import commonPropsType from './commonPropsType';

const Menu = {
  name: 'Menu',
  props: {
    ...commonPropsType,
    selectable: PropTypes.bool.def(true),
  },
  mixins: [BaseMixin],

  data() {
    const props = getOptionProps(this);
    let selectedKeys = props.defaultSelectedKeys;
    let openKeys = props.defaultOpenKeys;
    if ('selectedKeys' in props) {
      selectedKeys = props.selectedKeys || [];
    }
    if ('openKeys' in props) {
      openKeys = props.openKeys || [];
    }

    this.store = create({
      selectedKeys,
      openKeys,
      activeKey: {
        '0-menu-': getActiveKey({ ...props, children: this.$slots.default || [] }, props.activeKey),
      },
    });

    // this.isRootMenu = true // 声明在props上
    return {};
  },
  mounted() {
    this.updateMiniStore();
  },
  updated() {
    this.updateMiniStore();
  },
  methods: {
    onSelect(selectInfo) {
      const props = this.$props;
      if (props.selectable) {
        // root menu
        let selectedKeys = this.store.getState().selectedKeys;
        const selectedKey = selectInfo.key;
        if (props.multiple) {
          selectedKeys = selectedKeys.concat([selectedKey]);
        } else {
          selectedKeys = [selectedKey];
        }
        if (!hasProp(this, 'selectedKeys')) {
          this.store.setState({
            selectedKeys,
          });
        }
        this.__emit('select', {
          ...selectInfo,
          selectedKeys: selectedKeys,
        });
      }
    },

    onClick(e) {
      this.__emit('click', e);
    },
    // onKeyDown needs to be exposed as a instance method
    // e.g., in rc-select, we need to navigate menu item while
    // current active item is rc-select input box rather than the menu itself
    onKeyDown(e, callback) {
      this.$refs.innerMenu.getWrappedInstance().onKeyDown(e, callback);
    },
    onOpenChange(event) {
      const openKeys = this.store.getState().openKeys.concat();
      let changed = false;
      const processSingle = e => {
        let oneChanged = false;
        if (e.open) {
          oneChanged = openKeys.indexOf(e.key) === -1;
          if (oneChanged) {
            openKeys.push(e.key);
          }
        } else {
          const index = openKeys.indexOf(e.key);
          oneChanged = index !== -1;
          if (oneChanged) {
            openKeys.splice(index, 1);
          }
        }
        changed = changed || oneChanged;
      };
      if (Array.isArray(event)) {
        // batch change call
        event.forEach(processSingle);
      } else {
        processSingle(event);
      }
      if (changed) {
        if (!hasProp(this, 'openKeys')) {
          this.store.setState({ openKeys });
        }
        this.__emit('openChange', openKeys);
      }
    },

    onDeselect(selectInfo) {
      const props = this.$props;
      if (props.selectable) {
        const selectedKeys = this.store.getState().selectedKeys.concat();
        const selectedKey = selectInfo.key;
        const index = selectedKeys.indexOf(selectedKey);
        if (index !== -1) {
          selectedKeys.splice(index, 1);
        }
        if (!hasProp(this, 'selectedKeys')) {
          this.store.setState({
            selectedKeys,
          });
        }
        this.__emit('deselect', {
          ...selectInfo,
          selectedKeys: selectedKeys,
        });
      }
    },

    getOpenTransitionName() {
      const props = this.$props;
      let transitionName = props.openTransitionName;
      const animationName = props.openAnimation;
      if (!transitionName && typeof animationName === 'string') {
        transitionName = `${props.prefixCls}-open-${animationName}`;
      }
      return transitionName;
    },
    updateMiniStore() {
      const props = getOptionProps(this);
      if ('selectedKeys' in props) {
        this.store.setState({
          selectedKeys: props.selectedKeys || [],
        });
      }
      if ('openKeys' in props) {
        this.store.setState({
          openKeys: props.openKeys || [],
        });
      }
    },
  },

  render() {
    const props = getOptionProps(this);
    const subPopupMenuProps = {
      props: {
        ...props,
        itemIcon: getComponentFromProp(this, 'itemIcon', props),
        expandIcon: getComponentFromProp(this, 'expandIcon', props),
        overflowedIndicator: getComponentFromProp(this, 'overflowedIndicator', props) || (
          <span>···</span>
        ),
        openTransitionName: this.getOpenTransitionName(),
        parentMenu: this,
        children: filterEmpty(this.$slots.default || []),
      },
      class: `${props.prefixCls}-root`,
      on: {
        ...getListeners(this),
        click: this.onClick,
        openChange: this.onOpenChange,
        deselect: this.onDeselect,
        select: this.onSelect,
      },
      ref: 'innerMenu',
    };
    return (
      <Provider store={this.store}>
        <SubPopupMenu {...subPopupMenuProps} />
      </Provider>
    );
  },
};
export default Menu;
