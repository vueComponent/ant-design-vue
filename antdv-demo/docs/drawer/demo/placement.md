<cn>
#### 自定义位置
自定义位置，点击触发按钮抽屉从相应的位置滑出，点击遮罩区关闭
</cn>

<us>
#### Custom Placement
The Drawer can appear from any edge of the screen.
</us>

```vue
<template>
  <div>
    <a-radio-group style="margin-right: 8px" :default-value="placement" @change="onChange">
      <a-radio value="top">
        top
      </a-radio>
      <a-radio value="right">
        right
      </a-radio>
      <a-radio value="bottom">
        bottom
      </a-radio>
      <a-radio value="left">
        left
      </a-radio>
    </a-radio-group>
    <a-button type="primary" @click="showDrawer">
      Open
    </a-button>
    <a-drawer
      title="Basic Drawer"
      :placement="placement"
      :closable="false"
      :visible="visible"
      @close="onClose"
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
      placement: 'left',
    };
  },
  methods: {
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    onChange(e) {
      this.placement = e.target.value;
    },
  },
};
</script>
```
