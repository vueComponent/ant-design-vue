<cn>
#### 基础列表
基本使用。
</cn>

<us>
#### Basic usage
Basic usage.
</us>

```vue
<template>
  <a-mentions v-model="value" @change="onChange" @select="onSelect">
    <a-mentions-option value="afc163">
      afc163
    </a-mentions-option>
    <a-mentions-option value="zombieJ">
      zombieJ
    </a-mentions-option>
    <a-mentions-option value="yesmeck">
      yesmeck
    </a-mentions-option>
  </a-mentions>
</template>
<script>
export default {
  data() {
    return {
      value: '@afc163',
    };
  },
  methods: {
    onSelect(option) {
      console.log('select', option);
    },
    onChange(value) {
      console.log('Change:', value);
    },
  },
};
</script>
```
