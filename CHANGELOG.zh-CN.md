# 更新日志

`ant-design-vue` 严格遵循 [Semantic Versioning 2.0.0](http://semver.org/lang/zh-CN/) 语义化版本规范。

#### 发布周期

- 修订版本号：每周末会进行日常 bugfix 更新。（如果有紧急的 bugfix，则任何时候都可发布）
- 次版本号：每月发布一个带有新特性的向下兼容的版本。
- 主版本号：含有破坏性更新和新特性，不在发布周期内。

---

## 4.0.7

- 🌟 新增 Flex 组件 [#7052](https://github.com/vueComponent/ant-design-vue/issues/7052)
- 🌟 ConfigProvider 新增 wave 配置 [#7036](https://github.com/vueComponent/ant-design-vue/issues/7036)
- 🌟 Watermark 支持暗黑模式 [#7067](https://github.com/vueComponent/ant-design-vue/issues/7067)
- 🐞 修复 Space 重复 Key 问题 [#7048](https://github.com/vueComponent/ant-design-vue/issues/7048)
- 🐞 修复 Upload disabled 优先级错误问题 [#7047](https://github.com/vueComponent/ant-design-vue/issues/7047)
- 🐞 修复 Carousel 在 jsx 中渲染错误问题 [#7077](https://github.com/vueComponent/ant-design-vue/issues/7077)
- 🐞 修复 Message 偏移位置问题 [#7093](https://github.com/vueComponent/ant-design-vue/issues/7093)
- 🐞 修复 Collapse 自定义 prefix 时动画失效问题 [#7074](https://github.com/vueComponent/ant-design-vue/issues/7074)

## 4.0.6

- 🐞 修复 4.0.4 引入的 Dropdown onVisibleChange 失效问题 [#7031](https://github.com/vueComponent/ant-design-vue/issues/7031)

## 4.0.5

- 🐞 修复 cssinjs 性能问题 [#7023](https://github.com/vueComponent/ant-design-vue/issues/7023)

## 4.0.4

- 🌟 新增 esm 目标文件
- 🌟 FormItem 新增 tooltip 属性 [#7014](https://github.com/vueComponent/ant-design-vue/issues/7014)
- 🐞 修复 useMessage getContainer 不生效问题 [#6942](https://github.com/vueComponent/ant-design-vue/issues/6942)
- 🐞 修复 Image 多次触发 onPreviewVisibleChange 事件问题 [#6945](https://github.com/vueComponent/ant-design-vue/issues/6945)
- 🐞 修复 Checkbox 全局 disabled 不生效问题 [#6970](https://github.com/vueComponent/ant-design-vue/issues/6970)
- 🐞 修复 Drawer contentWrapperStyle 不生效问题 [#6983](https://github.com/vueComponent/ant-design-vue/issues/6983)
- 🐞 优化 Select Dropdown 等下拉列表滚动条显示隐藏逻辑 [#6987](https://github.com/vueComponent/ant-design-vue/issues/6987)
- 🐞 修复 Select Dropdown 等下拉列表中有 input 等组件时，隐藏问题 [#7020](https://github.com/vueComponent/ant-design-vue/issues/7020)

## 4.0.3

- 🐞 修复 shadow Dom 下样式丢失问题 [#6912](https://github.com/vueComponent/ant-design-vue/issues/6912)
- 🐞 升级 Icon 依赖，修复 shadow Dom 下 icon css 丢失问题 [#6914](https://github.com/vueComponent/ant-design-vue/issues/6914)

## 4.0.2

- 🐞 修复 useMessage 导致 body 被移除问题 [#6880](https://github.com/vueComponent/ant-design-vue/issues/6880)
- 🐞 修复 Button loading 切换后，水波纹效果不消失问题 [#6895](https://github.com/vueComponent/ant-design-vue/issues/6895)
- 🐞 修复 Image 关闭后 flip 没有重置问题 [#6913](https://github.com/vueComponent/ant-design-vue/issues/6913)
- 🐞 修复 ImageGroup 动画效果丢失问题 [#6898](https://github.com/vueComponent/ant-design-vue/issues/6898)
- 🐞 修复 Modal 缺少 onUpdate:open 属性声明 [#6876](https://github.com/vueComponent/ant-design-vue/issues/6876)
- 🐞 修复 Transfer 的 Checkbox 边缘处会触发多次 click 问题 [#6902](https://github.com/vueComponent/ant-design-vue/issues/6902)

## 4.0.1

- 🌟 FloatButton 添加 Badge 支持 [#6738](https://github.com/vueComponent/ant-design-vue/issues/6738)
- 🌟 Image 预览放大缩小灵敏度调整 [#6784](https://github.com/vueComponent/ant-design-vue/issues/6784)
- 🌟 Image 新增翻转特性 [#6785](https://github.com/vueComponent/ant-design-vue/issues/6785)
- 🌟 新增 App 组件，用于提供上下文 [#6735](https://github.com/vueComponent/ant-design-vue/issues/6735)
- 🌟 样式抽离特性用于 SSR [#6757](https://github.com/vueComponent/ant-design-vue/issues/6757)
- 🌟 支持 px2rem [#6817](https://github.com/vueComponent/ant-design-vue/issues/6817)
- 🌟 Tag 支持无边框模式 [#6819](https://github.com/vueComponent/ant-design-vue/issues/6819)
- 🌟 Avatar group 模式支持 shape [#6822](https://github.com/vueComponent/ant-design-vue/issues/6822)
- 🌟 AutoComplete 支持无边框和自定义 clearIcon [#6829](https://github.com/vueComponent/ant-design-vue/issues/6829)
- 🌟 InputPassword 支持受控 visible [#6863](https://github.com/vueComponent/ant-design-vue/issues/6863)
- 🐞 修复 InputGroup 在 large 时样式错位问题 [#6866](https://github.com/vueComponent/ant-design-vue/issues/6866)
- 🐞 修复 Checkable Tag 无法自定义 class 问题 [#6854](https://github.com/vueComponent/ant-design-vue/issues/6854)
- 🐞 修复 Tabs 动画模式下渲染问题 [#6855](https://github.com/vueComponent/ant-design-vue/issues/6855)
- 🐞 修复 Image height 属性不生效问题 [#6840](https://github.com/vueComponent/ant-design-vue/issues/6840)
- 🐞 修复 InputNumber 触发 mouseup 事件问题 [#6772](https://github.com/vueComponent/ant-design-vue/issues/6772)
- 🐞 修复 Tabs 折叠时 Dropdown 样式问题 [#6757](https://github.com/vueComponent/ant-design-vue/issues/6757)
- 🐞 修复 Table expandedRowRender 属性不生效 [#6783](https://github.com/vueComponent/ant-design-vue/issues/6783)
- 🐞 修复 dayjs 未打包进 dist 问题 [#6767](https://github.com/vueComponent/ant-design-vue/issues/6767)
- 🐞 解决 clipPath 浏览器兼容问题 [#6770](https://github.com/vueComponent/ant-design-vue/issues/6770)
- 🐞 修复 Carousel autoplay 响应式问题 [#6768](https://github.com/vueComponent/ant-design-vue/issues/6768)
- 🐞 修复 PageHeader ghost 样式问题 [#6761](https://github.com/vueComponent/ant-design-vue/issues/6761)
- 🐞 修复 Checkbox 没有触发 Form 校验问题 [#6741](https://github.com/vueComponent/ant-design-vue/issues/6741)
- 🐞 修复 Input prefix 属性未生效问题 [#6810](https://github.com/vueComponent/ant-design-vue/issues/6810)
- 🐞 修复 Badge 在 Avatar 中样式问题 [#6874](https://github.com/vueComponent/ant-design-vue/issues/6874)

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
