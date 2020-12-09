import PropTypes from '../_util/vue-types';
import { default as SubPopupMenu } from './SubPopupMenu';
import BaseMixin from '../_util/BaseMixin';
import hasProp, { getOptionProps, getComponent } from '../_util/props-util';
import commonPropsType from './commonPropsType';
import {
  computed,
  defineComponent,
  getCurrentInstance,
  provide,
  reactive,
  ref,
  toRaw,
  watch,
} from 'vue';
import { isEqual } from 'lodash-es';

const Menu = {
  name: 'Menu',
  inheritAttrs: false,
  props: {
    ...commonPropsType,
    onClick: PropTypes.func,
    selectable: PropTypes.looseBool.def(true),
  },
  mixins: [BaseMixin],
  setup(props) {
    const menuChildrenInfo = reactive({});
    const selectedKeys = ref(props.selectedKeys || props.defaultSelectedKeys || []);
    const openKeys = ref(props.openKeys || props.defaultOpenKeys || []);
    //  computed(() => {
    //   return props.openKeys || props.defaultOpenKeys || [];
    // });
    watch(
      () => props.selectedKeys,
      () => {
        selectedKeys.value = props.selectedKeys;
      },
    );
    watch(
      () => props.openKeys,
      () => {
        openKeys.value = props.openKeys || [];
      },
    );
    const activeKey = reactive({
      '0-menu-': props.activeKey,
    });
    const defaultActiveFirst = reactive({});
    const addChildrenInfo = (key, info) => {
      menuChildrenInfo[key] = info;
    };
    const removeChildrenInfo = key => {
      delete menuChildrenInfo[key];
    };
    const getActiveKey = key => {
      return key;
    }; // TODO
    const selectedParentUniKeys = ref([]);
    watch(menuChildrenInfo, () => {
      const keys = Object.values(menuChildrenInfo)
        .filter(info => info.isSelected)
        .reduce((allKeys, { parentUniKeys = [] }) => {
          return [...allKeys, ...toRaw(parentUniKeys)];
        }, []);
      if (!isEqual(selectedParentUniKeys.value, keys)) {
        selectedParentUniKeys.value = keys || [];
      }
    });
    const store = reactive({
      selectedKeys,
      openKeys,
      activeKey,
      defaultActiveFirst,
      menuChildrenInfo,
      selectedParentUniKeys,
      addChildrenInfo,
      removeChildrenInfo,
      getActiveKey,
    });
    const ins = getCurrentInstance();
    const getEl = () => {
      return ins.vnode.el;
    };
    provide('menuStore', store);
    provide(
      'parentMenu',
      reactive({
        isRootMenu: computed(() => props.isRootMenu),
        getPopupContainer: computed(() => props.getPopupContainer),
        getEl,
      }),
    );
    return {
      store,
    };
  },
  methods: {
    handleSelect(selectInfo) {
      const props = this.$props;
      if (props.selectable) {
        // root menu
        let selectedKeys = this.store.selectedKeys;
        const selectedKey = selectInfo.key;
        if (props.multiple) {
          selectedKeys = selectedKeys.concat([selectedKey]);
        } else {
          selectedKeys = [selectedKey];
        }
        if (!hasProp(this, 'selectedKeys')) {
          this.store.selectedKeys = selectedKeys;
        }
        this.__emit('select', {
          ...selectInfo,
          selectedKeys,
        });
      }
    },

    handleClick(e) {
      this.__emit('click', e);
    },
    // onKeyDown needs to be exposed as a instance method
    // e.g., in rc-select, we need to navigate menu item while
    // current active item is rc-select input box rather than the menu itself
    onKeyDown(e, callback) {
      this.innerMenu.getWrappedInstance().onKeyDown(e, callback);
    },
    onOpenChange(event) {
      const openKeys = this.store.openKeys.concat();
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
          this.store.openKeys = openKeys;
        }
        this.__emit('openChange', openKeys);
      }
    },

    handleDeselect(selectInfo) {
      const props = this.$props;
      if (props.selectable) {
        const selectedKeys = this.store.selectedKeys.concat();
        const selectedKey = selectInfo.key;
        const index = selectedKeys.indexOf(selectedKey);
        if (index !== -1) {
          selectedKeys.splice(index, 1);
        }
        if (!hasProp(this, 'selectedKeys')) {
          this.store.selectedKeys = selectedKeys;
        }
        this.__emit('deselect', {
          ...selectInfo,
          selectedKeys,
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
    saveInnerMenu(ref) {
      this.innerMenu = ref;
    },
  },

  render() {
    const props = { ...getOptionProps(this), ...this.$attrs };
    props.class = props.class
      ? `${props.class} ${props.prefixCls}-root`
      : `${props.prefixCls}-root`;
    const subPopupMenuProps = {
      ...props,
      itemIcon: getComponent(this, 'itemIcon', props),
      expandIcon: getComponent(this, 'expandIcon', props),
      overflowedIndicator: getComponent(this, 'overflowedIndicator', props) || <span>···</span>,
      openTransitionName: this.getOpenTransitionName(),
      onClick: this.handleClick,
      onOpenChange: this.onOpenChange,
      onDeselect: this.handleDeselect,
      onSelect: this.handleSelect,
      ref: this.saveInnerMenu,
      store: this.store,
    };
    return <SubPopupMenu {...subPopupMenuProps} v-slots={this.$slots} />;
  },
};

export default defineComponent(Menu);
