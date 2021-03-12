<cn>
#### 基本用法
相邻组件水平间距。
</cn>

<us>
#### Basic Usage
Crowded components horizontal spacing.
</us>

```vue
<template>
  <a-space>
    Space
    <a-button type="primary">Button</a-button>
    <a-upload>
      <a-button> <a-icon type="upload" /> Click to Upload </a-button>
    </a-upload>
    <a-popconfirm title="Are you sure delete this task?" ok-text="Yes" cancel-text="No">
      <a-button>Confirm</a-button>
    </a-popconfirm>
  </a-space>
</template>
<script>
export default {};
</script>
```
