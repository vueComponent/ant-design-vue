<cn>
#### 清除
支持允许或者禁用清除。
</cn>

<us>
#### Clear star
Support set allow to clear star when click again.
</us>

```vue
<template>
  <div>
    <a-rate :default-value="3" />
    <span class="ant-rate-text">allowClear: true</span>
    <br />
    <a-rate :allow-clear="false" :default-value="3" />
    <span class="ant-rate-text">allowClear: false</span>
  </div>
</template>
```
