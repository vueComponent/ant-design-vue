<cn>
#### 自定义 icon
自定义 icon。
</cn>

<us>
#### Custom icon
Custom icon.
</us>

```vue
<template>
  <a-result title="Great, we have done all the operations!">
    <template #icon>
      <a-icon type="smile" theme="twoTone" />
    </template>
    <template #extra>
      <a-button type="primary">
        Next
      </a-button>
    </template>
  </a-result>
</template>
<script>
export default {
  data() {
    return {};
  },
};
</script>
```
