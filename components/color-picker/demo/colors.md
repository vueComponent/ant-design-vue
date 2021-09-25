<cn>
#### 颜色预设
可以通过`config.swatches`设置，来自定义预设颜色
<a target="_block" href="https://github.com/Simonwep/pickr">更多配置</a>
</cn>

<us>
#### Color Presets
Set `config.swatches ` to customize the default color presets.
<a target="_block" href="https://github.com/Simonwep/pickr">More config settings</a>
</us>

```vue
<template>
  <a-color-picker v-model="color" :config="config" />
</template>
<script>
export default {
  data() {
    return {
      color: '#1890ff',
      config: {
        swatches: [
          'rgba(244, 67, 54, 1)',
          'rgba(233, 30, 99, 0.95)',
          'rgba(156, 39, 176, 0.9)',
          'rgba(103, 58, 183, 0.85)',
          'rgba(63, 81, 181, 0.8)',
          'rgba(33, 150, 243, 0.75)',
          'rgba(3, 169, 244, 0.7)',
          'rgba(0, 188, 212, 0.7)',
          'rgba(0, 150, 136, 0.75)',
          'rgba(76, 175, 80, 0.8)',
          'rgba(139, 195, 74, 0.85)',
          'rgba(205, 220, 57, 0.9)',
          'rgba(255, 235, 59, 0.95)',
          'rgba(255, 193, 7, 1)',
        ],
      },
    };
  },
};
</script>
```
