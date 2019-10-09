<cn>
#### 卡片模式
用于嵌套在空间有限的容器中。
</cn>

<us>
#### Card
Nested inside a container element for rendering in limited space.
</us>

```tpl
<template>
  <div :style="{ width: '300px', border: '1px solid #d9d9d9', borderRadius: '4px' }">
    <a-calendar :fullscreen="false" @panelChange="onPanelChange" />
  </div>
</template>
<script>
  export default {
    methods: {
      onPanelChange(value, mode) {
        console.log(value, mode);
      },
    },
  };
</script>
```
