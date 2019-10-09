<cn>
#### 带下拉框的按钮
左边是按钮，右边是额外的相关功能菜单。
</cn>

<us>
#### Button with dropdown menu
A button is on the left, and a related functional menu is on the right.
</us>

```tpl
<template>
  <div>
    <a-dropdown-button @click="handleButtonClick">
      Dropdown
      <a-menu slot="overlay" @click="handleMenuClick">
        <a-menu-item key="1"><a-icon type="user" />1st menu item</a-menu-item>
        <a-menu-item key="2"><a-icon type="user" />2nd menu item</a-menu-item>
        <a-menu-item key="3"><a-icon type="user" />3rd item</a-menu-item>
      </a-menu>
    </a-dropdown-button>
    <a-dropdown-button @click="handleButtonClick" disabled style="margin-left: 8px">
      Dropdown
      <a-menu slot="overlay" @click="handleMenuClick">
        <a-menu-item key="1"><a-icon type="user" />1st menu item</a-menu-item>
        <a-menu-item key="2"><a-icon type="user" />2nd menu item</a-menu-item>
        <a-menu-item key="3"><a-icon type="user" />3rd item</a-menu-item>
      </a-menu>
    </a-dropdown-button>
    <a-dropdown>
      <a-menu slot="overlay" @click="handleMenuClick">
        <a-menu-item key="1"><a-icon type="user" />1st menu item</a-menu-item>
        <a-menu-item key="2"><a-icon type="user" />2nd menu item</a-menu-item>
        <a-menu-item key="3"><a-icon type="user" />3rd item</a-menu-item>
      </a-menu>
      <a-button style="margin-left: 8px"> Button <a-icon type="down" /> </a-button>
    </a-dropdown>
  </div>
</template>

<script>
  export default {
    methods: {
      handleButtonClick(e) {
        console.log('click left button', e);
      },
      handleMenuClick(e) {
        console.log('click', e);
      },
    },
  };
</script>
```
