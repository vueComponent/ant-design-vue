
import Menu, { SubMenu, Item as MenuItem } from '../vc-menu'
import closest from 'dom-closest'
import classNames from 'classnames'
import Dropdown from '../dropdown'
import Icon from '../icon'
import Checkbox from '../checkbox'
import Radio from '../radio'
import FilterDropdownMenuWrapper from './FilterDropdownMenuWrapper'
import { FilterMenuProps } from './interface'
import { initDefaultProps } from '../_util/props-util'
import { cloneElement } from '../_util/vnode'
import BaseMixin from '../_util/BaseMixin'

export default {
  mixins: [BaseMixin],
  name: 'FilterMenu',
  props: initDefaultProps(FilterMenuProps, {
    handleFilter () {},
    column: {},
  }),

  data () {
    const visible = ('filterDropdownVisible' in this.column)
      ? this.column.filterDropdownVisible : false

    return {
      sSelectedKeys: this.selectedKeys,
      sKeyPathOfSelectedItem: {}, // 记录所有有选中子菜单的祖先菜单
      sVisible: visible,
    }
  },

  mounted () {
    const { column } = this
    this.$nextTick(() => {
      this.setNeverShown(column)
    })
  },

  componentWillReceiveProps (nextProps) {
    const { column } = nextProps
    this.setNeverShown(column)
    const newState = {}
    if ('selectedKeys' in nextProps) {
      newState.selectedKeys = nextProps.selectedKeys
    }
    if ('filterDropdownVisible' in column) {
      newState.visible = column.filterDropdownVisible
    }
    if (Object.keys(newState).length > 0) {
      this.setState(newState)
    }
  },
  methods: {

  },

  setNeverShown  (column) {
    const rootNode = this.$el
    const filterBelongToScrollBody = !!closest(rootNode, `.ant-table-scroll`)
    if (filterBelongToScrollBody) {
      // When fixed column have filters, there will be two dropdown menus
      // Filter dropdown menu inside scroll body should never be shown
      // To fix https://github.com/ant-design/ant-design/issues/5010 and
      // https://github.com/ant-design/ant-design/issues/7909
      this.neverShown = !!column.fixed
    }
  },

  setSelectedKeys ({ selectedKeys }) {
    this.setState({ sSelectedKeys: selectedKeys })
  },

  setVisible (visible) {
    const { column } = this
    if (!('filterDropdownVisible' in column)) {
      this.setState({ sVisible: visible })
    }
    if (column.onFilterDropdownVisibleChange) {
      column.onFilterDropdownVisibleChange(visible)
    }
  },

  handleClearFilters () {
    this.setState({
      sSelectedKeys: [],
    }, this.handleConfirm)
  },

  handleConfirm  () {
    this.setVisible(false)
    this.confirmFilter()
  },

  onVisibleChange  (visible) {
    this.setVisible(visible)
    if (!visible) {
      this.confirmFilter()
    }
  },

  confirmFilter () {
    if (this.sSelectedKeys !== this.selectedKeys) {
      this.confirmFilter(this.column, this.sSelectedKeys)
    }
  },

  renderMenuItem (item) {
    const { column } = this
    const multiple = ('filterMultiple' in column) ? column.filterMultiple : true
    const input = multiple ? (
      <Checkbox checked={this.sSelectedKeys.indexOf(item.value.toString()) >= 0} />
    ) : (
      <Radio checked={this.sSelectedKeys.indexOf(item.value.toString()) >= 0} />
    )

    return (
      <MenuItem key={item.value}>
        {input}
        <span>{item.text}</span>
      </MenuItem>
    )
  },

  hasSubMenu () {
    const { column: { filters = [] }} = this
    return filters.some(item => !!(item.children && item.children.length > 0))
  },

  renderMenus (items) {
    return items.map(item => {
      if (item.children && item.children.length > 0) {
        const { sKeyPathOfSelectedItem } = this
        const containSelected = Object.keys(sKeyPathOfSelectedItem).some(
          key => sKeyPathOfSelectedItem[key].indexOf(item.value) >= 0,
        )
        const subMenuCls = containSelected ? `${this.dropdownPrefixCls}-submenu-contain-selected` : ''
        return (
          <SubMenu title={item.text} class={subMenuCls} key={item.value.toString()}>
            {this.renderMenus(item.children)}
          </SubMenu>
        )
      }
      return this.renderMenuItem(item)
    })
  },

  handleMenuItemClick (info) {
    if (info.keyPath.length <= 1) {
      return
    }
    const keyPathOfSelectedItem = this.sKeyPathOfSelectedItem
    if (this.sSelectedKeys.indexOf(info.key) >= 0) {
      // deselect SubMenu child
      delete keyPathOfSelectedItem[info.key]
    } else {
      // select SubMenu child
      keyPathOfSelectedItem[info.key] = info.keyPath
    }
    this.setState({ keyPathOfSelectedItem })
  },

  renderFilterIcon () {
    const { column, locale, prefixCls } = this
    const filterIcon = column.filterIcon
    const dropdownSelectedClass = this.selectedKeys.length > 0 ? `${prefixCls}-selected` : ''

    return filterIcon ? cloneElement(filterIcon, {
      title: locale.filterTitle,
      className: classNames(filterIcon.className, {
        [`${prefixCls}-icon`]: true,
      }),
    }) : <Icon title={locale.filterTitle} type='filter' class={dropdownSelectedClass} />
  },
  render () {
    const { column, locale, prefixCls, dropdownPrefixCls, getPopupContainer } = this
    // default multiple selection in filter dropdown
    const multiple = ('filterMultiple' in column) ? column.filterMultiple : true
    const dropdownMenuClass = classNames({
      [`${dropdownPrefixCls}-menu-without-submenu`]: !this.hasSubMenu(),
    })
    const menus = column.filterDropdown ? (
      <FilterDropdownMenuWrapper>
        {column.filterDropdown}
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
        >
          {this.renderMenus(column.filters)}
        </Menu>
        <div class={`${prefixCls}-dropdown-btns`}>
          <a
            class={`${prefixCls}-dropdown-link confirm`}
            onClick={this.handleConfirm}
          >
            {locale.filterConfirm}
          </a>
          <a
            class={`${prefixCls}-dropdown-link clear`}
            onClick={this.handleClearFilters}
          >
            {locale.filterReset}
          </a>
        </div>
      </FilterDropdownMenuWrapper>
    )

    return (
      <Dropdown
        trigger={['click']}
        visible={this.neverShown ? false : this.sVisible}
        onVisibleChange={this.onVisibleChange}
        getPopupContainer={getPopupContainer}
        forceRender
      >
        <template slot='overlay'>{menus}</template>
        {this.renderFilterIcon()}
      </Dropdown>
    )
  },
}
