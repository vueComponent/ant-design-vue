<cn>
  #### 带下拉菜单的面包屑
  面包屑支持下拉菜单。
</cn>

<us>
  #### Bread crumbs with drop down menu
  Breadcrumbs support drop down menu.
</us>

```vue
<template>
  <a-breadcrumb>
    <a-breadcrumb-item>Ant Design Vue</a-breadcrumb-item>
    <a-breadcrumb-item><a href="">Component</a></a-breadcrumb-item>
    <a-breadcrumb-item>
      <a href="">General</a>
      <a-menu slot="overlay">
        <a-menu-item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
            General
          </a>
        </a-menu-item>
        <a-menu-item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
            Layout
          </a>
        </a-menu-item>
        <a-menu-item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
            Navigation
          </a>
        </a-menu-item>
      </a-menu>
    </a-breadcrumb-item>
    <a-breadcrumb-item>Button</a-breadcrumb-item>
  </a-breadcrumb>
</template>
```
