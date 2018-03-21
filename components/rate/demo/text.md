<cn>
#### 文案展现
给评分组件加上文案展示。
</cn>

<us>
#### Show copywriting
Add copywriting in rate components.
</us>

```html
<template>
  <span>
    <a-rate v-model='value'/>
    <span class="ant-rate-text">{{value}} stars</span>
  </span>
</template>
<script>
export default {
  data() {
    return {
      value: 3,
    }
  },
}
</script>
```
