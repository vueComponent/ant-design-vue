<template>
<div>
  <md>
  ## 主题
  内建了两套主题 `light|dark`，默认 `light`。
  </md>
  <a-checkbox @change="changeTheme" /> Change Theme
  <br />
  <br />
  <Menu
    style="width: 256px"
    :defaultSelectedKeys="['1']"
    :defaultOpenKeys="['sub1']"
    mode="inline"
    :theme="theme"
    :selectedKeys="[current]"
    @click="handleClick"
  >
    <MenuItem key="1">
      <Icon type="mail" />
      Navigation One
    </MenuItem>
    <MenuItem key="2">
      <Icon type="calendar" />
      Navigation Two
    </MenuItem>
    <SubMenu key="sub1">
      <span slot="title"><Icon type="appstore" /><span>Navigation Three</span></span>
      <MenuItem key="3">Option 3</MenuItem>
      <MenuItem key="4">Option 4</MenuItem>
      <SubMenu key="sub1-2" title="Submenu">
        <MenuItem key="5">Option 5</MenuItem>
        <MenuItem key="6">Option 6</MenuItem>
      </SubMenu>
    </SubMenu>
    <SubMenu key="sub2">
      <span slot="title"><Icon type="setting" /><span>Navigation Four</span></span>
      <MenuItem key="7">Option 7</MenuItem>
      <MenuItem key="8">Option 8</MenuItem>
      <MenuItem key="9">Option 9</MenuItem>
      <MenuItem key="10">Option 10</MenuItem>
    </SubMenu>
  </Menu>
</div>
</template>
<script>
import { Menu, Icon, Checkbox } from 'antd'
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup
const MenuItem = Menu.Item
export default {
  data () {
    return {
      current: '1',
      theme: 'dark',
    }
  },
  methods: {
    handleClick (e) {
      console.log('click ', e)
      this.current = e.key
    },
    changeTheme ({ target }) {
      this.theme = target.checked ? 'light' : 'dark'
    },
  },
  components: {
    Menu,
    Icon,
    SubMenu,
    MenuItemGroup,
    MenuItem,
    Checkbox,
  },
}

</script>
