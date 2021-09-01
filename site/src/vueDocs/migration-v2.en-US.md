This document will help you upgrade from ant-design-vue `1.x` version to ant-design-vue `2.x` version.

## Upgrade preparation

1. Please upgrade to the latest version of 1.x first, and remove/modify related APIs according to the console warning message.
2. Upgrade the project to Vue 3.0 and above.

## 2.0 What are the incompatible changes

### Design specification adjustment

- Adjust the row height from `1.5`(`21px`) to `1.5715`(`22px`).
- Basic round corner adjustment, changed from `4px` to `2px`.
- The color brightness of the dividing line is reduced, from `#E8E8E8` to `#F0F0F0`.
- The default background color of Table is changed from transparent to white.

### Compatibility adjustment

- The minimum supported version of Vue is Vue 3.0.

#### Adjusted API

- Removed LocaleProvider, please use `ConfigProvider` instead.
- Removed the afterClose property of Tag.
- Merged FormModel and Form, see the Form refactoring part below for details.
- `tabIndex`, `maxLength`, `readOnly`, `autoComplete`, `autoFocus` are changed to all lowercase.
- In order to use the slot more friendly in template syntax, all related to xxxRender, renderXxxx are changed to single parameter, involving `itemRender`, `renderItem`, `customRender`, `dropdownRender`, `dateCellRender`, `dateFullCellRender`, `monthCellRender`, `monthFullCellRender`, `renderTabBar`.
- All the places where scopedSlots are configured are changed to slots.
- `{ on, props, attrs, ... }` configuration is flattened, such as `{ props: {type:'xxx'}, on: {click: this.handleClick}}` changed to `{ type: 'xxx', onClick: this.handleClick }`, related fields: `okButtonProps`, `cancelButtonProps`.
- Change xxx.sync to v-model:xxx
- v-model is changed to v-model:xxx, which specifically involves components:

  - The components changed from v-model to v-model:checked are: CheckableTag, Checkbox, Switch
  - The components changed from v-model to v-model:value are: Radio, Mentions, CheckboxGroup, Rate, DatePicker、Select
  - The components changed from v-model to v-model:visible are: Tag, Popconfirm, Popove, Tooltip, Moda, Dropdown
  - The components changed from v-model to v-model:activeKey are: Collaps, Tabs
  - The components changed from v-model to v-model:current are: Steps
  - The components changed from v-model to v-model:selectedKeys are: Menu

#### Icon Upgrade

In `ant-design-vue@1.2.0`, we introduced the svg icon ([Why use the svg icon?](https://github.com/ant-design/ant-design/issues/10353)). The icon API that uses string naming cannot be loaded on demand, so the svg icon file is fully introduced, which greatly increases the size of the packaged product. In 2.0, we adjusted the icon usage API to support tree shaking, reducing the default package size by approximately 150 KB (Gzipped).

The old way of using Icon will be obsolete:

```html
<a-icon type="smile" /> <a-button icon="smile" />
```

In 2.0, an on-demand introduction method will be adopted:

```html
<template>
  <smile-outlined />
  <a-button>
    <template #icon><smile-outlined /></template>
  </a-button>
</template>
<script>
  import SmileOutlined from '@ant-design/icons-vue/SmileOutlined';
  export default {
    components: {
      SmileOutlined,
    },
  };
</script>
```

#### Component refactoring

In 1.x, we provide two form components, Form and FormModel. The original Form component uses v-decorator for data binding. In Vue2, we use context to force update components. However, in Vue3, due to the introduction of patchFlag, etc. Optimization method, forced refresh will destroy the performance advantage brought by patchFlag. So in version 2.0, we merged Form and FormModel, retained the use of FormModel, enriched related functions, and renamed it to Form.

Involving changes:

- Added `scrollToFirstError`, `name`, `validateTrigger` properties for Form, added `finish`, `finishFailed` events, and added `scrollToField` method.
- Form.Item adds `validateFirst`, `validateTrigger`, and discards the `prop` attribute, and replaces it with `name`.
- The nested field path uses an array. In the past version, we used. To represent the nested path (such as user.name to represent {user: {name:''} }). However, in some back-end systems, the variable name will also carry .. This causes users to need additional codes for conversion. Therefore, in the new version, nested paths are represented by arrays to avoid wrong handling behaviors (such as ['user','name']).
- validateFields no longer supports callback. validateFields will return a Promise object, so you can perform corresponding error handling through async/await or then/catch. It is no longer necessary to determine whether errors is empty:

```js
// v1
validateFields((err, value) => {
  if (!err) {
    // Do something with value
  }
});
```

Change to

```js
// v2
validateFields().then(values ​​=> {
  // Do something with value
});
```

## Encounter problems

V2 has made a lot of detailed improvements and refactorings. We have collected all known incompatible changes and related effects as much as possible, but there may still be some scenarios that we have not considered. If you encounter problems during the upgrade process, please go to [GitHub issues](https://vuecomponent.github.io/issue-helper/) for feedback. We will respond as soon as possible and improve this document accordingly.
