<cn>
#### 可关闭的警告提示
显示关闭按钮，点击可关闭警告提示。
</cn>

<us>
#### Closable
To show close button.
</us>

```tpl
<template>
  <div>
    <a-alert
      message="Warning Text Warning Text Warning TextW arning Text Warning Text Warning TextWarning Text"
      type="warning"
      closable
      @close="onClose"
    />
    <a-alert
      message="Error Text"
      description="Error Description Error Description Error Description Error Description Error Description Error Description"
      type="error"
      closable
      @close="onClose"
    />
  </div>
</template>
<script>
  export default {
    methods: {
      onClose(e) {
        console.log(e, 'I was closed.');
      },
    },
  };
</script>
```
