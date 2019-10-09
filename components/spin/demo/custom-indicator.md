<cn>
#### 自定义指示符
使用自定义指示符。
</cn>

<us>
#### Custom spinning indicator
Use custom loading indicator.
</us>

```tpl
<template>
  <div>
    <a-spin>
      <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
    </a-spin>
    <a-spin :indicator="indicator" />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        indicator: <a-icon type="loading" style="font-size: 24px" spin />,
      };
    },
  };
</script>
```
