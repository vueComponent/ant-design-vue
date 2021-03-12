<cn>
#### 反向
设置 `reverse` 可以将滑动条置反。
</cn>

<us>
#### Reverse
Using `reverse` to render slider reversely.
</us>

```vue
<template>
  <div>
    <a-slider :default-value="30" :reverse="reverse" />
    <a-slider range :default-value="[20, 50]" :reverse="reverse" />
    Reversed: <a-switch size="small" :checked="reverse" @change="handleReverseChange" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      reverse: true,
    };
  },
  methods: {
    handleReverseChange(reverse) {
      this.reverse = reverse;
    },
  },
};
</script>
```
