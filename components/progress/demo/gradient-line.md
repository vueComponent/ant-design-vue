<cn>
#### 自定义进度条渐变色
`linear-gradient` 的封装。推荐只传两种颜色。
</cn>

<us>
#### Custom line gradient
A package of `linear-gradient`. It is recommended to only pass two colors.
</us>

```tpl
<template>
  <div>
    <a-progress
      :strokeColor="{
        '0%': '#108ee9',
        '100%': '#87d068',
      }"
      :percent="99.9"
    />
    <a-progress
      :strokeColor="{
        from: '#108ee9',
        to: '#87d068',
      }"
      :percent="99.9"
      status="active"
    />
    <a-progress
      type="circle"
      :strokeColor="{
        '0%': '#108ee9',
        '100%': '#87d068',
      }"
      :percent="90"
    />
    <a-progress
      type="circle"
      :strokeColor="{
        '0%': '#108ee9',
        '100%': '#87d068',
      }"
      :percent="100"
    />
  </div>
</template>
```
