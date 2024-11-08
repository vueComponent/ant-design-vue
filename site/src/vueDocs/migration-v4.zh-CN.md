本文档将帮助你从 ant-design-vue `3.x` 版本升级到 ant-design-vue `4.x` 版本，如果你是 `2.x` 或者更老的版本，请先参考之前的[升级文档](/docs/vue/migration-v3-cn)升级到 3.x。

## 升级准备

1. 请先升级到 3.x 的最新版本，按照控制台 warning 信息移除/修改相关的 API。

## 4.0 有哪些不兼容的变化

### 设计规范调整

- 基础圆角调整，由统一的 `2px` 改为四级圆角，分别为 `2px` `4px` `6px` `8px`，分别应用于不同场景，比如默认尺寸的 Button 的圆角调整为了 `6px`。
- 主色调整，由 `#1890ff` 改为 `#1677ff`。
- 整体阴影调整，由原本的三级阴影调整为两级，分别用于常驻页面的组件（如 Card）和交互反馈（如 Dropdown）。
- 部分组件内间距调整。
- 整体去线框化。

### 技术调整

- 弃用 less，采用 CSS-in-JS，更好地支持动态主题。
  - 所有 less 文件全部移除，less 变量不再支持透出。
  - 产物中不再包含 css 文件。由于 CSS-in-JS 支持按需引入，原本的 `ant-design-vue/dist/antd.css` 也已经移除，如果需要重置一些基本样式请引入 `ant-design-vue/dist/reset.css`。
  - 如果需要组件重置样式，又不想引入 `ant-design-vue/dist/reset.css` 从而导致污染全局样式的话，可以尝试在应用最外层使用[App 组件](/components/app-cn)，解决原生元素没有 ant-design-vue 规范样式的问题。
- 移除 css variables 以及在此之上构筑的动态主题方案。
- LocaleProvider 在 3.x 中已经废弃（使用 `<ConfigProvider locale />` 替代），我们在 4.x 里彻底移除了相关目录 `ant-design-vue/es/locale-provider`、`ant-design-vue/lib/locale-provider`。
- 不再支持 `babel-plugin-import`，CSS-in-JS 本身具有按需加载的能力，不再需要插件支持。

### 兼容性调整

- 不再支持 IE 浏览器。

#### 组件 API 调整

- 组件弹框的 classname API 统一为 `popupClassName`，`dropdownClassName` 等类似 API 都会被替换。

  - AutoComplete 组件
  - Cascader 组件
  - Select 组件
  - TreeSelect 组件
  - TimePicker 组件
  - DatePicker 组件
  - Mentions 组件

```diff
<template>
  <a-select
--  dropdownClassName="my-select-popup"
++  popupClassName="my-select-popup"
  />
</template>
```

- 组件弹框的受控可见 API 统一为 `open`，`visible` 等类似 API 都会被替换。

  - Drawer 组件 `visible` 变为 `open`。
  - Modal 组件 `visible` 变为 `open`。
  - Dropdown 组件 `visible` 变为 `open`。
  - Tooltip 组件 `visible` 变为 `open`。
  - Tag 组件 `visible` 已移除。
  - Slider 组件 `tooltip` 相关 API 收敛到 `tooltip` 属性中。
  - Table 组件 `filterDropdownVisible` 变为 `filterDropdownOpen`。

```diff
<template>
-- <a-modal :visible="visible">content</a-modal>
++ <a-modal :open="visible">content</a-modal>

-- <a-tag :visible="visible">tag</a-tag>
++ <a-tag v-if="visible">tag</a-tag>

  <a-table
    :data="[]"
    :columns="[
      {
        title: 'Name',
        dataIndex: 'name',
--      filterDropdownVisible: visible,
++      filterDropdownOpen: visible,
      },
    ]"
  />

-- <a-slider :tooltipVisible="visible" />
++ <a-slider :tooltip="{ open: visible }" />
</template>

<script setup>
import { ref } from 'vue';

const visible = ref(true);
</script>
```

- `getPopupContainer`: 所有的 `getPopupContainer` 都需要保证返回的是唯一的 div。
- Drawer `style` 和 `class` 迁移至 Drawer 弹层区域上，原属性替换为 `rootClassName` 和 `rootStyle`。

#### 组件重构与移除

- 移除 `locale-provider` 目录。`LocaleProvider` 在 v4 中已移除，请使用 `ConfigProvider` 替代。

- 移除栅格布局中的`xxxl`断点属性。 `xxxl`属性已经在 v4 被移除，您可以使用 [主题定制](/docs/vue/customize-theme-cn) 修改 `screen[XS|SM|MD|LG|XL|XXL]` 来修改断点值实现。

- BackTop 组件在 `4.0.0` 中废弃，移至 FloatButton 悬浮按钮中。如需使用，可以从 FloatButton 中引入。

## 开始升级

通过 git 保存你的代码，然后按照上述文档进行依赖安装：

```bash
npm install --save ant-design-vue@4.x
```

### less 迁移

如果你使用到了 ant-design-vue 的 less 变量，通过兼容包将 v4 变量转译成 v3 版本，并通过 less-loader 注入：

```js
const { theme } = require('ant-design-vue/lib');
const convertLegacyToken = require('ant-design-vue/lib/theme/convertLegacyToken');

const { defaultAlgorithm, defaultSeed } = theme;

const mapToken = defaultAlgorithm(defaultSeed);
const v3Token = convertLegacyToken(mapToken);

// Webpack Config
module.exports = {
  // ... other config
  loader: 'less-loader',
  options: {
    lessOptions: {
      modifyVars: v3Token,
    },
  },
};
```

同时移除对 ant-design-vue less 文件的直接引用：

```diff
// Your less file
--  @import (reference) '~ant-design-vue/es/style/themes/index';
or
--  @import '~ant-design-vue/es/style/some-other-less-file-ref';
```

### 移除 babel-plugin-import

从 package.json 中移除 `babel-plugin-import`，并从 `.babelrc` 移除该插件：

```diff
"plugins": [
-- ["import", { "libraryName": "ant-design-vue", "libraryDirectory": "lib"}, "ant-design-vue"],
]
```

### 旧版浏览器兼容

Ant Design Vue v4 使用 `:where` css selector 降低 CSS-in-JS hash 值优先级，如果你需要支持旧版本浏览器（如 IE 11、360 浏览器 等等）。可以通过 `StyleProvider` 去除降权操作。详情请参阅 [兼容性调整](/docs/vue/compatible-style-cn)。

## 遇到问题

如果您在升级过程中遇到了问题，请到 [GitHub issues](https://github.com/vueComponent/ant-design-vue/issues) 进行反馈。我们会尽快响应和相应改进这篇文档。
