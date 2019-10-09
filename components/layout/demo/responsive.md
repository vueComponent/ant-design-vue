<cn>
#### 响应式布局
Layout.Sider 支持响应式布局。
> 说明：配置 `breakpoint` 属性即生效，视窗宽度小于 `breakpoint` 时 Sider 缩小为 `collapsedWidth` 宽度，若将 `collapsedWidth` 设置为零，会出现特殊 trigger。
</cn>

<us>
#### Responsive
Layout.Sider supports responsive layout.
> Note: You can get a responsive layout by setting `breakpoint`, the Sider will collapse to the width of `collapsedWidth` when window width is below the `breakpoint`. And a special trigger will appear if the `collapsedWidth` is set to `0`.
</us>

```tpl
<template>
  <a-layout id="components-layout-demo-responsive">
    <a-layout-sider
      breakpoint="lg"
      collapsedWidth="0"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint"
    >
      <div class="logo" />
      <a-menu theme="dark" mode="inline" :defaultSelectedKeys="['4']">
        <a-menu-item key="1">
          <a-icon type="user" />
          <span class="nav-text">nav 1</span>
        </a-menu-item>
        <a-menu-item key="2">
          <a-icon type="video-camera" />
          <span class="nav-text">nav 2</span>
        </a-menu-item>
        <a-menu-item key="3">
          <a-icon type="upload" />
          <span class="nav-text">nav 3</span>
        </a-menu-item>
        <a-menu-item key="4">
          <a-icon type="user" />
          <span class="nav-text">nav 4</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header :style="{ background: '#fff', padding: 0 }" />
      <a-layout-content :style="{ margin: '24px 16px 0' }">
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
          content
        </div>
      </a-layout-content>
      <a-layout-footer style="textAlign: center">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
  export default {
    methods: {
      onCollapse(collapsed, type) {
        console.log(collapsed, type);
      },
      onBreakpoint(broken) {
        console.log(broken);
      },
    },
  };
</script>

<style>
  #components-layout-demo-responsive .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }
</style>
```
