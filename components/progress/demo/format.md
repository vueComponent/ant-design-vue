<cn>
#### 自定义文字格式
`format` 属性指定格式。
</cn>

<us>
#### Custom text format
You can set a custom text by setting the `format` prop.
</us>

```tpl
<template>
  <div>
    <a-progress type="circle" :percent="75" :format="percent => `${percent} Days`" />
    <a-progress type="circle" :percent="100" :format="() => 'Done'" />
    <a-progress type="circle" :percent="75">
      <template v-slot:format="percent">
        <span style="color: red">{{percent}}</span>
      </template>
    </a-progress>
  </div>
</template>
<style scoped>
  div.ant-progress-circle,
  div.ant-progress-line {
    margin-right: 8px;
    margin-bottom: 8px;
  }
</style>
```
