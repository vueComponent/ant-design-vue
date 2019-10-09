<cn>
#### 侧边布局
侧边两列式布局。页面横向空间有限时，侧边导航可收起。
侧边导航在页面布局上采用的是左右的结构，一般主导航放置于页面的左侧固定位置，辅助菜单放置于工作区顶部。内容根据浏览器终端进行自适应，能提高横向空间的使用率，但是整个页面排版不稳定。侧边导航的模式层级扩展性强，一、二、三级导航项目可以更为顺畅且具关联性的被展示，同时侧边导航可以固定，使得用户在操作和浏览中可以快速的定位和切换当前位置，有很高的操作效率。但这类导航横向页面内容的空间会被牺牲一部份。
</cn>

<us>
#### Sider
Two-columns layout. The sider menu can be collapsed when horizontal space is limited.
Generally, the mainnav is placed on the left side of the page, and the secondary menu is placed on the top of the working area. Contents will adapt the layout to the viewing area to improve the horizontal space usage, while the layout of the whole page is not stable.
The level of the aside navigation is scalable. The first, second, and third level navigations could be present more fluently and relevantly, and aside navigation can be fixed, allowing the user to quickly switch and spot the current position, improving the user experience. However, this navigation occupies some horizontal space of the contents
</us>

```tpl
<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <a-layout-sider collapsible v-model="collapsed">
      <div class="logo" />
      <a-menu theme="dark" :defaultSelectedKeys="['1']" mode="inline">
        <a-menu-item key="1">
          <a-icon type="pie-chart" />
          <span>Option 1</span>
        </a-menu-item>
        <a-menu-item key="2">
          <a-icon type="desktop" />
          <span>Option 2</span>
        </a-menu-item>
        <a-sub-menu key="sub1">
          <span slot="title"><a-icon type="user" /><span>User</span></span>
          <a-menu-item key="3">Tom</a-menu-item>
          <a-menu-item key="4">Bill</a-menu-item>
          <a-menu-item key="5">Alex</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <span slot="title"><a-icon type="team" /><span>Team</span></span>
          <a-menu-item key="6">Team 1</a-menu-item>
          <a-menu-item key="8">Team 2</a-menu-item>
        </a-sub-menu>
        <a-menu-item key="9">
          <a-icon type="file" />
          <span>File</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0" />
      <a-layout-content style="margin: 0 16px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>User</a-breadcrumb-item>
          <a-breadcrumb-item>Bill</a-breadcrumb-item>
        </a-breadcrumb>
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
          Bill is a cat.
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
  export default {
    data() {
      return {
        collapsed: false,
      };
    },
  };
</script>

<style>
  #components-layout-demo-side .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }
</style>
```
