<cn>
#### 垂直
垂直方向的 Slider。
</cn>

<us>
#### Vertical
The vertical Slider.
</us>

```vue
<template>
  <div style="height: 300px">
    <div style="display: inline-block;height: 300px;marginLeft: 70px">
      <a-slider vertical :default-value="30" />
    </div>
    <div style="display: inline-block;height: 300px;marginLeft: 70px">
      <a-slider vertical range :step="10" :default-value="[20, 50]" />
    </div>
    <div style="display: inline-block;height: 300px;marginLeft: 70px">
      <a-slider vertical range :marks="marks" :default-value="[26, 37]" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      marks: {
        0: '0°C',
        26: '26°C',
        37: '37°C',
        100: {
          style: {
            color: '#f50',
          },
          label: <strong>100°C</strong>,
        },
      },
    };
  },
  methods: {
    handleDisabledChange(disabled) {
      this.disabled = disabled;
    },
  },
};
</script>
<style scoped>
.code-box-demo .ant-slider {
  margin-bottom: 16px;
}
</style>
```
