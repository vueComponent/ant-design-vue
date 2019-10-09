<cn>
#### 讨嫌的小红点
没有具体的数字。
</cn>

<us>
#### Red badge
This will simply display a red badge, without a specific count.
If count equals 0, it won't display the dot.
</us>

```tpl
<template>
  <div id="components-badge-demo-dot">
    <a-badge dot>
      <a-icon type="notification" />
    </a-badge>
    <a-badge :count="0" dot>
      <a-icon type="notification" />
    </a-badge>
    <a-badge dot>
      <a href="#">Link something</a>
    </a-badge>
  </div>
</template>
<style scoped>
  #components-badge-demo-dot .anticon-notification {
    width: 16px;
    height: 16px;
    line-height: 16px;
    font-size: 16px;
  }
</style>
```
