<cn>
#### 固定侧边栏
当内容较长时，使用固定侧边栏可以提供更好的体验。
</cn>

<us>
#### Fixed Sider
When dealing with long content, a fixed sider can provide a better user experience.
</us>

```tpl
<template>
  <a-layout id="components-layout-demo-fixed-sider">
    <a-layout-sider :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
      <div class="logo"></div>
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
          <a-icon type="bar-chart" />
          <span class="nav-text">nav 4</span>
        </a-menu-item>
        <a-menu-item key="5">
          <a-icon type="cloud-o" />
          <span class="nav-text">nav 5</span>
        </a-menu-item>
        <a-menu-item key="6">
          <a-icon type="appstore-o" />
          <span class="nav-text">nav 6</span>
        </a-menu-item>
        <a-menu-item key="7">
          <a-icon type="team" />
          <span class="nav-text">nav 7</span>
        </a-menu-item>
        <a-menu-item key="8">
          <a-icon type="shop" />
          <span class="nav-text">nav 8</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout :style="{ marginLeft: '200px' }">
      <a-layout-header :style="{ background: '#fff', padding: 0 }" />
      <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'initial' }">
        <div :style="{ padding: '24px', background: '#fff', textAlign: 'center' }">
          ...
          <br />
          Really
          <br />...<br />...<br />...<br />
          long
          <br />...<br />...<br />...<br />...<br />...<br />...
          <br />...<br />...<br />...<br />...<br />...<br />...
          <br />...<br />...<br />...<br />...<br />...<br />...
          <br />...<br />...<br />...<br />...<br />...<br />...
          <br />...<br />...<br />...<br />...<br />...<br />...
          <br />...<br />...<br />...<br />...<br />...<br />...
          <br />...<br />...<br />...<br />...<br />...<br />
          content
        </div>
      </a-layout-content>
      <a-layout-footer :style="{ textAlign: 'center' }">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<style>
  #components-layout-demo-fixed-sider .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }
</style>
```
