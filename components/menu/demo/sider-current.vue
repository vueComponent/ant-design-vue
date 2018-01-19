<template>
<div>
  <md>
  ## 只展开当前父级菜单
  点击菜单，收起其他展开的所有菜单，保持菜单聚焦简洁。
  </md>
  <Menu
    mode="inline"
    :openKeys="openKeys"
    @openChange="onOpenChange"
    style="width: 256px"
  >
    <SubMenu key="sub1">
      <span slot="title"><Icon type="mail" /><span>Navigation One</span></span>
      <MenuItem key="1">Option 1</MenuItem>
      <MenuItem key="2">Option 2</MenuItem>
      <MenuItem key="3">Option 3</MenuItem>
      <MenuItem key="4">Option 4</MenuItem>
    </SubMenu>
    <SubMenu key="sub2">
      <span slot="title"><Icon type="appstore" /><span>Navigation Two</span></span>
      <MenuItem key="5">Option 5</MenuItem>
      <MenuItem key="6">Option 6</MenuItem>
      <SubMenu key="sub3" title="Submenu">
        <MenuItem key="7">Option 7</MenuItem>
        <MenuItem key="8">Option 8</MenuItem>
      </SubMenu>
    </SubMenu>
    <SubMenu key="sub4">
      <span slot="title"><Icon type="setting" /><span>Navigation Three</span></span>
      <MenuItem key="9">Option 9</MenuItem>
      <MenuItem key="10">Option 10</MenuItem>
      <MenuItem key="11">Option 11</MenuItem>
      <MenuItem key="12">Option 12</MenuItem>
    </SubMenu>
  </Menu>
</div>
</template>
<script>
import { Menu, Icon } from 'antd'
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup
const MenuItem = Menu.Item
export default {
  data () {
    return {
      rootSubmenuKeys: ['sub1', 'sub2', 'sub4'],
      openKeys: ['sub1'],
    }
  },
  methods: {
    onOpenChange (openKeys) {
      const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1)
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
  },
  components: {
    Menu,
    Icon,
    SubMenu,
    MenuItemGroup,
    MenuItem,
  },
}

</script>
