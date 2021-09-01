本文档将帮助你从 ant-design-vue `1.x` 版本升级到 ant-design-vue `2.x` 版本。

## 升级准备

1. 请先升级到 1.x 的最新版本，按照控制台 warning 信息移除/修改相关的 API。
2. 升级项目 Vue 3.0 以上。

## 2.0 有哪些不兼容的变化

### 设计规范调整

- 行高从 `1.5`(`21px`) 调整为 `1.5715`(`22px`)。
- 基础圆角调整，由`4px` 改为 `2px`。
- 分割线颜色明度降低，由 `#E8E8E8` 改为 `#F0F0F0`。
- Table 默认背景颜色从透明修改为白色。

### 兼容性调整

- 浏览器不再兼容 IE 11及以下版本。
- Vue 最低支持版本为 Vue 3.0。

#### 调整的 API

- 移除了 LocaleProvider，请使用 `ConfigProvider` 替代。
- 移除了 Tag 的 afterClose 属性。
- 合并了 FormModel、Form，详见下方的 Form 重构部分。
- `tabIndex`、`maxLength`、`readOnly`、`autoComplete`、`autoFocus` 更改为全小写。
- 为了在 template 语法中更友好的使用插槽，所有涉及到 xxxRender, renderXxxx 的均改成单参数，涉及到 `itemRender`、`renderItem`、`customRender`、`dropdownRender`、`dateCellRender`、`dateFullCellRender`、`monthCellRender`、`monthFullCellRender`、`renderTabBar`。
- 所有配置 scopedSlots 的地方统一改成 slots。
- `{ on, props, attrs, ... }` 配置进行扁平化处理，如 `{ props: {type: 'xxx'}, on: {click: this.handleClick}}` 改成 `{ type: 'xxx', onClick: this.handleClick }`, 涉及相关字段：`okButtonProps`、`cancelButtonProps`。
- xxx.sync 改成 v-model:xxx
- v-model 更改成 v-model:xxx，具体涉及组件：

  - v-model 改成 v-model:checked 的组件有: CheckableTag、Checkbox、Switch
  - v-model 改成 v-model:value 的组件有: Radio、Mentions、CheckboxGroup、Rate、DatePicker、Select
  - v-model 改成 v-model:visible 的组件有: Tag、Popconfirm、Popove、Tooltip、Moda、Dropdown
  - v-model 改成 v-model:activeKey 的组件有: Collaps、Tabs
  - v-model 改成 v-model:current 的组件有: Steps
  - v-model 改成 v-model:selectedKeys 的组件有: Menu

#### 图标升级

在 `ant-design-vue@1.2.0` 中，我们引入了 svg 图标（[为何使用 svg 图标？](https://github.com/ant-design/ant-design/issues/10353)）。使用了字符串命名的图标 API 无法做到按需加载，因而全量引入了 svg 图标文件，这大大增加了打包产物的尺寸。在 2.0 中，我们调整了图标的使用 API 从而支持 tree shaking，减少默认包体积约 150 KB(Gzipped)。

旧版 Icon 使用方式将被废弃：

```html
<a-icon type="smile" />
<a-button icon="smile" />
```

2.0 中会采用按需引入的方式：

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

#### 组件重构

在 1.x 中我们提供了 Form、FormModel 两个表单组件，原有的 Form 组件使用 v-decorator 进行数据绑定，在 Vue2 中我们通过上下文进行强制更新组件，但是在 Vue3 中，由于引入 patchFlag 等优化方式，强制刷新会破坏 patchFlag 带来的性能优势。所以在 2.0 版本中我们将 Form、FormModel 进行合并，保留了 FormModel 的使用方式，丰富了相关功能，并改名成 Form。

涉及改动：

- Form 新增 `scrollToFirstError`,`name`,`validateTrigger` 属性，新增 `finish`、`finishFailed` 事件，新增 `scrollToField` 方法。
- Form.Item 新增 `validateFirst`, `validateTrigger`, 废弃 `prop` 属性，使用 `name` 替换。
- 嵌套字段路径使用数组，过去版本我们通过 . 代表嵌套路径（诸如 user.name 来代表 { user: { name: '' } }）。然而在一些后台系统中，变量名中也会带上 .。这造成用户需要额外的代码进行转化，因而新版中，嵌套路径通过数组来表示以避免错误的处理行为（如 ['user', 'name']）。
- validateFields 不再支持 callback。validateFields 会返回 Promise 对象，因而你可以通过 async/await 或者 then/catch 来执行对应的错误处理。不再需要判断 errors 是否为空：

```js
// v1
validateFields((err, value) => {
  if (!err) {
    // Do something with value
  }
});
```

改成

```js
// v2
validateFields().then(values => {
  // Do something with value
});
```

## 遇到问题

v2 做了非常多的细节改进和重构，我们尽可能收集了已知的所有不兼容变化和相关影响，但是有可能还是有一些场景我们没有考虑到。如果你在升级过程中遇到了问题，请到 [GitHub issues](https://vuecomponent.github.io/issue-helper/) 进行反馈。我们会尽快响应和相应改进这篇文档。
