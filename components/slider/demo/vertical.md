<cn>
#### 垂直
垂直方向的 Slider。
</cn>

<us>
#### Vertical
The vertical Slider.
</us>

```tpl
<template>
  <div style="height: 300px">
    <div style="float:left;height: 300px;marginLeft: 70px">
      <a-slider vertical :defaultValue="30" />
    </div>
    <div style="float:left;height: 300px;marginLeft: 70px">
      <a-slider vertical range :step="10" :defaultValue="[20, 50]" />
    </div>
    <div style="float:left;height: 300px;marginLeft: 70px">
      <a-slider vertical range :marks="marks" :defaultValue="[26, 37]" />
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
