# 更新日志

`ant-design-vue` 严格遵循 [Semantic Versioning 2.0.0](http://semver.org/lang/zh-CN/) 语义化版本规范。

#### 发布周期

- 修订版本号：每周末会进行日常 bugfix 更新。（如果有紧急的 bugfix，则任何时候都可发布）
- 次版本号：每月发布一个带有新特性的向下兼容的版本。
- 主版本号：含有破坏性更新和新特性，不在发布周期内。

---

## 4.0

### 🔥🔥🔥 4.0 正式版发布 🔥🔥🔥

### 设计规范调整

- 基础圆角调整，由统一的 `2px` 改为四级圆角，分别为 `2px` `4px` `6px` `8px`，分别应用于不同场景，比如默认尺寸的 Button 的圆角调整为了 `6px`。
- 主色调整，由 `#1890ff` 改为 `#1677ff`。
- 整体阴影调整，由原本的三级阴影调整为两级，分别用于常驻页面的组件（如 Card）和交互反馈（如 Dropdown）。
- 部分组件内间距调整。
- 整体去线框化。

### 新增 5 个组件

- Segmented 分段控制器
- WaterMark 水印
- QrCode 二维码
- FloatButton 悬浮按钮
- Tour 漫游式引导

### 技术调整

- 弃用 less，采用 CSS-in-JS，更好地支持动态主题。
  - 所有 less 文件全部移除，less 变量不再支持透出。
  - 产物中不再包含 css 文件。由于 CSS-in-JS 支持按需引入，原本的 `ant-design-vue/dist/antd.css` 也已经移除，如果需要重置一些基本样式请引入 `ant-design-vue/dist/reset.css`。
  - 如果需要组件重置样式，又不想引入 `ant-design-vue/dist/reset.css` 从而导致污染全局样式的话，可以尝试在应用最外层使用[App 组件](/components/app-cn)，解决原生元素没有 ant-design-vue 规范样式的问题。
- 移除 css variables 以及在此之上构筑的动态主题方案。
- LocaleProvider 在 3.x 中已经废弃（使用 `<ConfigProvider locale />` 替代），我们在 4.x 里彻底移除了相关目录 `ant-design-vue/es/locale-provider`、`ant-design-vue/lib/locale-provider`。
- 不再支持 `babel-plugin-import`，CSS-in-JS 本身具有按需加载的能力，不再需要插件支持。

#### 组件 API 调整

- 组件弹框的 classname API 统一为 `popupClassName`，`dropdownClassName` 等类似 API 都会被替换。

  - AutoComplete 组件
  - Cascader 组件
  - Select 组件
  - TreeSelect 组件
  - TimePicker 组件
  - DatePicker 组件
  - Mentions 组件

- 组件弹框的受控可见 API 统一为 `open`，`visible` 等类似 API 都会被替换。
  - Drawer 组件 `visible` 变为 `open`。
  - Modal 组件 `visible` 变为 `open`。
  - Dropdown 组件 `visible` 变为 `open`。
  - Tooltip 组件 `visible` 变为 `open`。
  - Tag 组件 `visible` 已移除。
  - Slider 组件 `tooltip` 相关 API 收敛到 `tooltip` 属性中。
  - Table 组件 `filterDropdownVisible` 变为 `filterDropdownOpen`。
- `getPopupContainer`: 所有的 `getPopupContainer` 都需要保证返回的是唯一的 div。
- Drawer `style` 和 `class` 迁移至 Drawer 弹层区域上，原属性替换为 `rootClassName` 和 `rootStyle`。

#### 组件重构与移除

- 移除 `locale-provider` 目录。`LocaleProvider` 在 v4 中已移除，请使用 `ConfigProvider` 替代。

- 移除栅格布局中的`xxxl`断点属性。 `xxxl`属性已经在 v4 被移除，您可以使用 [主题定制](/docs/vue/customize-theme-cn) 修改 `screen[XS|SM|MD|LG|XL|XXL]` 来修改断点值实现。

- BackTop 组件在 `4.0.0` 中废弃，移至 FloatButton 悬浮按钮中。如需使用，可以从 FloatButton 中引入。

### [升级指南](/docs/vue/migration-v4-cn)

## 3.x

去 [GitHub](https://github.com/vueComponent/ant-design-vue/blob/3.x/CHANGELOG.zh-CN.md) 查看 `3.x` 的 Change Log。

## 2.x

去 [GitHub](https://github.com/vueComponent/ant-design-vue/blob/2.x/CHANGELOG.zh-CN.md) 查看 `2.x` 的 Change Log。

## 1.x

去 [GitHub](https://github.com/vueComponent/ant-design-vue/blob/1.x/CHANGELOG.zh-CN.md) 查看 `0.x` 到 `1.x` 的 Change Log。
