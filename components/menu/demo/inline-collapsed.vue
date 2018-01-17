<template>
<div>
  <md>
  ## 缩起内嵌菜单
  内嵌菜单可以被缩起/展开。
  你可以在 [Layout](/components/layout/#components-layout-demo-side) 里查看侧边布局结合的完整示例。
  </md>
  <div style="width: 256px">
    <AntButton type="primary" @click="toggleCollapsed" style="margin-bottom: 16px">
      <Icon :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
    </AntButton>
    <Menu
      :defaultSelectedKeys="['1']"
      :defaultOpenKeys="['sub1']"
      mode="inline"
      theme="dark"
      :inlineCollapsed="collapsed"
    >
      <MenuItem key="1">
        <Icon type="pie-chart" />
        <span>Option 1</span>
      </MenuItem>
      <MenuItem key="2">
        <Icon type="desktop" />
        <span>Option 2</span>
      </MenuItem>
      <MenuItem key="3">
        <Icon type="inbox" />
        <span>Option 3</span>
      </MenuItem>
      <SubMenu key="sub1">
        <template slot="title">
          <span><Icon type="mail" /><span>Navigation One</span></span>
        </template>
        <MenuItem key="5">Option 5</MenuItem>
        <MenuItem key="6">Option 6</MenuItem>
        <MenuItem key="7">Option 7</MenuItem>
        <MenuItem key="8">Option 8</MenuItem>
      </SubMenu>
      <SubMenu key="sub2">
        <template slot="title">
          <span><Icon type="appstore" /><span>Navigation Two</span></span>
        </template>
        <MenuItem key="9">Option 9</MenuItem>
        <MenuItem key="10">Option 10</MenuItem>
        <SubMenu key="sub3" title="Submenu">
          <MenuItem key="11">Option 11</MenuItem>
          <MenuItem key="12">Option 12</MenuItem>
        </SubMenu>
      </SubMenu>
    </Menu>
  </div>
</div>
</template>
<script>
import { Menu, Icon, Button } from 'antd'
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup
const MenuItem = Menu.Item
export default {
  data () {
    return {
      collapsed: true,
    }
  },
  methods: {
    toggleCollapsed () {
      this.collapsed = !this.collapsed
    },
  },
  components: {
    Menu,
    Icon,
    SubMenu,
    MenuItemGroup,
    MenuItem,
    AntButton: Button,
  },
}

</script>
