<cn>
#### 基本
最简单的下拉菜单。
</cn>

<us>
#### Basic
The most basic dropdown menu.
</us>

```tpl
<template>
  <a-dropdown>
    <a class="ant-dropdown-link" href="#"> Hover me <a-icon type="down" /> </a>
    <a-menu slot="overlay">
      <a-menu-item>
        <a href="javascript:;">1st menu item</a>
      </a-menu-item>
      <a-menu-item>
        <a href="javascript:;">2nd menu item</a>
      </a-menu-item>
      <a-menu-item>
        <a href="javascript:;">3rd menu item</a>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>
```
