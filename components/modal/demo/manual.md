
<cn>
#### 手动移除
手动关闭modal。
</cn>

<us>
#### Manual to destroy
Manually destroying a modal.
</us>

```html
<template>
  <a-button @click="success">Success</a-button>
</template>
<script>
export default {
  methods: {
    success() {
      const modal = this.$success({
        title: 'This is a notification message',
        content: 'This modal will be destroyed after 1 second',
      });
      setTimeout(() => modal.destroy(), 1000);
    }
  }
}
</script>
```

