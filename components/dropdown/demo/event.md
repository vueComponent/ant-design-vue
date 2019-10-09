<cn>
#### 触发事件
点击菜单项后会触发事件，用户可以通过相应的菜单项 key 进行不同的操作。
</cn>

<us>
#### Click event
An event will be triggered when you click menu items, in which you can make different operations according to item's key.
</us>

```tpl
<template>
  <a-dropdown>
    <a class="ant-dropdown-link" href="#"> Hover me, Click menu item <a-icon type="down" /> </a>
    <a-menu slot="overlay" @click="onClick">
      <a-menu-item key="1">1st menu item</a-menu-item>
      <a-menu-item key="2">2nd menu item</a-menu-item>
      <a-menu-item key="3">3rd menu item</a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
  export default {
    methods: {
      onClick({ key }) {
        console.log(`Click on item ${key}`);
      },
    },
  };
</script>
```
