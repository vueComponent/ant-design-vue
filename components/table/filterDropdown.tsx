import { reactive, defineComponent, nextTick, computed, watch } from 'vue';
import FilterFilled from '@ant-design/icons-vue/FilterFilled';
import Menu, { SubMenu, MenuItem } from '../menu';
import classNames from '../_util/classNames';
import shallowequal from '../_util/shallowequal';
import Dropdown from '../dropdown';
import Checkbox from '../checkbox';
import Radio from '../radio';
import FilterDropdownMenuWrapper from './FilterDropdownMenuWrapper';
import { FilterMenuProps } from './interface';
import { isValidElement } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import { cloneElement } from '../_util/vnode';
import BaseMixin2 from '../_util/BaseMixin2';
import { generateValueMaps } from './util';
import type { Key } from '../_util/type';

function stopPropagation(e) {
  e.stopPropagation();
}

export default defineComponent({
  name: 'FilterMenu',
  mixins: [BaseMixin2],
  inheritAttrs: false,
  props: initDefaultProps(FilterMenuProps, {
    column: {},
  }),
  setup(props) {
    const sSelectedKeys = computed(() => props.selectedKeys);
    const sVisible = computed(() => {
      return 'filterDropdownVisible' in props.column ? props.column.filterDropdownVisible : false;
    });
    const sValueKeys = computed(() => generateValueMaps(props.column.filters));
    const state = reactive({
      neverShown: false,
      sSelectedKeys: sSelectedKeys.value,
      sKeyPathOfSelectedItem: {}, // 记录所有有选中子菜单的祖先菜单
      sVisible: sVisible.value,
      sValueKeys: sValueKeys.value,
    });
    watch(sSelectedKeys, () => {
      state.sSelectedKeys = sSelectedKeys.value;
    });
    watch(sVisible, () => {
      state.sVisible = sVisible.value;
    });
    watch(sValueKeys, () => {
      state.sValueKeys = sValueKeys.value;
    });
    // watchEffect(
    //   () => {
    //     const { column } = nextProps;
    //     if (!shallowequal(preProps.selectedKeys, nextProps.selectedKeys)) {
    //       state.sSelectedKeys = nextProps.selectedKeys;
    //     }
    //     if (!shallowequal((preProps.column || {}).filters, (nextProps.column || {}).filters)) {
    //       state.sValueKeys = generateValueMaps(nextProps.column.filters);
    //     }
    //     if ('filterDropdownVisible' in column) {
    //       state.sVisible = column.filterDropdownVisible;
    //     }
    //     preProps = { ...nextProps };
    //   },
    //   { flush: 'sync' },
    // );
    return state;
  },
  methods: {
    getDropdownVisible() {
      return !!this.sVisible;
    },

    setSelectedKeys({ selectedKeys }) {
      this.setState({ sSelectedKeys: selectedKeys });
    },

    setVisible(visible: boolean) {
      const { column } = this;
      if (!('filterDropdownVisible' in column)) {
        this.setState({ sVisible: visible });
      }
      if (column.onFilterDropdownVisibleChange) {
        column.onFilterDropdownVisibleChange(visible);
      }
    },

    handleClearFilters() {
      this.setState(
        {
          sSelectedKeys: [],
        },
        this.handleConfirm,
      );
    },

    handleConfirm() {
      this.setVisible(false);
      // Call `setSelectedKeys` & `confirm` in the same time will make filter data not up to date
      // https://github.com/ant-design/ant-design/issues/12284
      (this as any).$forceUpdate();
      nextTick(this.confirmFilter2);
    },

    onVisibleChange(visible: boolean) {
      this.setVisible(visible);
      const { column } = this.$props;
      // https://github.com/ant-design/ant-design/issues/17833
      if (!visible && !(column.filterDropdown instanceof Function)) {
        this.confirmFilter2();
      }
    },
    handleMenuItemClick(info: { keyPath: Key[]; key: Key }) {
      const { sSelectedKeys: selectedKeys } = this;
      if (!info.keyPath || info.keyPath.length <= 1) {
        return;
      }
      const { sKeyPathOfSelectedItem: keyPathOfSelectedItem } = this;
      if (selectedKeys && selectedKeys.indexOf(info.key) >= 0) {
        // deselect SubMenu child
        delete keyPathOfSelectedItem[info.key];
      } else {
        // select SubMenu child
        keyPathOfSelectedItem[info.key] = info.keyPath;
      }
      this.setState({ sKeyPathOfSelectedItem: keyPathOfSelectedItem });
    },

    hasSubMenu() {
      const {
        column: { filters = [] },
      } = this;
      return filters.some(item => !!(item.children && item.children.length > 0));
    },

    confirmFilter2() {
      const { column, selectedKeys: propSelectedKeys, confirmFilter } = this.$props;
      const { sSelectedKeys: selectedKeys, sValueKeys: valueKeys } = this;
      const { filterDropdown } = column;

      if (!shallowequal(selectedKeys, propSelectedKeys)) {
        confirmFilter(
          column,
          filterDropdown
            ? selectedKeys
            : selectedKeys.map((key: any) => valueKeys[key]).filter(key => key !== undefined),
        );
      }
    },

    renderMenus(items) {
      const { dropdownPrefixCls, prefixCls } = this.$props;
      return items.map(item => {
        if (item.children && item.children.length > 0) {
          const { sKeyPathOfSelectedItem } = this;
          const containSelected = Object.keys(sKeyPathOfSelectedItem).some(
            key => sKeyPathOfSelectedItem[key].indexOf(item.value) >= 0,
          );
          const subMenuCls = classNames(`${prefixCls}-dropdown-submenu`, {
            [`${dropdownPrefixCls}-submenu-contain-selected`]: containSelected,
          });
          return (
            <SubMenu title={item.text} popupClassName={subMenuCls} key={item.value}>
              {this.renderMenus(item.children)}
            </SubMenu>
          );
        }
        return this.renderMenuItem(item);
      });
    },

    renderFilterIcon() {
      const { column, locale, prefixCls, selectedKeys } = this;
      const filtered = selectedKeys && selectedKeys.length > 0;
      let filterIcon = column.filterIcon;
      if (typeof filterIcon === 'function') {
        filterIcon = filterIcon({ filtered, column });
      }
      const dropdownIconClass = classNames({
        [`${prefixCls}-selected`]: 'filtered' in column ? column.filtered : filtered,
        [`${prefixCls}-open`]: this.getDropdownVisible(),
      });
      if (!filterIcon) {
        return (
          <FilterFilled
            title={locale.filterTitle}
            class={dropdownIconClass}
            onClick={stopPropagation}
          />
        );
      }
      if (filterIcon.length === 1 && isValidElement(filterIcon[0])) {
        return cloneElement(filterIcon[0], {
          title: filterIcon.props?.title || locale.filterTitle,
          onClick: stopPropagation,
          class: classNames(`${prefixCls}-icon`, dropdownIconClass, filterIcon.props?.class),
        });
      }
      return (
        <span class={classNames(`${prefixCls}-icon`, dropdownIconClass)} onClick={stopPropagation}>
          {filterIcon}
        </span>
      );
    },

    renderMenuItem(item) {
      const { column } = this;
      const { sSelectedKeys: selectedKeys } = this;
      const multiple = 'filterMultiple' in column ? column.filterMultiple : true;
      const input = multiple ? (
        <Checkbox checked={selectedKeys && selectedKeys.indexOf(item.value) >= 0} />
      ) : (
        <Radio checked={selectedKeys && selectedKeys.indexOf(item.value) >= 0} />
      );

      return (
        <MenuItem key={item.value}>
          {input}
          <span>{item.text}</span>
        </MenuItem>
      );
    },
  },

  render() {
    const { sSelectedKeys: originSelectedKeys } = this as any;
    const { column, locale, prefixCls, dropdownPrefixCls, getPopupContainer } = this;
    // default multiple selection in filter dropdown
    const multiple = 'filterMultiple' in column ? column.filterMultiple : true;
    const dropdownMenuClass = classNames({
      [`${dropdownPrefixCls}-menu-without-submenu`]: !this.hasSubMenu(),
    });
    let { filterDropdown } = column;
    if (filterDropdown instanceof Function) {
      filterDropdown = filterDropdown({
        prefixCls: `${dropdownPrefixCls}-custom`,
        setSelectedKeys: selectedKeys => this.setSelectedKeys({ selectedKeys }),
        selectedKeys: originSelectedKeys,
        confirm: this.handleConfirm,
        clearFilters: this.handleClearFilters,
        filters: column.filters,
        visible: this.getDropdownVisible(),
        column,
      });
    }

    const menus = filterDropdown ? (
      <FilterDropdownMenuWrapper class={`${prefixCls}-dropdown`}>
        {filterDropdown}
      </FilterDropdownMenuWrapper>
    ) : (
      <FilterDropdownMenuWrapper class={`${prefixCls}-dropdown`}>
        <Menu
          multiple={multiple}
          onClick={this.handleMenuItemClick}
          prefixCls={`${dropdownPrefixCls}-menu`}
          class={dropdownMenuClass}
          onSelect={this.setSelectedKeys}
          onDeselect={this.setSelectedKeys}
          selectedKeys={originSelectedKeys}
          getPopupContainer={getPopupContainer}
        >
          {this.renderMenus(column.filters)}
        </Menu>
        <div class={`${prefixCls}-dropdown-btns`}>
          <a class={`${prefixCls}-dropdown-link confirm`} onClick={this.handleConfirm}>
            {locale.filterConfirm}
          </a>
          <a class={`${prefixCls}-dropdown-link clear`} onClick={this.handleClearFilters}>
            {locale.filterReset}
          </a>
        </div>
      </FilterDropdownMenuWrapper>
    );

    return (
      <Dropdown
        trigger={['click']}
        placement="bottomRight"
        visible={this.getDropdownVisible()}
        onVisibleChange={this.onVisibleChange}
        getPopupContainer={getPopupContainer}
        forceRender
        overlay={menus}
      >
        {this.renderFilterIcon()}
      </Dropdown>
    );
  },
});
