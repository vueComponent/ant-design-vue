<cn>
#### 多级菜单
传入的菜单里有多个层级。
</cn>

<us>
#### Cascading menu
The menu has multiple levels.
</us>

```tpl
<template>
  <a-dropdown>
    <a class="ant-dropdown-link" href="#"> Cascading menu <a-icon type="down" /> </a>
    <a-menu slot="overlay">
      <a-menu-item>1st menu item</a-menu-item>
      <a-menu-item>2nd menu item</a-menu-item>
      <a-sub-menu title="sub menu" key="test">
        <a-menu-item>3rd menu item</a-menu-item>
        <a-menu-item>4th menu item</a-menu-item>
      </a-sub-menu>
      <a-sub-menu title="disabled sub menu" disabled>
        <a-menu-item>5d menu item</a-menu-item>
        <a-menu-item>6th menu item</a-menu-item>
      </a-sub-menu>
    </a-menu>
  </a-dropdown>
</template>
```
