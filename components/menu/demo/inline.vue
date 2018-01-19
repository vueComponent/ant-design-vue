<template>
<div>
  <md>
  ## 内嵌菜单
  垂直菜单，子菜单内嵌在菜单区域。
  </md>
  <Menu
    @click="handleClick"
    style="width: 256px"
    :defaultSelectedKeys="['1']"
    :openKeys.sync="openKeys"
    mode="inline"
  >
    <SubMenu key="sub1" @titleClick="titleClick">
      <span slot="title"><Icon type="mail" /><span>Navigation One</span></span>
      <MenuItemGroup key="g1">
        <template slot="title"><Icon type="qq" /><span>Item 1</span></template>
        <MenuItem key="1">Option 1</MenuItem>
        <MenuItem key="2">Option 2</MenuItem>
      </MenuItemGroup>
      <MenuItemGroup key="g2" title="Item 2">
        <MenuItem key="3">Option 3</MenuItem>
        <MenuItem key="4">Option 4</MenuItem>
      </MenuItemGroup>
    </SubMenu>
    <SubMenu key="sub2" @titleClick="titleClick">
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
      current: ['mail'],
      openKeys: ['sub1'],
    }
  },
  methods: {
    handleClick (e) {
      console.log('click', e)
    },
    titleClick (e) {
      console.log('titleClick', e)
    },
  },
  watch: {
    openKeys (val) {
      console.log('openKeys', val)
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
