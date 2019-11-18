<cn>
#### 右键菜单
默认是移入触发菜单，可以点击鼠标右键触发。
</cn>

<us>
#### Context Menu
The default trigger mode is `hover`, you can change it to `contextMenu`.
</us>

```tpl
<template>
  <a-dropdown :trigger="['contextmenu']">
    <span style="user-select: none">Right Click on Me</span>
    <a-menu slot="overlay">
      <a-menu-item key="1">1st menu item</a-menu-item>
      <a-menu-item key="2">2nd menu item</a-menu-item>
      <a-menu-item key="3">3rd menu item</a-menu-item>
    </a-menu>
  </a-dropdown>
</template>
```
