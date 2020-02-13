<cn>
#### 基础抽屉
基础抽屉，点击触发按钮抽屉从右滑出，点击遮罩区关闭
</cn>

<us>
#### Basic
Basic drawer.
</us>

```tpl
<template>
  <div>
    <a-button type="primary" @click="showDrawer">
      Open
    </a-button>
    <a-drawer
      title="Basic Drawer"
      placement="right"
      :closable="false"
      @close="onClose"
      :visible="visible"
      :maskClosable="false"
      :afterVisibleChange="afterVisibleChange"
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-drawer>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        visible: false,
      };
    },
    methods: {
      afterVisibleChange(val) {
        console.log('visible', val)
      },
      showDrawer() {
        this.visible = true;
      },
      onClose() {
        this.visible = false;
      },
    },
  };
</script>
```
