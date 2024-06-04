This document will help you upgrade from ant-design-vue `3.x` version to ant-design-vue `4.x` version. If you are using `2.x` or older version, please refer to the previous [upgrade document](/docs/vue/migration-v3) to 3.x.

## Upgrade preparation

1. Please upgrade to the latest version of 3.x first, and remove / modify related APIs according to the console warning message.

## Incompatible changes in v4

### Design specification

- Basic rounded corner adjustment, changed from `2px` to four layers of radius, which are `2px` `4px` `6px` and `8px`. For example, radius of default Button is modified from `2px` to `6px`.
- Primary color adjustment, changed from `#1890ff` to `#1677ff`.
- Global shadow optimization, adjusted from three layers of shadows to two layers, which are used in common components (Card .e.g) and popup components (Dropdown .e.g).
- Overall reduction in wireframe usage.

### Technology adjustment

- Remove less, adopt CSS-in-JS, for better support of dynamic themes.
  - All less files are removed, and less variables are no longer exported.
  - Css files are no longer included in package. Since CSS-in-JS supports importing on demand, the original `ant-design-vue/dist/antd.css` has also been abandoned. If you need to reset some basic styles, please import `ant-design-vue/dist/reset.css`.
  - If you need to reset the style of the component, but you don't want to introduce `ant-design-vue/dist/reset.css` to pollute the global style, You can try using the [App](/components/app) in the outermost layer to solve the problem that native elements do not have antd specification style.
- Remove css variables and dynamic theme built on top of them.
- LocaleProvider has been deprecated in 3.x (use `<ConfigProvider locale />` instead), we removed the related folder `ant-design-vue/es/locale-provider` and `ant-design-vue/lib/locale-provider` in 4.x.
- Replace built-in Moment.js with Dayjs. For more: [Use custom date library](/docs/vue/use-custom-date-library/).
- `babel-plugin-import` is no longer supported. CSS-in-JS itself has the ability to import on demand, and plugin support is no longer required.

### Compatibility

- DO NOT support IE browser anymore.

#### Component API adjustment

- The classname API of the component popup box is unified to `popupClassName`, and `dropdownClassName` and other similar APIs will be replaced.

  - AutoComplete
  - Cascader
  - Select
  - TreeSelect
  - TimePicker
  - DatePicker
  - Mentions

```diff
<template>
  <a-select
--  dropdownClassName="my-select-popup"
++  popupClassName="my-select-popup"
  />
</template>
```

- The controlled visible API of the component popup is unified to `open`, and `visible` and other similar APIs will be replaced.

  - Drawer `visible` changed to `open`.
  - Modal `visible` changed to `open`.
  - Dropdown `visible` changed to `open`.
  - Tooltip `visible` changed to `open`.
  - Tag `visible` is removed.
  - Slider `tooltip` related API converged to `tooltip` property.
  - Table `filterDropdownVisible` changed to `filterDropdownOpen`.

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

- `getPopupContainer`: All `getPopupContainer` are guaranteed to return a unique div.
- Drawer `style` & `class` are migrated to Drawer panel node, the original properties are replaced by `rootClassName` and `rootStyle`.

#### Component refactoring and removal

- Remove `locale-provider` Directory. `LocaleProvider` was removed in v4, please use `ConfigProvider` instead.
- Remove the `xxxl` breakpoint property from the grid layout. `xxxl` breakpoint has been removed in v4. You can customize breakpoint values using [theme customization](/docs/vue/customize-theme) with `screen[XS|SM|MD|LG|XL|XXL]` properties.
- BackTop is deprecated in `4.0.0`, and is merged into FloatButton.

## Start upgrading

Use git to save your code and install latest version:

```bash
npm install --save ant-design-vue@4
```

### less migration

If you using ant-design-vue less variables, you can use compatible package to covert it into v3 less variables and use less-loader to inject them:

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

Ant then remove ant-design-vue less reference in your less file:

```diff
// Your less file
--  @import (reference) '~ant-design-vue/es/style/themes/index';
or
--  @import '~ant-design-vue/es/style/some-other-less-file-ref';
```

### Remove babel-plugin-import

Remove `babel-plugin-import` from package.json and modify `.babelrc`:

```diff
"plugins": [
-- ["import", { "libraryName": "ant-design-vue", "libraryDirectory": "lib"}, "ant-design-vue"],
]
```

### Legacy browser support

Ant Design Vue v4 using `:where` css selector to reduce CSS-in-JS hash priority. You can use `StyleProvider` to cancel this function. Please ref [Compatible adjustment](/docs/vue/compatible-style).

## Encounter problems

If you encounter problems during the upgrade, please go to [GitHub issues](https://github.com/vueComponent/ant-design-vue/issues) for feedback. We will respond and improve this document as soon as possible.
