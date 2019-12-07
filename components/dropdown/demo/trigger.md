<cn>
#### 触发方式
默认是移入触发菜单，可以点击触发。
</cn>

<us>
#### Trigger mode
The default trigger mode is `hover`, you can change it to `click`.
</us>

```tpl
<template>
  <a-dropdown :trigger="['click']">
    <a class="ant-dropdown-link" href="#"> Click me <a-icon type="down" /> </a>
    <a-menu slot="overlay">
      <a-menu-item key="0">
        <a href="http://www.alipay.com/">1st menu item</a>
      </a-menu-item>
      <a-menu-item key="1">
        <a href="http://www.taobao.com/">2nd menu item</a>
      </a-menu-item>
      <a-menu-divider />
      <a-menu-item key="3">3rd menu item</a-menu-item>
    </a-menu>
  </a-dropdown>
</template>
```
