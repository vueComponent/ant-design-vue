<cn>
#### 从浮层内关闭
使用 `visible` 属性控制浮层显示。
</cn>

<us>
#### Controlling the close of the dialog
Use `visible` prop to control the display of the card.
</us>

```tpl
<template>
  <a-popover title="Title" trigger="click" v-model="visible">
    <a @click="hide" slot="content">Close</a>
    <a-button type="primary">Click me</a-button>
  </a-popover>
</template>

<script>
  export default {
    data() {
      return {
        visible: false,
      };
    },
    methods: {
      hide() {
        console.log(111);
        this.visible = false;
      },
    },
  };
</script>
```
