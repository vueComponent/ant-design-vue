---
order: 6.5
title: 样式兼容
---

Ant Design Vue 支持最近 2 个版本的现代浏览器。如果你需要兼容旧版浏览器，请根据实际需求进行降级处理：

### `:where` 选择器

Ant Design Vue 的 CSS-in-JS 默认通过 `:where` 选择器降低 CSS Selector 优先级，以减少用户升级时额外调整自定义样式成本。在某些场景下你如果需要支持的旧版浏览器（或者如 TailwindCSS 优先级冲突），你可以使用 `StyleProvider` 取消默认的降权操作 ：

```html
// `hashPriority` 默认为 `low`，配置为 `high` 后， // 会移除 `:where` 选择器封装
<template>
  <a-style-provider hash-priority="high">
    <MyApp />
  </a-style-provider>
</template>
```

切换后，样式将从 `:where` 切换为类选择器：

```diff
--  :where(.css-bAMboO).ant-btn {
++  .css-bAMboO.ant-btn {
      color: #fff;
    }
```

注意：

1、关闭 `:where` 降权后，你可能需要手动调整一些样式的优先级。

2、hashPriority 不支持动态修改，修改后请刷新浏览器

### CSS 逻辑属性

为了统一 LTR 和 RTL 样式，Ant Design Vue 使用了 CSS 逻辑属性。例如原 `margin-left` 使用 `margin-inline-start` 代替，使其在 LTR 和 RTL 下都为起始位置间距。如果你需要兼容旧版浏览器（如 360 浏览器、QQ 浏览器 等等），可以通过 `ant-design-vue` 的 `StyleProvider` 配置 `transformers` 将其转换：

```html
// `transformers` 提供预处理功能将样式进行转换
<template>
  <a-style-provider :transformers="[legacyLogicalPropertiesTransformer]">
    <MyApp />
  </a-style-provider>
</template>

<script lang="ts" setup>
  import { legacyLogicalPropertiesTransformer } from 'ant-design-vue';
</script>
```

切换后，样式将降级 CSS 逻辑属性：

```diff
.ant-modal-root {
-- inset: 0;
++ top: 0;
++ right: 0;
++ bottom: 0;
++ left: 0;
}
```
