<cn>
#### 清除
支持允许或者禁用清除。
</cn>

<us>
#### Clear star
Support set allow to clear star when click again.
</us>

```tpl
<template>
  <div>
    <a-rate :defaultValue="3" />
    <span class="ant-rate-text">allowClear: true</span>
    <br />
    <a-rate :allowClear="false" :defaultValue="3" />
    <span class="ant-rate-text">allowClear: false</span>
  </div>
</template>
```
