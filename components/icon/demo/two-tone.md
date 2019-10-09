<cn>
#### 多色图标
可以通过设置 `theme` 属性为 `twoTone` 来渲染双色图标，并且可以设置主题色。
</cn>

<us>
#### Two-tone icon and colorful icon
Specific them property `theme` to `twoTone` to render two-tone icons. You can also set the primary color.
</us>

```tpl
<template>
  <div class="icons-list">
    <a-icon type="smile" theme="twoTone" />
    <a-icon type="heart" theme="twoTone" twoToneColor="#eb2f96" />
    <a-icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
  </div>
</template>
<style scoped>
  .icons-list >>> .anticon {
    margin-right: 6px;
    font-size: 24px;
  }
</style>
```
