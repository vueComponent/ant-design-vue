import Menu, { SubMenu, Item as MenuItem } from '../vc-menu';
import closest from 'dom-closest';
import classNames from 'classnames';
import shallowequal from 'shallowequal';
import Dropdown from '../dropdown';
import Icon from '../icon';
import Checkbox from '../checkbox';
import Radio from '../radio';
import FilterDropdownMenuWrapper from './FilterDropdownMenuWrapper';
import { FilterMenuProps } from './interface';
import { initDefaultProps, getOptionProps } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import BaseMixin from '../_util/BaseMixin';

function stopPropagation(e) {
  e.stopPropagation();
}

export default {
  name: 'FilterMenu',
  mixins: [BaseMixin],
  props: initDefaultProps(FilterMenuProps, {
    handleFilter() {},
    column: {},
  }),

  data() {
    const visible =
      'filterDropdownVisible' in this.column ? this.column.filterDropdownVisible : false;
    this.preProps = { ...getOptionProps(this) };
    return {
      sSelectedKeys: this.selectedKeys,
      sKeyPathOfSelectedItem: {}, // 记录所有有选中子菜单的祖先菜单
      sVisible: visible,
    };
  },
  watch: {
    _propsSymbol() {
      const nextProps = getOptionProps(this);
      const { column } = nextProps;
      this.setNeverShown(column);
      const newState = {};

      /**
       * if the state is visible the component should ignore updates on selectedKeys prop to avoid
       * that the user selection is lost
       * this happens frequently when a table is connected on some sort of realtime data
       * Fixes https://github.com/ant-design/ant-design/issues/10289 and
       * https://github.com/ant-design/ant-design/issues/10209
       */
      if (
        'selectedKeys' in nextProps &&
        !shallowequal(this.preProps.selectedKeys, nextProps.selectedKeys)
      ) {
        newState.sSelectedKeys = nextProps.selectedKeys;
      }
      if ('filterDropdownVisible' in column) {
        newState.sVisible = column.filterDropdownVisible;
      }
      if (Object.keys(newState).length > 0) {
        this.setState(newState);
      }
      this.preProps = { ...nextProps };
    },
    // 'column.fixed': function (val) {
    //   this.setNeverShown(this.column)
    // },
    // column (val) {
    //   if ('filterDropdownVisible' in val) {
    //     this.sVisible = val.filterDropdownVisible
    //   }
    // },
    // selectedKeys (val) {
    //   this.sSelectedKeys = val
    // },
  },

  mounted() {
    const { column } = this;
    this.$nextTick(() => {
      this.setNeverShown(column);
    });
  },
  methods: {
    getDropdownVisible() {
      return this.neverShown ? false : this.sVisible;
    },
    setNeverShown(column) {
      const rootNode = this.$el;
      const filterBelongToScrollBody = !!closest(rootNode, `.ant-table-scroll`);
      if (filterBelongToScrollBody) {
        // When fixed column have filters, there will be two dropdown menus
        // Filter dropdown menu inside scroll body should never be shown
        // To fix https://github.com/ant-design/ant-design/issues/5010 and
        // https://github.com/ant-design/ant-design/issues/7909
        this.neverShown = !!column.fixed;
      }
    },

    setSelectedKeys({ selectedKeys }) {
      this.setState({ sSelectedKeys: selectedKeys });
    },

    setVisible(visible) {
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
      this.confirmFilter2();
      // Call `setSelectedKeys` & `confirm` in the same time will make filter data not up to date
      // https://github.com/ant-design/ant-design/issues/12284
      this.$forceUpdate();
      this.$nextTick(() => {
        this.confirmFilter;
      });
    },

    onVisibleChange(visible) {
      this.setVisible(visible);
      if (!visible) {
        this.confirmFilter2();
      }
    },

    confirmFilter2() {
      if (!shallowequal(this.sSelectedKeys, this.selectedKeys)) {
        this.confirmFilter(this.column, this.sSelectedKeys);
      }
    },

    renderMenuItem(item) {
      const { column } = this;
      const { sSelectedKeys: selectedKeys } = this.$data;
      const multiple = 'filterMultiple' in column ? column.filterMultiple : true;
      const input = multiple ? (
        <Checkbox checked={selectedKeys && selectedKeys.indexOf(item.value.toString()) >= 0} />
      ) : (
        <Radio checked={selectedKeys && selectedKeys.indexOf(item.value.toString()) >= 0} />
      );

      return (
        <MenuItem key={item.value}>
          {input}
          <span>{item.text}</span>
        </MenuItem>
      );
    },

    hasSubMenu() {
      const {
        column: { filters = [] },
      } = this;
      return filters.some(item => !!(item.children && item.children.length > 0));
    },

    renderMenus(items) {
      return items.map(item => {
        if (item.children && item.children.length > 0) {
          const { sKeyPathOfSelectedItem } = this;
          const containSelected = Object.keys(sKeyPathOfSelectedItem).some(
            key => sKeyPathOfSelectedItem[key].indexOf(item.value) >= 0,
          );
          const subMenuCls = containSelected
            ? `${this.dropdownPrefixCls}-submenu-contain-selected`
            : '';
          return (
            <SubMenu title={item.text} class={subMenuCls} key={item.value.toString()}>
              {this.renderMenus(item.children)}
            </SubMenu>
          );
        }
        return this.renderMenuItem(item);
      });
    },

    handleMenuItemClick(info) {
      const { sSelectedKeys: selectedKeys } = this.$data;
      if (!info.keyPath || info.keyPath.length <= 1) {
        return;
      }
      const keyPathOfSelectedItem = this.sKeyPathOfSelectedItem;
      if (selectedKeys && selectedKeys.indexOf(info.key) >= 0) {
        // deselect SubMenu child
        delete keyPathOfSelectedItem[info.key];
      } else {
        // select SubMenu child
        keyPathOfSelectedItem[info.key] = info.keyPath;
      }
      this.setState({ keyPathOfSelectedItem });
    },

    renderFilterIcon() {
      const { column, locale, prefixCls, selectedKeys } = this;
      const filtered = selectedKeys && selectedKeys.length > 0;
      let filterIcon = column.filterIcon;
      if (typeof filterIcon === 'function') {
        filterIcon = filterIcon(filtered, column);
      }
      const dropdownIconClass = classNames({
        [`${prefixCls}-selected`]: filtered,
        [`${prefixCls}-open`]: this.getDropdownVisible(),
      });

      return filterIcon ? (
        cloneElement(filterIcon, {
          attrs: {
            title: locale.filterTitle,
          },
          on: {
            click: stopPropagation,
          },
          class: classNames(`${prefixCls}-icon`, dropdownIconClass),
        })
      ) : (
        <Icon
          title={locale.filterTitle}
          type="filter"
          theme="filled"
          class={dropdownIconClass}
          onClick={stopPropagation}
        />
      );
    },
  },

  render() {
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
        selectedKeys: this.sSelectedKeys,
        confirm: this.handleConfirm,
        clearFilters: this.handleClearFilters,
        filters: column.filters,
        getPopupContainer: triggerNode => triggerNode.parentNode,
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
          selectedKeys={this.sSelectedKeys}
          getPopupContainer={triggerNode => triggerNode.parentNode}
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
      >
        <template slot="overlay">{menus}</template>
        {this.renderFilterIcon()}
      </Dropdown>
    );
  },
};
