<cn>
#### 菜单隐藏方式
默认是点击关闭菜单，可以关闭此功能。
</cn>

<us>
#### The way of hiding menu.
The default is to close the menu when you click on menu items, this feature can be turned off.
</us>

```tpl
<template>
  <a-dropdown v-model="visible">
    <a class="ant-dropdown-link" href="#"> Hover me <a-icon type="down" /> </a>
    <a-menu slot="overlay" @click="handleMenuClick">
      <a-menu-item key="1">Clicking me will not close the menu.</a-menu-item>
      <a-menu-item key="2">Clicking me will not close the menu also.</a-menu-item>
      <a-menu-item key="3">Clicking me will close the menu</a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
  export default {
    data() {
      return {
        visible: false,
      };
    },
    methods: {
      handleMenuClick(e) {
        if (e.key === '3') {
          this.visible = false;
        }
      },
    },
  };
</script>
```
