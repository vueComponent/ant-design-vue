# 更新日志

`ant-design-vue` 严格遵循 [Semantic Versioning 2.0.0](http://semver.org/lang/zh-CN/) 语义化版本规范。

#### 发布周期

- 修订版本号：每周末会进行日常 bugfix 更新。（如果有紧急的 bugfix，则任何时候都可发布）
- 次版本号：每月发布一个带有新特性的向下兼容的版本。
- 主版本号：含有破坏性更新和新特性，不在发布周期内。

---

## 3.2.16

`2023-03-23`

- 🐞 修复 notification close 事件多次触发问题 [#6150](https://github.com/vueComponent/ant-design-vue/issues/6150)
- 🐞 修复轮播图响应式变化问题 [#6100](https://github.com/vueComponent/ant-design-vue/issues/6100)
- 🐞 修复 Table 吸顶滚动条样式错误问题 [#6169](https://github.com/vueComponent/ant-design-vue/issues/6169)
- 🐞 修复 DatePicker disabledMinutes 参数错误 [#6233](https://github.com/vueComponent/ant-design-vue/issues/6233)
- 🐞 修复 Popup 关闭时没有触发 visibleChange 事件问题 [#6324](https://github.com/vueComponent/ant-design-vue/issues/6324)
- 🐞 修复 Image 预览图片错误问题 [#6331](https://github.com/vueComponent/ant-design-vue/issues/6331)

## 3.2.15

`2022-11-10`

- 🐞 修复 `Image` 动态删除时，预览图片错误问题

## 3.2.14

`2022-11-07`

- 🐞 修复自定义 `prefixCls` 时，动态主题失效问题 [#6063](https://github.com/vueComponent/ant-design-vue/issues/6063)
- 🐞 修复 `DatePicker` 使用 select 等弹窗组件作为插槽时，报错问题 [#6062](https://github.com/vueComponent/ant-design-vue/issues/6062)
- 🐞 修复 `DirectoryTree` 未暴露 scrollTo 方法 [#6067](https://github.com/vueComponent/ant-design-vue/issues/6067)
- 🐞 修复 `RangePicker` 弹窗位置不改变问题 [#6073](https://github.com/vueComponent/ant-design-vue/issues/6073)

## 3.2.13

`2022-10-08`

- 🌟 支持 Vue 3 升级工具 `@vue/compat` [#5973](https://github.com/vueComponent/ant-design-vue/issues/5973)
- 🌟 Cascader 添加 tagRender 插槽 [#5954](https://github.com/vueComponent/ant-design-vue/issues/5954)
- 🐞 修复 Image 预览关闭时，图片闪动问题 [#5955](https://github.com/vueComponent/ant-design-vue/issues/5955)
- 🐞 修复 Tag 关闭图标样式显示错位 [#5956](https://github.com/vueComponent/ant-design-vue/issues/5956)
- 🐞 修复 Table loading 属性 ts 类型错误 [#5964](https://github.com/vueComponent/ant-design-vue/issues/5964)
- 🐞 修复 Transfer 删除异常问题 [#5975](https://github.com/vueComponent/ant-design-vue/issues/5975)
- 🐞 修复 Table 固定列的滚动阴影显示问题 [#5996](https://github.com/vueComponent/ant-design-vue/issues/5996)
- 🐞 修复 DirectoryTree 在自定义 fieldNames 时，默认展开失效问题 [#6007](https://github.com/vueComponent/ant-design-vue/issues/6007)

## 3.2.12

`2022-09-02`

- 🐞 修复 DescriptionItem labelStyle 不生效问题 [#5920](https://github.com/vueComponent/ant-design-vue/issues/5920)
- 🌟 Typography 复制按钮阻止冒泡 [##5746](https://github.com/vueComponent/ant-design-vue/issues/5746)
- 🐞 修复 table 合并列滚动阴影遮挡问题 [#5786](https://github.com/vueComponent/ant-design-vue/issues/5786)
- 🐞 修复 css var 和 ConfigProvider 变量不一致问题 [#5929](https://github.com/vueComponent/ant-design-vue/issues/5929)

## 3.2.11

`2022-08-08`

- 🐞 修复 CDN 引入组件库时，dayjs 报错问题 [#5874](https://github.com/vueComponent/ant-design-vue/issues/5874)
- 🐞 修复 `Dropdown` 子菜单换行问题 [#5798](https://github.com/vueComponent/ant-design-vue/issues/5798)
- 🐞 修复图标引入打包体积增大问题 [#5822](https://github.com/vueComponent/ant-design-vue/issues/5822)
- 🐞 修复 `Select` 自定义字段时，没有自动聚焦选中节点问题 [#5843](https://github.com/vueComponent/ant-design-vue/issues/5843)
- 🐞 修复 `InputNumber` size=large 时， 样式未对齐问题 [#5853](https://github.com/vueComponent/ant-design-vue/issues/5853)

## 3.2.10

`2022-07-07`

- 🐞 修复在 `process.env.NODE_ENV = 'test'` 下弹窗类组件无法使用问题 [#4565](https://github.com/vueComponent/ant-design-vue/issues/4565)
- 🐞 修复 Menu 组件在快速 hover 弹出层时，弹出层直接关闭问题 [36df58](https://github.com/vueComponent/ant-design-vue/commit/36df585acf9a7d53c8b50be2ab240f54588a3b20)
- 🐞 修复 Input autosize 类型错误 [#5766](https://github.com/vueComponent/ant-design-vue/issues/5766)
- 🐞 修复 Table ellipsis tilte 在 fixed 下失效问题 [#5755](https://github.com/vueComponent/ant-design-vue/issues/5755)

## 3.2.9

`2022-06-25`

- 🐞 修复 Select 边缘位置关闭时闪动问题 [8a659d](https://github.com/vueComponent/ant-design-vue/commit/8a659da84fb8c44620fa279d9d6d73d6bd93d1f7)

## 3.2.8

`2022-06-24`

- 🌟 Image 新增滚轮放大缩小 [#5703](https://github.com/vueComponent/ant-design-vue/issues/5703)
- 🌟 ConfigProvider.config 新增 getPopupContainer [62dc24](https://github.com/vueComponent/ant-design-vue/commit/62dc2402f37c0ca0514f5b8fbb363247f0216bb2)
- 🐞 Upload tooltip 不展示问题 [#5714](https://github.com/vueComponent/ant-design-vue/issues/5714)
- 🐞 Row gutter 属性类型错误 [#5725](https://github.com/vueComponent/ant-design-vue/issues/5725)
- 🐞 Typography 是否可编辑切换后，状态未重置问题 [#5743](https://github.com/vueComponent/ant-design-vue/issues/5743)
- 🐞 DirectoryTree 多选模式下，点击时应该选中单个节点(多选只有配合 ctrl、shift 按键时选中多个节点) [#5732](https://github.com/vueComponent/ant-design-vue/issues/5732)

## 3.2.7

`2022-06-13`

- 🌟 `Checkbox` 支持添加额外属性 [#5678](https://github.com/vueComponent/ant-design-vue/issues/5678)
- 🌟 `RadioGroup` 支持全局 size [#5690](https://github.com/vueComponent/ant-design-vue/issues/5690)
- 🌟 `Table` expandedRowKeys 支持 v-model [#5695](https://github.com/vueComponent/ant-design-vue/issues/5695)
- 🐞 修复全局 Form message 未生效问题 [#5693](https://github.com/vueComponent/ant-design-vue/issues/5693)
- 🐞 修复 `Typography` 回车键触发两次 end 事件问题，blur 时不再触发 end [#5696](https://github.com/vueComponent/ant-design-vue/issues/5696)

## 3.2.6

`2022-06-07`

- 🌟 `Cascader` 自定义 trigger 支持自定义组件 [#5677](https://github.com/vueComponent/ant-design-vue/issues/5677)
- 🐞 修复 `DateRangePicker` `TimeRangePicker` 箭头没有跟随移动问题 [#71c619](https://github.com/vueComponent/ant-design-vue/commit/71c6195771c0b9ddffadd294ce01f7515c5adc40)
- 🐞 修复 `TimeRangePicker` minSteps、hourSteps、secondStep 未生效问题 [#5671](https://github.com/vueComponent/ant-design-vue/issues/5671)

## 3.2.5

`2022-05-26`

- 🌟 Image 新增左右箭头切换功能 [#5642](https://github.com/vueComponent/ant-design-vue/issues/5642)
- 🐞 修复 Steps progressDot 插槽失效问题 [#5648](https://github.com/vueComponent/ant-design-vue/issues/5648)
- 🐞 修复 Tooltip 全局 getPopupContainer 失效问题 [#5636](https://github.com/vueComponent/ant-design-vue/issues/5636)
- 🐞 修复 useForm help 样式问题 [#5635](https://github.com/vueComponent/ant-design-vue/issues/5635)
- 🐞 修复 Table、Tree 拖拽样式冲突问题 [#5644](https://github.com/vueComponent/ant-design-vue/issues/5644)

## 3.2.4

`2022-05-23`

- 🐞 修复 InputNumber v-model 类型错误 [#5577](https://github.com/vueComponent/ant-design-vue/issues/5677)
- 🌟 Select 支持全局 size [#5590](https://github.com/vueComponent/ant-design-vue/issues/5590)
- 🐞 Form clearValidate resetValidate 支持数组 [#5619](https://github.com/vueComponent/ant-design-vue/issues/5619)
- 🐞 Drawer 自定义 closeIcon 不生效问题 [#5616](https://github.com/vueComponent/ant-design-vue/issues/5616)
- 🌟 修复 CountDown 支持 dayjs [#5edca6](https://github.com/vueComponent/ant-design-vue/commit/5edca6be5a4e1aee9cde46724b14900f6c86bfb2)
- 🌟 Tree 支持 scrollTo [#5626](https://github.com/vueComponent/ant-design-vue/issues/5626)
- 🐞 Tooltip disabled 类名错误问题 [#5627](https://github.com/vueComponent/ant-design-vue/issues/5627)

## 3.2.3

`2022-05-05`

- 🌟 优化 `Tree` 性能 [#5551](https://github.com/vueComponent/ant-design-vue/issues/5551)
- 🐞 修复 `Progress` `type='dashboard'` 失效问题 [#5549](https://github.com/vueComponent/ant-design-vue/issues/5549)
- 🐞 修复 `Table` customRender 返回 `Fragment` 组件时，控制台 warning 问题 [#5556](https://github.com/vueComponent/ant-design-vue/issues/5556)
- 🐞 修复 `Card` 插槽为空时，渲染多余 dom 节点问题

## 3.2.2

`2022-04-26`

- 🐞 修复 `Table` 吸顶死循环问题 [#5543](https://github.com/vueComponent/ant-design-vue/issues/5543)

## 3.2.1

`2022-04-25`

- 🌟 `Image` previewMask 支持 `false`、`function` [#5531](https://github.com/vueComponent/ant-design-vue/issues/5531)
- 🌟 `Select` option 添加 title
- 🌟 `Table` 优化拖拽手柄，防止拖拽时触发排序、筛选等
- 🐞 修复 `Select` 选中选项后，触发 search 事件问题 [#5537](https://github.com/vueComponent/ant-design-vue/issues/5537)
- 🐞 修复 SSR 内存泄漏问题 [#5502](https://github.com/vueComponent/ant-design-vue/issues/5502)
- 🐞 修复 `Table` expandFixed ts 类型错误 [#5539](https://github.com/vueComponent/ant-design-vue/issues/5539)

#### 文档：

- 🌟 新增 Modal 拖拽示例 [体验](https://www.antdv.com/components/modal#components-modal-demo-modal-render)

## 3.2.0

`2022-04-19`

- 🌟 `InputNumber` 支持 lazy 修饰符
- 🌟 `Image` 新增 `previewMask` 属性, `error`事件 [#5479](https://github.com/vueComponent/ant-design-vue/issues/5479)
- 🌟 `Modal` style 支持字符串类型 [#5449](https://github.com/vueComponent/ant-design-vue/issues/5449)
- 🌟 `Cascader` 支持 `clearIcon`、`removeIcon` 插槽
- 🌟 优化 `DatePicker` 面板切换逻辑 [#5488](https://github.com/vueComponent/ant-design-vue/issues/5488)
- 🐞 修复 `Cascader` 没有自动修正弹窗位置 [#5482](https://github.com/vueComponent/ant-design-vue/issues/5482)
- 🐞 `Tabs` left、right 方向禁止动画 [#5464](https://github.com/vueComponent/ant-design-vue/issues/5464)
- 🐞 `TimeRangePicker` value ts type 支持 string
- 🐞 `Tree` 支持深度监听 [#5480](https://github.com/vueComponent/ant-design-vue/issues/5480)
- 🐞 修复 `Table` 在 keepalive 激活时未显示虚拟滚动条
- 🐞 修复 `Input` size warning [#5508](https://github.com/vueComponent/ant-design-vue/issues/5508)

## 3.1.1

`2022-04-06`

- 🌟 优化 `Form` rule 类型提示 [#5439](https://github.com/vueComponent/ant-design-vue/issues/5439)
- 🐞 修复虚拟滚动相关组件动态更新内容时，高度计算错误问题 [4a4670](https://github.com/vueComponent/ant-design-vue/commit/4a4670bdce9e1043348fd741ec7a262ba2413a3a)

## 3.1.0

`2022-04-06`

### 🔥🔥🔥 3.1.0 正式版发布 🔥🔥🔥

- 🐞 修复 `Select.Option` 子元素为空的时候，报错问题 [272430](https://github.com/vueComponent/ant-design-vue/commit/272430ba06e44e06eb07694d6aef4d474fb741cb)

## 3.1.0-rc.6

`2022-04-01`

- 🌟 优化 `Table` 性能，减少 hover 时 render 次数 [900464](https://github.com/vueComponent/ant-design-vue/commit/900464473823277e4b06ace1c1ddc69ab3ef21d9)
- 🐞 修复 `Tabs` 在设置 addIcon 时，未折叠问题 [669b22](https://github.com/vueComponent/ant-design-vue/commit/669b22a54b33892c193dfd36150ae1ac2fb350dd)
- 🐞 修复 `Mentions` 组件无法选中问题 [#5432](https://github.com/vueComponent/ant-design-vue/issues/5432)
- 🐞 修复组件 focus、blur 事件未携带 event 参数，导致 popover 报错 [#5434](https://github.com/vueComponent/ant-design-vue/issues/5434)
- 🐞 修复 `Select.Option`，设置 Tooltip 时，报错问题 [#5307](https://github.com/vueComponent/ant-design-vue/issues/5307)

## 3.1.0-rc.5

`2022-03-28`

### 🔥🔥🔥 预计 3 月底或 4 月初发布正式版，届时 3.x 将成为默认版本，文档也将默认指向 3.x 文档 🔥🔥🔥

- 🌟 优化组件 ts 类型提示 [#5408](https://github.com/vueComponent/ant-design-vue/issues/5408)
- 🐞 修复 `Form` 无法滚动到嵌套字段 [#5404](https://github.com/vueComponent/ant-design-vue/issues/5404)
- 🐞 修复 `Table` 吸底滚动条响应式失效 [afd74c](https://github.com/vueComponent/ant-design-vue/commit/afd74c95d8ccd6ced5ce5f5c1a9abe3a398a0217)

## 3.1.0-rc.4

`2022-03-25`

### 🔥🔥🔥 预计 3 月底或 4 月初发布正式版，届时 3.x 将成为默认版本，文档也将默认指向 3.x 文档 🔥🔥🔥

- 🐞 修复 `Select` options 不支持 push 等变种方法 [#5398](https://github.com/vueComponent/ant-design-vue/issues/5398)
- 🐞 修复 `MenuItem` 自定义 icon 时，icon 原始类名丢失 [#5390](https://github.com/vueComponent/ant-design-vue/issues/5390)

## 3.1.0-rc.3

`2022-03-24`

### 🔥🔥🔥 预计 3 月底或 4 月初发布正式版，届时 3.x 将成为默认版本，文档也将默认指向 3.x 文档 🔥🔥🔥

- 🌟 优化 `Tree` `TreeSelect` 的搜索、点击性能 [#5365](https://github.com/vueComponent/ant-design-vue/issues/5365)
- 🌟 `Menu` selectedKeys、openKeys 支持深度 watch [7bf1e0](https://github.com/vueComponent/ant-design-vue/commit/7bf1e0dda1fe8f70f6c8b17ba90b217df2a75bd4)
- 🐞 修复 `Checkbox` `Radio` 一次点击触发两次 `click` 事件问题 [#5363](https://github.com/vueComponent/ant-design-vue/issues/5363) [#5389](https://github.com/vueComponent/ant-design-vue/issues/5389)
- 🐞 修复 `FormItem` `htmlFor` 属性失效问题 [#5384](https://github.com/vueComponent/ant-design-vue/issues/5384)
- 🐞 修复 `Upload` 限制数量时，最后一个上传被 abort 问题 [#5385](https://github.com/vueComponent/ant-design-vue/issues/5385)
- 🐞 修复 `RangePicker` `showTime`时， disabled 未考虑 time 问题 [#5286](https://github.com/vueComponent/ant-design-vue/issues/5286)
- 🐞 修复 `Layout.Sidebar` 响应式折叠后，无法展开问题 [#5373](https://github.com/vueComponent/ant-design-vue/issues/5373)
- 🐞 修复 `AutoComplete` 自定义 children 的 class 未挂载问题 [414e7a](https://github.com/vueComponent/ant-design-vue/commit/414e7a1c56455017dbc3780ce7b1b4abd0f1c4d7)
- 🐞 修复 `TimeRangePicker` disabledTime 未生效问题 [#5387](https://github.com/vueComponent/ant-design-vue/issues/5387)
- 🐞 修复 `Dropdown` 自动修正弹窗位置失效问题 [#5391](https://github.com/vueComponent/ant-design-vue/issues/5391)

## 3.1.0-rc.2

`2022-03-19`

### 🔥🔥🔥 预计 3 月底或 4 月初发布正式版，届时 3.x 将成为默认版本，文档也将默认指向 3.x 文档 🔥🔥🔥

### 🔥🔥🔥 Surely Vue 同步支持 css var 🔥🔥🔥

- 🌟 优化底层虚拟滚动组件，流畅滚动百万数据，涉及 `Select` `Tree` `TreeSelect` `AutoComplete` `Cascader` 组件
- 🐞 修复 `Button` 组件切换 loading 时，动画未生效 [#5360](https://github.com/vueComponent/ant-design-vue/issues/5360)
- 🐞 修复 `Modal` 切换 loading 时，控制台报错问题 [#5361](https://github.com/vueComponent/ant-design-vue/issues/5361)

## 3.1.0-rc.1

`2022-03-18`

### 🔥🔥🔥 预计 3 月底或 4 月初发布正式版，届时 3.x 将成为默认版本，文档也将默认指向 3.x 文档 🔥🔥🔥

- 🌟 导出更多组件属性，方便二次开发 [#5340](https://github.com/vueComponent/ant-design-vue/issues/5340) [#5353](https://github.com/vueComponent/ant-design-vue/issues/5353)
- 🌟 `Timeline` 自定义颜色时可对 antd icon 生效 [2b81a7](https://github.com/vueComponent/ant-design-vue/commit/2b81a7213b169dc72f02c7e0f57afffd67333f0e)
- 🌟 `Radio` `Checkbox` 支持 number 类型
- 🌟 `Popover` 在 slot 为空时，不展示弹窗 [71e110](https://github.com/vueComponent/ant-design-vue/commit/71e110036ea0339207c168f268907dcc0de277e8)
- 🌟 `Pagination` 支持响应式 [85197c](https://github.com/vueComponent/ant-design-vue/commit/85197c4b50a7aae95079bfaa700c8868ed36cbad)
- 🌟 调整 `Textarea` 超出最大长度后的截断逻辑（超出后文本不再变化）[d92921](https://github.com/vueComponent/ant-design-vue/commit/d929217752aac2dcfcd56852c7dbc3a834819de1)
- 🐞 修复 `Table` column 拖动手柄样式丢失问题 [#5348](https://github.com/vueComponent/ant-design-vue/issues/5348)
- 🐞 修复 `FormItem` 错误提示重复显示问题 [#5349](https://github.com/vueComponent/ant-design-vue/issues/5349)
- 🐞 修复 `FormItem` 不可单独使用问题 [#5343](https://github.com/vueComponent/ant-design-vue/issues/5343)
- 🐞 修复 `Switch` 在 loading 状态下的 `Tooltip` 不展示问题 [625eff](https://github.com/vueComponent/ant-design-vue/commit/625efff1fa8fb3c93a5c657538274fe76a4a4f1f)

## 3.1.0-rc.0

`2022-03-15`

### 🔥🔥🔥 预计 3 月底或 4 月初发布正式版，届时 3.x 将成为默认版本，文档也将默认指向 3.x 文档 🔥🔥🔥

- 🔥 支持 CSS variables，升级后如遇样式构建报错，请查看[动态主题文档](https://ant.design/docs/react/customize-theme-variable-cn)排查问题。 [体验](https://antdv.com/components/config-provider-cn/#components-config-provider-demo-theme)
- 🔥 支持 RTL [体验](https://antdv.com/components/config-provider-cn/#components-config-provider-demo-direction)
- 🌟 `LayoutSider` `trigger` 支持插槽 [#5317](https://github.com/vueComponent/ant-design-vue/issues/5317)
- 🌟 `Select` 新增 `filterSort` `virtual` `listHeight` 配置 [#5310](https://github.com/vueComponent/ant-design-vue/issues/5310)
- 🌟 `SubMenu` 新增 `popupOffset` [#5312](https://github.com/vueComponent/ant-design-vue/issues/5312)
- 🌟 `Affix` 新增 customIcon 插槽 [60e259](https://github.com/vueComponent/ant-design-vue/pull/5327/commits/60e2597f7f80ca354acc859a832a71d1110b3f4c)
- 🌟 `Avatar` 新增 `crossOrigin` `maxPopoverTrigger` 属性 [5bdb45](https://github.com/vueComponent/ant-design-vue/pull/5327/commits/5bdb45d6688700f0fcc10324c898cb114a1fa469)
- 🌟 `Button` 新增全局 size 支持 [16b3b5f](https://github.com/vueComponent/ant-design-vue/pull/5327/commits/16b3b5fc366fcce155b4c37459a0b12f1031bfe6)
- 🌟 `DatePicker` 新增插槽 `prevIcon` `nextIcon` `superPrevIcon` `superNextIcon` [27e7ed](https://github.com/vueComponent/ant-design-vue/pull/5327/commits/27e7ed68fb4331e9e9a07738c68f135820496dd9)
- 🌟 `Divider` 新增 `orientationMargin` [c528d7](https://github.com/vueComponent/ant-design-vue/pull/5327/commits/c528d74c11dd323403705250b918e5408bce2c3c)
- 🌟 `Dropdown` 新增 `destroyPopupOnHide` `loading` [c4c691](https://github.com/vueComponent/ant-design-vue/pull/5327/commits/c4c691b20777fe459a24a429b50e0fc8cdbdef85)
- 🌟 `Form` 新增 `labelWrap` [cb95d1](https://github.com/vueComponent/ant-design-vue/pull/5327/commits/cb95d1202adce3375f73e55598cccea619a4d861)
- 🌟 `Input` 新增 `showCount` [85767d](https://github.com/vueComponent/ant-design-vue/pull/5327/commits/85767de39688b5da6157df9317666adaad6e184f)
- 🌟 `InputNumber` 新增 `prefix` 插槽 [efea6b](https://github.com/vueComponent/ant-design-vue/pull/5327/commits/efea6b000e581f9c71ba98f80febace4e024910c)
- 🌟 `MenuDivider` 新增 `dashed`虚线 [32fc4f](https://github.com/vueComponent/ant-design-vue/pull/5327/commits/32fc4fc7c4f3913dec771a6a96b097bcda754b40)
- 🌟 `Modal` 方法使用方式新增 `wrapClassName` [d38ecc](https://github.com/vueComponent/ant-design-vue/pull/5327/commits/d38ecce22c63adc5e8e52657fcbbef89e048b621)
- 🌟 `Modal.confirm` 新增 `showCancel` 以及 `propmise` 支持 [a041b5](https://github.com/vueComponent/ant-design-vue/pull/5327/commits/a041b5bacea2f94f55fee358ff39e5abd0d1b39f)
- 🌟 新增 `Skeleton.Button` `Skeleton.Input` 两个子组件 [2bd5fc](https://github.com/vueComponent/ant-design-vue/pull/5327/commits/2bd5fc15ffecf3cb3083accab02ceb97bd9ade38)
- 🌟 `Spin` 支持 `tip` 插槽 [93a06a](https://github.com/vueComponent/ant-design-vue/pull/5327/commits/93a06a45f58c0920e8f43c49c9859ce4ca10c94e)
- 🌟 `Table` 新增 `filterMode` 支持树形筛选 [79ff7a](https://github.com/vueComponent/ant-design-vue/pull/5327/commits/79ff7ac2dba4ab5cf01241ceef072f2c4be20e12)
- 🌟 `Typography` 新增 `enterIcon` 插槽、`triggerType` 属性 [e777bc](https://github.com/vueComponent/ant-design-vue/pull/5327/commits/e777bc17435b2610a0c0e1c29f60b900bcaab03c)
- 🐞 修复 `DatePicker` 使用字符串模式时，控制台输出类型错误问题 [#5323](https://github.com/vueComponent/ant-design-vue/issues/5323)
- 🐞 修复 `TreeSelect` 子节点全部 disabled 后，父节点无法选中问题 [#5316](https://github.com/vueComponent/ant-design-vue/issues/5316)
- 🐞 修复 `Row` `gutter` ts 类型提示错误问题 [2efe1a](https://github.com/vueComponent/ant-design-vue/commit/2efe1af6b66247b6bc89bf43bc3d2f1dc1f2a5d9)
- 🐞 修复 `Wave` 在自定义 prefixCls 时失效问题 [#5334](https://github.com/vueComponent/ant-design-vue/issues/5334)

## 3.0.0-beta.13

`2022-03-04`

- 🌟 优化 Menu overflow 后动画，避免闪动
- 🐞 修复日期组件使用 dateFns 时，输入不合法值时自动 parse 问题 [#5302](https://github.com/vueComponent/ant-design-vue/issues/5302)
- 🐞 修复 `Carousel` 使用图片时点击报错问题 [#5299](https://github.com/vueComponent/ant-design-vue/issues/5299)

## 3.0.0-beta.12

`2022-03-02`

- 🌟 优化 `Menu` horizontal 模式动画，避免闪动
- 🐞 修复 `Upload` 动画引起的高度问题 [#5298](https://github.com/vueComponent/ant-design-vue/issues/5298)

## 3.0.0-beta.11

`2022-02-28`

- 🌟 重构 `Upload`, 新增 showDownloadIcon、directory、isImageUrl、itemRender、maxCount、openFileDialogOnClick、progress、previewIcon、removeIcon、downloadIcon、drop 等特性
- 🌟 重构 `Carousel`
- 🐞 修复 `Mentions` 长按时无法选中问题 [#5233](https://github.com/vueComponent/ant-design-vue/issues/5233)
- 🐞 修复 `Table` 动态更改展开图标位置时，渲染多个展开图标问题 [#5295](https://github.com/vueComponent/ant-design-vue/issues/5295)
- 🐞 修复 `Slider` 类型错误问题 [#5289](https://github.com/vueComponent/ant-design-vue/issues/5289)

## 3.0.0-beta.10

`2022-02-18`

- 🐞 修复日期组件使用 dayjs 或 dateFns 时，输入不合法值时自动 parse 问题 [#5221](https://github.com/vueComponent/ant-design-vue/issues/5221)
- 🐞 修复 dropdownMatchSelectWidth 为 false 时，未关闭虚拟滚动问题 [#5242](https://github.com/vueComponent/ant-design-vue/issues/5242)
- 🐞 修复 descriptions 控制台 warning 问题 [#5250](https://github.com/vueComponent/ant-design-vue/issues/5250)
- 🐞 修复 dropdown 的右键展开时，挑动问题 [#5259](https://github.com/vueComponent/ant-design-vue/issues/5259)
- 🐞 修复 TreeSelect windows 触摸板展开失效问题 [#5220](https://github.com/vueComponent/ant-design-vue/issues/5220)

## 3.0.0-beta.9

`2022-01-28`

🔥🔥🔥 新年快乐 🔥🔥🔥

- 🌟 `Progress` 添加 title 属性，避免 title 被内部 title 覆盖问题 [#4929](https://github.com/vueComponent/ant-design-vue/issues/4929)
- 🐞 修复 `Input` focus 状态时，样式边框问题 [#5188](https://github.com/vueComponent/ant-design-vue/issues/5188)
- 🌟 优化虚拟滚动在 mobile 下的滚动效果 [#5191](https://github.com/vueComponent/ant-design-vue/issues/5191)
- 🐞 修复 `Tree` 组件在拖拽时的样式问题 [6d4248](https://github.com/vueComponent/ant-design-vue/commit/6d4248d046a420aa6a1ddfeb78632e4405b91e51)
- 🐞 修复 `TreeSelect` 在空内容时，回车按键填充空节点问题 [#5217](https://github.com/vueComponent/ant-design-vue/issues/5217)
- 🐞 修复 `Button` 在设置 size 后，block 样式失效问题 [#5219](https://github.com/vueComponent/ant-design-vue/issues/5219)

## 3.0.0-beta.8

`2022-01-21`

- 🔥 重构 `Cascader`, 支持多选，新增 `tagRender` `multiple` `maxTagCount` `maxTagPlaceholder` `expandIcon`, 使用 `dropdownClassName` `dropdownStyle` `open` `placement` 分别替换 `popupClassName` `popupStyle` `popupVisible` `popupPlacement` 属性
- 🌟 Select、TreeSelect 支持插槽 maxTagPlaceholder
- 🌟 `Table.Summary.Cell` 支持 `style`、`class` 的原生属性
- 🌟 导出更多组件类型: `ConfigProviderProps` `InputProps` `TextAreaProps` `PopconfirmProps` `PopoverProps` `SliderProps` `StepProps` `StepsProps`
- 🐞 修复 Modal 在 vue@3.2.28 下报错问题 [#5190](https://github.com/vueComponent/ant-design-vue/issues/5190)
- 🐞 修复 `Modal` `getContainer` 失效问题 [#5147](https://github.com/vueComponent/ant-design-vue/issues/5147)
- 🐞 修复 `Table` `responsive` 失效问题 [#5172](https://github.com/vueComponent/ant-design-vue/issues/5172)
- 🐞 修复 `Tabs` activeKey 受控失效问题 [#5180](https://github.com/vueComponent/ant-design-vue/issues/5180)

## 3.0.0-beta.7

`2022-01-10`

- 🌟 导出 FormItemInstance 类型 [23f5fb](https://github.com/vueComponent/ant-design-vue/commit/23f5fba013ae8a76fb814c218fb319488da3c70b)
- 🐞 修复 Modal 在 Dropdown 下不显示问题 [#5139](https://github.com/vueComponent/ant-design-vue/issues/5139)
- 🐞 修复 Modal esc 快捷键失效问题 [3297f7](https://github.com/vueComponent/ant-design-vue/commit/3297f7aa58f6098b2b1dd147341b5c8dc5f2f5e5)

## 3.0.0-beta.6

`2022-01-07`

- Modal
  - 🌟 重构 Modal 组件 [#5129](https://github.com/vueComponent/ant-design-vue/issues/5129)
  - 🐞 修复 Modal、Drawer 混合使用时，出现无法滚动问题 [#5096](https://github.com/vueComponent/ant-design-vue/issues/5096)
- 🐞 修复 Menu 在 Dropdown 下，绑定 click 事件，属性校验不通过问题 [#5127](https://github.com/vueComponent/ant-design-vue/issues/5127)
- 🐞 修复 Table 虚拟滚动条不更新问题 [#5124](https://github.com/vueComponent/ant-design-vue/issues/5124)
- 🐞 调整 DatePicker 为单一根节点，用于支持 v-show [#5132](https://github.com/vueComponent/ant-design-vue/issues/5132)

#### 文档：

- 🌟 动态更新 document.title，方便切换文档 [#5121](https://github.com/vueComponent/ant-design-vue/issues/5121)
- 🐞 修复 Empty 类型错误 [#5136](https://github.com/vueComponent/ant-design-vue/issues/5136)
- 🐞 修复 RangeTime 范围选择示例错误 [#5125](https://github.com/vueComponent/ant-design-vue/issues/5125)

## 3.0.0-beta.5

`2022-01-04`

- 🌟 重构 message、notification 组件 [#5113](https://github.com/vueComponent/ant-design-vue/issues/5113)
- 🐞 修复 TimePicker、Slider、TreeSelect 类型错误 [#5109](https://github.com/vueComponent/ant-design-vue/issues/5109)
- 🐞 修复 Space size=0 时未生效问题 [#5101](https://github.com/vueComponent/ant-design-vue/issues/5101)

## 3.0.0-beta.4

`2021-12-28`

- 🌟 重构 Checkbox 组件，性能更优
- 🌟 FormItem 新增 noStyle 属性，更加方便组织表单布局
- 🐞 修复 InputNumber 在 precision 为 0 时，无法输入最小值问题 [#5083](https://github.com/vueComponent/ant-design-vue/issues/5083)

#### 文档：

- 🌟 Form 新增 2 个示例：校验时间类组件、校验其它组件

## 3.0.0-beta.3

`2021-12-27`

- 🐞 修复 `Select` 虚拟滚动，动态修正高度错误问题 [#5082](https://github.com/vueComponent/ant-design-vue/issues/5082)

## 3.0.0-beta.2

`2021-12-27`

- 🐞 修复 FormItem 未传递 name 时，触发检验问题 [#5081](https://github.com/vueComponent/ant-design-vue/issues/5081)
- 🐞 修复 Table 首次渲染时宽度闪动问题 [#5075](https://github.com/vueComponent/ant-design-vue/issues/5075) [#4993](https://github.com/vueComponent/ant-design-vue/issues/4993)

## 3.0.0-beta.1

`2021-12-24`

- 🌟 重构 InputNumber 组件，新增属性： `bordered` `controls` `keyboard` `stringMode`， 插槽： `addonAfter` `addonBefore`， 事件：`step`，具体请查看 InputNumber API 说明
- 🌟 添加 global.d.ts 类型文件，方便 volar 识别 [#5067](https://github.com/vueComponent/ant-design-vue/issues/5067)
- 🐞 修复 web-type.json 丢失问题 [#4860](https://github.com/vueComponent/ant-design-vue/issues/4860)
- Tabs

  - 🌟 Tabs 折叠节点新增删除功能
  - 🐞 Tabs 特殊场景未激活选项问题 [#5056](https://github.com/vueComponent/ant-design-vue/issues/5056)
  - 🐞 修复默认导出的 TabPane 组件名称错误问题 [b645f8](https://github.com/vueComponent/ant-design-vue/commit/b645f827d0e13d60bc01c740ae8cbc8f61cf2cdf)

- Form

  - 🌟 文档新增 7 个使用示例
  - 🌟 新增 FormInstance 类型导出
  - 🌟 校验 Number 类型时无需指定类型 [#5064](https://github.com/vueComponent/ant-design-vue/issues/5064)
  - 🐞 回滚 FormItem 主动赋值时自动校验特性，此场景不应该自动校验 [#5056](https://github.com/vueComponent/ant-design-vue/issues/5056)
  - 🐞 修复 validateMessages 错误问题

- 🌟 优化虚拟列表基础组件，提升 Tree、TreeSelect、Select 性能 [4e70c6](https://github.com/vueComponent/ant-design-vue/commit/4e70c6dd775254ae713d8633db2d0363027708e1) [#5069](https://github.com/vueComponent/ant-design-vue/issues/5069)
- 🐞 修复 Tree 展开时卡顿闪动问题 [#5069](https://github.com/vueComponent/ant-design-vue/issues/5069)
- 🐞 修复 Input 重置 undefined 时，不更新问题

## 3.0.0-alpha.16

`2021-12-19`

- 🌟 重构 Input，新增无边框配置
- Table
  - 🌟 Table customCell 新增 column 参数[#5052](https://github.com/vueComponent/ant-design-vue/issues/5052)
  - 🐞 修复 Table 翻页时，控制台输出错误 warning 问题 [#5029](https://github.com/vueComponent/ant-design-vue/issues/5029)
  - 🐞 修复 Table 翻页组件弹出框隐藏时，弹框位置错误问题 [#5028](https://github.com/vueComponent/ant-design-vue/issues/5028)
- 🐞 修复 Rate 组件全局 prefixCls 未生效问题 [#5026](https://github.com/vueComponent/ant-design-vue/issues/5026)
- 🐞 修复 Menu 自定义 class 未生效问题 [#5038](https://github.com/vueComponent/ant-design-vue/issues/5038)
- 🐞 修复 Carousel 移动设备触摸时，打印 warning 问题 [#5040](https://github.com/vueComponent/ant-design-vue/issues/5040)
- 🐞 修复自定义 prefixCls 时，Select 无法选中问题 [#5023](https://github.com/vueComponent/ant-design-vue/issues/5023)

## 3.0.0-alpha.15

`2021-12-12`

- 🌟 优化 Layout 性能
- 🌟 Menu 支持懒加载(SubMenu 必须填写 key)，提升性能 [#4812](https://github.com/vueComponent/ant-design-vue/issues/4812)
- 🌟 Input、Textarea 支持 lazy 指令修饰符 [#4951](https://github.com/vueComponent/ant-design-vue/issues/4951)
- 🐞 Select placeholder 支持 slot [#4995](https://github.com/vueComponent/ant-design-vue/issues/4995)
- 🐞 修复 Radio cursor 样式 [#4997](https://github.com/vueComponent/ant-design-vue/issues/4997)
- 🐞 修复 Statistic.Countdown 属性支持插槽 [#4996](https://github.com/vueComponent/ant-design-vue/issues/4996)
- 🐞 修复 FormItem name 属性类型错误 [#4998](https://github.com/vueComponent/ant-design-vue/issues/4998)
- 🐞 修复 Menu 隐藏动画丢失问题
- 🐞 修复 FormItem explain style 未响应问题 [#5004](https://github.com/vueComponent/ant-design-vue/issues/5004)
- 🐞 修复 Slider tooltip 特殊条件不显示问题
- 🐞 修复 Dropdown 特殊条件触发两次 click 事件问题 [#5002](https://github.com/vueComponent/ant-design-vue/issues/5002)
- 🐞 修复部分组件在 SSR 下报错问题，支持 Nuxt
- 🐞 修复下拉框组件，在边缘处位置跳动问题 [#5008](https://github.com/vueComponent/ant-design-vue/issues/5008)
- 🐞 修复 Table 类型错误 [#5009](https://github.com/vueComponent/ant-design-vue/issues/5009)

## 3.0.0-alpha.14

`2021-12-05`

- 🌟 新增 xxxl 网格 [#4953](https://github.com/vueComponent/ant-design-vue/issues/4953)
- 🌟 Collapse activeKey 支持深度监听 [#4969](https://github.com/vueComponent/ant-design-vue/issues/4969)
- 🐞 修复 textarea blur 时未触发表单校验问题 [af5440](https://github.com/vueComponent/ant-design-vue/commit/af54405381d60bfadb383996a6ad64724b80f996)
- 🐞 修复 Form 主动赋值时未校验问题 [#4955](https://github.com/vueComponent/ant-design-vue/issues/4955)
- 🐞 修复 Select 搜索后无法滚动问题 [#4971](https://github.com/vueComponent/ant-design-vue/issues/4971)
- 🐞 修复 rangePicker、slider 类型问题

## 3.0.0-alpha.13

`2021-11-28`

🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

高级组件 Surely Vue 发布！！！

官方站点 ： [https://surely.cool/](https://surely.cool/)

Github：[https://github.com/surely-vue/table]

- 🐞 升级 ts，修复组件类型错误 [e28168](https://github.com/vueComponent/ant-design-vue/commit/e28168e0bed28a97ef8c7b33f80d03f6fd0b5a02)[#4908](https://github.com/vueComponent/ant-design-vue/issues/4908)[#4912](https://github.com/vueComponent/ant-design-vue/issues/4912)
- 🐞 Drawer visible 改为可选，避免在 jsx v-model 写法中报类型错误 [#4908](https://github.com/vueComponent/ant-design-vue/issues/4908)
- 🐞 修复 tabs moreIcon 插槽不生效问题 [#4928](https://github.com/vueComponent/ant-design-vue/issues/4928)
- 🐞 修复 Button :disabled="false" 时，样式错误问题 [#4930](https://github.com/vueComponent/ant-design-vue/issues/4930)
- 🐞 修复展开类组件(Select、AutoComplete、TreeSelect)，动画方向错误、展开闪动问题 [#4909](https://github.com/vueComponent/ant-design-vue/issues/4909)
- 🐞 Anchor 类名 fixed 没有前缀，导致命名冲突问题 [#4931](https://github.com/vueComponent/ant-design-vue/issues/4931)

## 3.0.0-alpha.12

`2021-11-20`

- 🐞 修复 TimeRangePicker 没有正确隐藏 panel 问题 [#4902](https://github.com/vueComponent/ant-design-vue/issues/4902)
- 🐞 修复 TreeSelect 重置 undefined 时，没有清空问题 [#4897](https://github.com/vueComponent/ant-design-vue/issues/4897)
- 🐞 修复 TreeSelect isLeaf 不生效问题 [#4883](https://github.com/vueComponent/ant-design-vue/issues/4883)
- 🐞 修复 Table rowSelection 报循环响应 warning 问题 [#4885](https://github.com/vueComponent/ant-design-vue/issues/4885)
- 🐞 修复 Table rowSelection 动态更新时不响应问题 [#4889](https://github.com/vueComponent/ant-design-vue/issues/4889)
- 🐞 修复部分组件类型丢失问题 [#4863](https://github.com/vueComponent/ant-design-vue/issues/4863)

## 3.0.0-alpha.11

`2021-11-08`

- 🌟 文档添加 codesanbox 链接 [#4861](https://github.com/vueComponent/ant-design-vue/issues/4861)
- 🐞 修复 Collapse 动画丢失问题 [#4856](https://github.com/vueComponent/ant-design-vue/issues/4856)
- 🐞 修复 Table 未设置 dataIndex 时报 warning 问题

## 3.0.0-alpha.10

`2021-11-05`

- 🐞 修复 Tree 不触发 loadData 问题 [#4835](https://github.com/vueComponent/ant-design-vue/issues/4835)
- 🐞 修复 Breadcrumb.Item click 事件不触发问题 [#4845](https://github.com/vueComponent/ant-design-vue/issues/4845)
- 🐞 修复 Checkbox 在 Group 下有时不居中问题 [#4846](https://github.com/vueComponent/ant-design-vue/issues/4846)

## 3.0.0-alpha.9

`2021-11-03`

- 🐞 修复部分组件在 ssr 下 requestAnimationFrame 未定义错误 [#4833](https://github.com/vueComponent/ant-design-vue/issues/4833)
- 🐞 修复 TreeSelect selectable、checkable 无法关闭问题 [#4838](https://github.com/vueComponent/ant-design-vue/issues/4838)
- 🐞 修复 Tabs 在移动端无法滚动问题 [#4828](https://github.com/vueComponent/ant-design-vue/issues/4828)
- 🐞 修复 InputNumber 在 form 下不触发检验问题 [#4831](https://github.com/vueComponent/ant-design-vue/issues/4831)
- 🐞 修复 Select 使用 `<a-select-option>` 构建节点时，自动分词失效 [#4844](https://github.com/vueComponent/ant-design-vue/issues/4844)

## 3.0.0-alpha.8

`2021-10-30`

- 🐞 修复组件类型丢失问题 [#4823](https://github.com/vueComponent/ant-design-vue/issues/4823)

## 3.0.0-alpha.7

`2021-10-29`

- 🌟 Form 新增 validate 事件 [#4817](https://github.com/vueComponent/ant-design-vue/issues/4817)
- 🌟 Tree 提供 ref 获取内部状态 api [#4820](https://github.com/vueComponent/ant-design-vue/issues/4820)
- 🐞 修复 Table 拖动时宽度突变问题 [#4811](https://github.com/vueComponent/ant-design-vue/issues/4811)
- 🐞 修复 TreeSelect 为空后，再次打开不更新问题 [a5604b](https://github.com/vueComponent/ant-design-vue/commit/a5604bb96796b9ec0090d3ec0c6d32d13d0df740)

## 3.0.0-alpha.6

`2021-10-27`

- 🌟 Table 新增拖动列

## 3.0.0-alpha.5

`2021-10-26`

- Table
  - 🐞 修复 sticky 时报错问题 [#4804](https://github.com/vueComponent/ant-design-vue/issues/4804) [#4808](https://github.com/vueComponent/ant-design-vue/issues/4808)
  - 🐞 修复 emptyText 国际化失效问题 [#4805](https://github.com/vueComponent/ant-design-vue/issues/4805)
  - 🌟 优化大小改变时的性能问题 [#4787](https://github.com/vueComponent/ant-design-vue/issues/4787)
- 🌟 useForm 支持深度响应式 rule [#4799](https://github.com/vueComponent/ant-design-vue/issues/4799)
- 🌟 Dropdown type 支持 text 类型 [#4802](https://github.com/vueComponent/ant-design-vue/issues/4802)
- 🐞 修复 Menu 在移动端报错问题 [#4794](https://github.com/vueComponent/ant-design-vue/issues/4794)
- 🐞 修复 Tree 自定义 fieldNames 时，勾选失效问题 [#4790](https://github.com/vueComponent/ant-design-vue/issues/4790)
- 🐞 修复 api 组件国际化失效问题 [#4780](https://github.com/vueComponent/ant-design-vue/issues/4780)

## 3.0.0-alpha.4

`2021-10-20`

- 组件部分状态使用 shallowRef 提升性能 [3a968f](https://github.com/vueComponent/ant-design-vue/commit/3a968fdd33960a788f2037d944aca4e8ee81294f)

## 3.0.0-alpha.3

`2021-10-08`

- Table
  - 🐞 修复排序提示不显示问题 [f64d7a](https://github.com/vueComponent/ant-design-vue/commit/f64d7adb22952cfdd5bf642343335fd78460d745)
  - 🐞 修复部分属性响应式丢失问题 [#4756](https://github.com/vueComponent/ant-design-vue/issues/4756)
- 🐞 修复 `Popover` `Popconfirm` 默认自动校准位置不生效问题 [98b5e5](https://github.com/vueComponent/ant-design-vue/commit/98b5e5d53fd10620eddc2c386181f868ef941397)

## 3.0.0-alpha.2

`2021-10-08`

- 🐞 修复引用 process.nextTick 问题 [#4737](https://github.com/vueComponent/ant-design-vue/issues/4737)

## 3.0.0-alpha.1

`2021-10-07`

- 🌟 重构 `Tabs` [#4732](https://github.com/vueComponent/ant-design-vue/issues/4732)
  - 移除 `prevClick`、`nextClick` 事件，使用 `tabScroll` 事件替代
  - 废弃 `tabBarExtraContent` 插槽，使用 rightExtra 插槽替换，同时新增 `leftExtra` 插槽
  - 新增 `addIcon`、`closeIcon`、`moreIcon` 插槽
- 🌟 重构 `Card`，废弃 tabList slots 配置，使用 customTab 插槽统一配置 [#4732](https://github.com/vueComponent/ant-design-vue/issues/4732)
- 🌟 重构 `Drawer`
  - 新增 `autofocus` `contentWrapperStyle` `footerStyle` `headerStyle` `push` `size` `forceRender` 等属性
  - 新增 `closeIcon` `extra` `footer` 等插槽
  - 废弃 `afterVisibleChange` 属性，使用同名事件替代
- 🐞 修复 `Table` pagination 没有响应式变化问题 [1add0d](https://github.com/vueComponent/ant-design-vue/commit/1add0d251cd35aa2c55404f7a60f1531425490c1)
- 🐞 修复 `notification` 样式错位问题 [#4703](https://github.com/vueComponent/ant-design-vue/issues/4703)
- 🐞 修复 `Tree` fieldsName 导致的选中、拖拽等异常 [#4726](https://github.com/vueComponent/ant-design-vue/issues/4726)

## 3.0.0-alpha.0

`2021-09-24`

🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

- 文档开源，如果您的公司不能外网访问，可以私有化部署，但不可以传播，不可以商业化。
- 移除了 Transfer 的 `lazy` 属性，它并没有起到真正的优化效果。
- 移除了 Select 的 `combobox` 模式，请使用 `AutoComplete` 替代。
- 废弃 Button.Group，请使用 `Space` 代替。
- `Timeline.Item` 新增 label。
- `Steps` 新增 `responsive`、`percent`。
- `Collapse` 新增 `ghost`、`collapsible`。
- `Popconfirm` 新增 `cancelButton`、`okButton`, 以及 `esc` 按键隐藏。
- `ConfigProvider` 新增 ConfigProvider.config，定义 `Modal.xxx` `message` `notification` 的配置。
- `Tree` `TreeSelect`

  - 新增了虚拟滚动，废弃使用 `a-tree-node` `a-tree-select-node` 构建节点，使用 `treeData` 属性替代，提升组件性能。
  - 废弃 `scopedSlots` `slots` 自定义渲染节点，使用 `v-slot:title` 替换，提升易用性，避免插槽配置膨胀，同时也避免了插槽冲突问题。

- `Table`

  - 移除了 Table 的 `rowSelection.hideDefaultSelections` 属性，请在 `rowSelection.selections` 中使用 `SELECTION_ALL` 和 `SELECTION_INVERT` 替代，[自定义选择项](/components/table/#components-table-demo-row-selection-custom)。
  - 移除了 Column slots，分别使用 `v-slot:headerCell` `v-slot:headerCell` `v-slot:bodyCell` `v-slot:customFilterDropdown` `v-slot:customFilterIcon` 替换，提升易用性，避免插槽配置膨胀，同时也避免了插槽冲突问题。
  - 新增 expandFixed 控制展开图标是否固定。
  - 新增 showSorterTooltip 表头是否显示下一次排序的 tooltip 提示。
  - 新增 sticky 用于设置粘性头部和滚动条。
  - 新增 rowExpandable 用于设置是否允许行展开。
  - 新增插槽 headerCell 用于个性化头部单元格。
  - 新增插槽 bodyCell 用于个性化单元格。
  - 新增插槽 customFilterDropdown 用于自定义筛选菜单，需要配合 `column.customFilterDropdown` 使用。
  - 新增插槽 customFilterIcon 用于自定义筛选图标。
  - 新增插槽 emptyText 用于自定义空数据时的显示内容。
  - 新增插槽 summary 用于总结栏。

- `DatePicker` `TimePicker` `Calendar`

  - 默认使用更加轻量级的 dayjs 替换 momentjs，如果你的项目过大，使用了大量的 momentjs 的方法，你可以参考文档[自定义时间库](/docs/vue/replace-date-cn)，替换成 momentjs。
  - UI 交互调整，对齐 antd 4.x 交互规范。

- `Form` 这次更新主要目标是提升性能，如果你没有自定义表单控件，几乎可以忽略该部分

  - 自 3.0 版本以后，Form.Item 不再劫持子元素，而是通过 provider / inject 依赖注入的方式进行自动校验，这种方式可以提高组件性能，子元素也不会限制个数，同样子元素也可以是进一步封装的高级组件。你可以参考[自定义表单控件示例](#components-form-demo-customized-form-controls)，但它同样会有一些缺点：

    1、自定义组件如果希望 Form.Item 进行校验展示，你需要 `const {id, onFieldChange, onFieldBlur} = useInjectFormItemContext()` 注入，并调用相应的方法。

    2、一个 Form.Item 只能收集一个表单项的数据，如果有多个表单项，会导致收集错乱。例如：

    ```html
    <a-form-item>
      <a-input name="a"></a-input>
      <a-input name="b"></a-input>
    </a-form-item>
    ```

    如上 Form.Item 并不知道需要收集 `name="a"` 还是 `name="b"`，你可以通过如下三种方式去解决此类问题：

    第一种，使用多个 `a-form-item`:

    ```html
    <a-form-item>
      <a-input name="a"></a-input>
      <a-form-item><a-input name="b"></a-input></a-form-item>
    </a-form-item>
    ```

    第二种，使用自定义组件包裹，并在自定义组件中调用 `useInjectFormItemContext`，相当于把多个表单项合并成了一个。

    ```html
    <script>
      // 自定义组件
      import { Form } from 'ant-design-vue';
      export default {
        setup() {
          const formItemContext = Form.useInjectFormItemContext();
        },
      };
    </script>
    ```

    ```html
    <a-form-item>
      <custom-com>
        <a-input name="a"></a-input>
        <a-input name="b"></a-input>
      </custom-com>
    </a-form-item>
    ```

    第三种，组件库提供了一个 `a-form-item-rest` 组件，它会阻止数据的收集，你可以将不需要收集校验的表单项放到这个组件中即可，它和第一种方式很类似，但它不会产生额外的 dom 节点。

    ```html
    <a-form-item>
      <a-input name="a"></a-input>
      <a-form-item-rest><a-input name="b"></a-input></a-form-item-rest>
    </a-form-item>
    ```

## 2.2.8

`2021-09-17`

- 🌟 Upload method 支持 patch [#4637](https://github.com/vueComponent/ant-design-vue/issues/4637)
- 🌟 List gutter 支持数组 [d2b721](https://github.com/vueComponent/ant-design-vue/commit/d2b72143f0e15c8716b4ea8f68b2b72eff5cf510)
- 🐞 修复 Modal 类型错误 [#4632](https://github.com/vueComponent/ant-design-vue/issues/4632)
- 🐞 修复 AutoComplete 无法重置 undefined 问题 [741718](https://github.com/vueComponent/ant-design-vue/commit/741718a0f92c790266e7a07d8d129c5673344a7e)
- 🐞 修复 Tag 关闭图标样式丢失问题 [#4649](https://github.com/vueComponent/ant-design-vue/issues/4649)
- 🐞 修复 TreeSelect 清楚按钮在特殊条件下不显示问题 [#4655](https://github.com/vueComponent/ant-design-vue/issues/4655)
- 🐞 修复 useForm immdiate 不生效问题 [#4646](https://github.com/vueComponent/ant-design-vue/issues/4646)

## 2.2.7

`2021-09-08`

- 🌟 Menu 支持 overflowedIndicator 插槽 [#4515](https://github.com/vueComponent/ant-design-vue/issues/4515)
- 🌟 useForm 支持动态 rule [#4498](https://github.com/vueComponent/ant-design-vue/issues/4498)
- 🌟 Select 支持 Number 类型 [#4570](https://github.com/vueComponent/ant-design-vue/issues/4570)
- 🐞 修复 css zoom 引起的 warning 问题 [#4554](https://github.com/vueComponent/ant-design-vue/issues/4554)
- 🐞 修复 Mentions 输入中文报错问题 [#4524](https://github.com/vueComponent/ant-design-vue/issues/4524)
- 🐞 修复 AutoComplete 不支持全局 prefixCls 问题 [#4566](https://github.com/vueComponent/ant-design-vue/issues/4566)
- 🐞 修复 Table 嵌套表格报错问题 [#4600](https://github.com/vueComponent/ant-design-vue/issues/4600)
- 🐞 修复 Dropdown 下的 MenuItem danger 属性无样式问题 [#4618](https://github.com/vueComponent/ant-design-vue/issues/4618)
- 🐞 修复 Modal.xxx 等方法传递 appContext 失效问题 [#4627](https://github.com/vueComponent/ant-design-vue/issues/4627)
- 🐞 修复一些 TS 类型错误

## 2.2.6

`2021-08-12`

- 🐞 修复 `Table` 展开列表渲染错位问题 [#4507](https://github.com/vueComponent/ant-design-vue/issues/4507)
- 🐞 修复 `Rate` 自定义 `character` 插槽未生效问题 [#4509](https://github.com/vueComponent/ant-design-vue/issues/4509)
- 🐞 添加 resize-observer-polyfill, 修复在低版本 Chrome 下报错问题 [#4508](https://github.com/vueComponent/ant-design-vue/issues/4508)

## 2.2.5

`2021-08-11`

- 🌟 `Select` 支持通过 option 插槽定制化节点 [68c1f4](https://github.com/vueComponent/ant-design-vue/commit/68c1f4550108a3a6bbe4f1b2c5c168523fd6c84a)
- 🐞 修复开发环境下弹窗类组件在低版本 chrome 下，不显示问题，并避免弹窗闪动 [#4409](https://github.com/vueComponent/ant-design-vue/issues/4409)
- 🐞 修复 `Select` 打开时没有滚动到激活位置问题 [ccb240](https://github.com/vueComponent/ant-design-vue/commit/ccb24016c07632f49550646c971060c402586c67)

## 2.2.4

`2021-08-10`

- 🌟 支持 Vue@3.2 [#4490](https://github.com/vueComponent/ant-design-vue/issues/4490)
- 🌟 自动隐藏 `Table` 横向滚动条 [#4484](https://github.com/vueComponent/ant-design-vue/issues/4484)
- 🐞 修复 `Progress` trailColor 不生效问题 [#4483](https://github.com/vueComponent/ant-design-vue/issues/4483)

## 2.2.3

`2021-08-07`

- 🌟 `Table` 固定列使用 `position: sticky` ， 提升性能，解决部分场景不对齐问题 [38569c](https://github.com/vueComponent/ant-design-vue/commit/38569c28c7eb4eaa34f2cc096982daea901062d4)
- 🌟 `Collapse` 支持 number 类型 key [#4405](https://github.com/vueComponent/ant-design-vue/issues/4405)
- 🌟 优化 `Tabs` 在 windows 下选中时闪动问题 [#4241](https://github.com/vueComponent/ant-design-vue/issues/4241)
- 🌟 `InputPassword` 支持全局设置 prefixCls [#4430](https://github.com/vueComponent/ant-design-vue/issues/4430)
- 🐞 修复 `Select` 无法滚动问题 [#4396](https://github.com/vueComponent/ant-design-vue/issues/4396)
- 🐞 修复 `Badge` 在 ssr 下报错问题 [#4384](https://github.com/vueComponent/ant-design-vue/issues/4384)
- 🐞 修复 `Form` 多出无效数据字段问题 [#4435](https://github.com/vueComponent/ant-design-vue/issues/4435)
- 🐞 修复 `FormItem` 子元素是原生标签时报错问题 [#4383](https://github.com/vueComponent/ant-design-vue/issues/4383)
- 🐞 修复 `TreeSelect` 通过 slot 自定义 title 时报错问题 [#4459](https://github.com/vueComponent/ant-design-vue/issues/4459)

## 2.2.2

`2021-07-11`

- 🌟 Switch 新增 checkedValue、unCheckedValue 属性用于自定义 checked 绑定值 [#4329](https://github.com/vueComponent/ant-design-vue/issues/4329)
- 🐞 修复 SubMenu 动画丢失的问题 [#4325](https://github.com/vueComponent/ant-design-vue/issues/4325)
- 🐞 修复 TimePicker 在 Form 下验证错误时没有红框问题 [#4331](https://github.com/vueComponent/ant-design-vue/issues/4331)
- 🐞 修复 UploadDragger 不支持 vite-plugin-components 按需加载问题 [#4334](https://github.com/vueComponent/ant-design-vue/issues/4334)
- 🐞 修复 TreeSelect 通过 slot 自定义 title 时报错问题 [1152e8](https://github.com/vueComponent/ant-design-vue/commit/1152e8cd71cadf9e8fb4797916adca20c0e35974)
- 🐞 修复 Dropdown submenu 样式丢失问题 [#4351](https://github.com/vueComponent/ant-design-vue/issues/4351)
- TS
  - 修复 Table 在 ts 4.3.5 版本下类型报错问题 [#4296](https://github.com/vueComponent/ant-design-vue/issues/4296)
  - 完善 notification 类型 [#4346](https://github.com/vueComponent/ant-design-vue/issues/4346)

## 2.2.1

`2021-07-06`

- 🐞 修复 Space 组件在不支持 flex 的浏览器中样式不生效问题
- 🐞 修复 DatePicker 在 safari 下触发滚动问题 [#4323](https://github.com/vueComponent/ant-design-vue/issues/4323)

## 2.2.0

`2021-07-06`

- 🎉 重构 Button 组件，移除 type="danger"，新增 `danger` 属性 [#4291](https://github.com/vueComponent/ant-design-vue/issues/4291)
- 🐞 修复 Rate 组件不更新问题 [#4294](https://github.com/vueComponent/ant-design-vue/issues/4294)
- 🐞 修复 Tree replaceFields 报错问题 [#4298](https://github.com/vueComponent/ant-design-vue/issues/4298)
- 🐞 修复 Modal 缺少 parentContext 类型问题 [#4305](https://github.com/vueComponent/ant-design-vue/issues/4305)

## 2.2.0-rc.1

`2021-06-29`

- 🌟 更改 babel 配置，较小构建包大小
- 🌟 Form 原生提供 useForm 功能，废弃 @ant-design-vue/use 库
- 🐞 修复 Form validateFirst 属性在多个校验规则时不触发 reject 问题 [#4273](https://github.com/vueComponent/ant-design-vue/issues/4273)
- 🐞 修复 List 循环引用导致 Vite 下报错问题 [#4263](https://github.com/vueComponent/ant-design-vue/issues/4263)
- 🐞 修复 Menu 事件回调缺少 item 属性问题 [#4290](https://github.com/vueComponent/ant-design-vue/issues/4290)

## 2.2.0-beta.6

`2021-06-26`

- 🌟 Menu 性能优化 [e8b957](https://github.com/vueComponent/ant-design-vue/commit/e8b95784eb1ee0554b0d6b17bdc14e18775f2ae6)
- 🐞 修复 Layout、RangePicker、WeekPicker、Textarea 按需加载失效

## 2.2.0-beta.5

`2021-06-24`

- 🎉 支持 vite-plugin-components 按需加载
- 🎉 重构 List 组件
- 🌟 Select 新增响应式折叠选项 [656d14](https://github.com/vueComponent/ant-design-vue/commit/656d14fc4e4ef0f781324438f0d58cfb6816d583)
- 🐞 修复 Select 动态更新选项时虚拟列表无法滚动问题 [b2aa49d](https://github.com/vueComponent/ant-design-vue/commit/b2aa49d064a83c6ce786a6bb4cd9fc5266a5964d)
- 🐞 修复 Select 键盘事件位置不正确问题 [604372](https://github.com/vueComponent/ant-design-vue/commit/604372ff2da521dd580ad5229f7dbd445c1c6190)
- 🐞 修复 AutoComplete 不支持 options slot 问题 [#4012](https://github.com/vueComponent/ant-design-vue/issues/4012)

## 2.2.0-beta.4

`2021-06-21`

- 🎉 重构 Descriptions 组件 [#4219](https://github.com/vueComponent/ant-design-vue/issues/4219)
- 🐞 修复 Countdown 不触发 finish 事件问题 [#4222](https://github.com/vueComponent/ant-design-vue/issues/4222)
- 🐞 修复 ConfigProvider 在 vue 3.1 下报错问题 [#4225](https://github.com/vueComponent/ant-design-vue/issues/4225)
- 🐞 修复 Dropdown 下使用 SubMenu 报错问题 [#4205](https://github.com/vueComponent/ant-design-vue/issues/4205)
- 🐞 修复 Col 类型错误 [#4226](https://github.com/vueComponent/ant-design-vue/issues/4226)
- 🐞 修复 Typography 失焦时不触发 onEnd 问题 [#4227](https://github.com/vueComponent/ant-design-vue/issues/4227)
- 🐞 修复 ImagePreview 样式丢失问题 [#4231](https://github.com/vueComponent/ant-design-vue/issues/4231)

## 2.2.0-beta.3

`2021-06-11`

- 🎉 重构 Breadcrumb、Statistic、Tag 组件
- 🌟 Statistic 支持 loading 属性
- 🐞 修复 Menu 渲染多次子组件问题，提升性能 [6ae707](https://github.com/vueComponent/ant-design-vue/commit/6ae707edf508a9c5e8dca7dacf1410de5251bcf8)
- 🐞 修复 FormItem 自定义 class 失效 [617e53](https://github.com/vueComponent/ant-design-vue/commit/617e534fda2ae6d468b5e9d3eb43370f8a4b0000)
- 🐞 修复 MenuDivider class 错误问题 [#4195](https://github.com/vueComponent/ant-design-vue/issues/4195)
- 🐞 修复 Tag、Image 类型错误
- 🐞 修复 Modal 等组件动画丢失问题 [#4191](https://github.com/vueComponent/ant-design-vue/issues/4191)
- 🐞 修复 Select class 不能动态更新问题 [#4194](https://github.com/vueComponent/ant-design-vue/issues/4194)
- 🐞 修复 Dropdown 邮件展开，不能点击收起的问题 [#4198](https://github.com/vueComponent/ant-design-vue/issues/4198)
- 🐞 修复 FormItem 缺少部分导出方法问题 [#4183](https://github.com/vueComponent/ant-design-vue/issues/4183)

## 2.2.0-beta.2

`2021-06-08`

- 🐞 修复 PageHeader 显示多余字符问题 [4de773](https://github.com/vueComponent/ant-design-vue/commit/4de7737907d485d3dd3be44b70e599cc53edb171)
- 🐞 修复部分组件不能在 Vue3.1 下不能正常渲染问题 [#4173](https://github.com/vueComponent/ant-design-vue/issues/4173)
- 🐞 修复 Menu.Divider 名称错误问题 [6c5c84](https://github.com/vueComponent/ant-design-vue/commit/6c5c84a3fc4b8abcd7aed0922852a64e0ac293c7)

## 2.2.0-beta.1

`2021-06-07`

- 🔥🔥🔥 虚拟 Table 独立库发布 https://www.npmjs.com/package/@surely-vue/table , 该组件是一个独立的库，目前文档示例尚未完善，他是一个完全 ts 开发的组件，有较好的类型提示，npm 上已有 API 文档，着急使用的的可以摸索着用起来了，这里有个在线体验示例，https://store.antdv.com/pro/preview/list/big-table-list
- 🔥🔥🔥 重构大量组件，源码更加易读，性能更优，ts 类型更加全面
  - 本版本重构组件 Anchor、Alert、Avatar、Badge、BackTop、Col、Form、Layout、Menu、Space、Spin、Switch、Row、Result、Rate
- 🎉 Menu

  - 性能更优 [#3300](https://github.com/vueComponent/ant-design-vue/issues/3300)
  - 修复高亮不正确问题 [#4053](https://github.com/vueComponent/ant-design-vue/issues/4053)
  - 修复控制台无效 warning [#4169](https://github.com/vueComponent/ant-design-vue/issues/4169)
  - 更加易用，更加简单的使用单文件递归 [#4133](https://github.com/vueComponent/ant-design-vue/issues/4133)
  - 💄 图标 icon 需要通过 slot 传递

- Skeleton

  - 🌟 支持 Skeleton.Avatar 占位组件。
  - 🌟 支持 Skeleton.Button 占位组件。
  - 🌟 支持 Skeleton.Input 占位组件。

- 💄 破坏性更新

  - `a-menu-item`、`a-sub-menu` 图标需要通过 slot 传递，不在通过子节点自动获取图标
  - row gutter 支持 row-wrap， 无需使用多个 row 划分 col
  - Menu 移除 defaultOpenKeys、defaultSelectedKeys; Switch 移除 defaultChecked; Rate 移除 defaultValue; 其它未重构组件的 defaultXxx 命名的属性请谨慎使用，在未来的版本中也会被移除。

- 🌟 新增 Avatar.Group 组件
- 🐞 修复 AutoComplete filterOptions 不生效问题 [#4170](https://github.com/vueComponent/ant-design-vue/issues/4170)
- 🐞 修复 Select 自动宽度失效问题 [#4118](https://github.com/vueComponent/ant-design-vue/issues/4118)
- 🐞 修复 dist 缺少国际化文件问题 [#3684](https://github.com/vueComponent/ant-design-vue/issues/3684)

## 2.1.6

`2021-05-13`

- 🐞 使用 vue@3.0.10 重新构建，避免控制台 warning [#3998](https://github.com/vueComponent/ant-design-vue/issues/3998)

## 2.1.5

`2021-05-12`

- 🐞 修复 SSR 时报错问题 [#3983](https://github.com/vueComponent/ant-design-vue/issues/3983)

## 2.1.4

`2021-05-09`

- 🐞 修复 `Table` 滚动错位问题 [#4045](https://github.com/vueComponent/ant-design-vue/issues/4045)
- 🐞 修复 `Typography` editable 模式触发链接跳转问题 [#4105](https://github.com/vueComponent/ant-design-vue/issues/4105)
- 🐞 修复 `Carousel` variableWidth 不生效问题 [#3977](https://github.com/vueComponent/ant-design-vue/issues/3977)
- 🐞 修复 `TreeSelect` 无法通过键盘同时删除父子节点问题 [#3508](https://github.com/vueComponent/ant-design-vue/issues/3508)
- 🐞 修复若干类型错误问题

## 2.1.3

`2021-04-25`

- 🎉🎉🎉 移除 npm 安装时的广告
- 🐞 `Select`
  - 修复默认激活第一项问题 [#3842](https://github.com/vueComponent/ant-design-vue/issues/3842)
  - 修复分组显示异常问题 [#3841](https://github.com/vueComponent/ant-design-vue/issues/3841)
  - 修复动态更新选择项后滚动异常问题 [#3972](https://github.com/vueComponent/ant-design-vue/issues/3972)
- 🐞 修复 `Checkbox` 触发两次 `update:checked` 问题 [#3838](https://github.com/vueComponent/ant-design-vue/issues/3838)
- 🌟 `Table` column group 支持 fixed [#3882](https://github.com/vueComponent/ant-design-vue/issues/3882)
- 🌟 `Table` column 支持 v-for [#3934](https://github.com/vueComponent/ant-design-vue/issues/3934)
- 🐞 修复 `Table` 在 windows 显示横向滚动条问题 [6d33d6](https://github.com/vueComponent/ant-design-vue/commit/6d33d60d2bca98825f274e48bcc3badd1857f742)
- 🌟 `Form` scrollToFirstError 支持选项参数传递 [#3918](https://github.com/vueComponent/ant-design-vue/issues/3918)
- 🐞 修复 `Calendar` 月份选择器显示错误字符问题 [#3915](https://github.com/vueComponent/ant-design-vue/issues/3915)
- 🌟 重构 `Switch` 组件，移除 defaultChecked 属性 [#3885](https://github.com/vueComponent/ant-design-vue/issues/3885)
- 🐞 修复使用 Vite 时，抛出 process 异常问题 [#3930](https://github.com/vueComponent/ant-design-vue/issues/3930)
- 🐞 修复 `Radio` 阴影遮挡问题 [#3955](https://github.com/vueComponent/ant-design-vue/issues/3955)
- 🐞 修复 `Form` inline 模式下， span 不生效问题 [#3862](https://github.com/vueComponent/ant-design-vue/issues/3862)
- 🐞 修复 `Cascader` keydown 选择不生效问题 [#958](https://github.com/vueComponent/ant-design-vue/issues/958)
- 🐞 修复 `Image` 预览功能失败问题 [#3701](https://github.com/vueComponent/ant-design-vue/issues/3701)
- 🐞 修复一些 TS 类型问题

## 2.1.2

`2021-03-28`

- 🌟 使用 Vue 3.0.9 重新编译，兼容 3.0.7 及以下版本

## 2.1.1

`2021-03-27`

- 🌟 兼容 Vue 3.0.8，注意：由于 3.0.8 的破坏性更新，2.1.1 无法兼容 3.0.7 以下版本 [vue#3493](https://github.com/vuejs/vue-next/issues/3493)
- 🐞 修复 Modal.confirm 缺失 closable ts 类型 [#3684](https://github.com/vueComponent/ant-design-vue/issues/3845)
- 🐞 修复 Upload 自定义 method 不生效问题 [#3843](https://github.com/vueComponent/ant-design-vue/issues/3843)

## 2.1.0

`2021-03-20`

- 🎉🎉🎉 新增 `Typography` 组件 [#3807](https://github.com/vueComponent/ant-design-vue/issues/3807)
- 🌟 Modal 方法新增关闭图标定制 [#3753](https://github.com/vueComponent/ant-design-vue/issues/3753)
- 🐞 修复缺失包含国际化的构建文件 [#3684](https://github.com/vueComponent/ant-design-vue/issues/3684)
- 🐞 修复 Drawer 销毁后报错问题 [#848d64](https://github.com/vueComponent/ant-design-vue/commit/848d6497e68c87566790dfa889a1913199a6699a)
- 🐞 修复 BackTop 在 KeepAlive 激活时，位置不对的问题 [#3803](https://github.com/vueComponent/ant-design-vue/issues/3803)
- 🐞 修复 TreeNode class 不生效问题 [#3822](https://github.com/vueComponent/ant-design-vue/issues/3822)
- 🐞 修复 Table tags 为数组时报错问题 [#3812](https://github.com/vueComponent/ant-design-vue/issues/3812)
- 🐞 修复 Table 自定义 filterIcon 时，触发排序问题 [#3819](https://github.com/vueComponent/ant-design-vue/issues/3819)
- 🐞 修复 Select 样式在 Form 下错位问题 [#3781](https://github.com/vueComponent/ant-design-vue/issues/3781)

## 2.0.1

`2021-02-27`

- 🌟 `Badge` 新增 `Ribbon` [#3681](https://github.com/vueComponent/ant-design-vue/issues/3681)
- 🌟 调整 `SearchInput` search 事件触发顺序 [#3725](https://github.com/vueComponent/ant-design-vue/issues/3725)
- 🐞 修复 `Table` 销毁时卡死问题 [#3531](https://github.com/vueComponent/ant-design-vue/issues/3531)
- 🐞 修复 `Menu` css 中引入了 less 文件问题 [#3678](https://github.com/vueComponent/ant-design-vue/issues/3678)
- 🐞 修复 `Alert` 自定义图标错位问题 [#3712](https://github.com/vueComponent/ant-design-vue/issues/3712)

## 2.0.0

`2021-02-06`

- 🎉🎉🎉 2.0 正式版发布
- 🎉🎉🎉 支持暗黑主题 [#3410](https://github.com/vueComponent/ant-design-vue/issues/3410)
- 🎉🎉🎉 新版文档上线，使用 Composition API 完全重构文档示例，提供 TS、JS 双版本源码
- 🌟 使用 Composition API 重构 `Alert` 组件 [#3654](https://github.com/vueComponent/ant-design-vue/pull/3654)
- 🌟 `Tooltip` 支持自定义颜色 [#3603](https://github.com/vueComponent/ant-design-vue/issues/3603)
- 🐞 修复 `TimePicker` 没有自动滚动到已选位置问题 [#ab7537](https://github.com/vueComponent/ant-design-vue/commit/ab75379f0c2f5e54ab7c348284a7391939ab5aaf)

## 2.0.0-rc.9

`2021-01-24`

- 🌟 `@ant-design/icons-vue` 升级至 6.0，默认使用 es module
- 🌟 `Tabs` 增加 `centered` 居中模式 [#3501](https://github.com/vueComponent/ant-design-vue/issues/3501)
- 🐞 `Progress` 添加 opacity 动画 [#3505](https://github.com/vueComponent/ant-design-vue/issues/3505)
- 🐞 修复 npm 安装时报错问题 [#3515](https://github.com/vueComponent/ant-design-vue/issues/3515)
- 🐞 修复 `Breadcrumn` 分割线不显示问题 [#3522](https://github.com/vueComponent/ant-design-vue/issues/3522)
- 🐞 修复 `Radio` 不受控问题 [#3517](https://github.com/vueComponent/ant-design-vue/issues/3517)
- 🐞 修复 `FormItem` 不换行问题 [#3538](https://github.com/vueComponent/ant-design-vue/issues/3538)
- 🐞 修复 `Carousel` `pauseOnDotsHover` 不生效问题 [#3519](https://github.com/vueComponent/ant-design-vue/issues/3519)
- 🐞 修复 `Input.Search` `class` 不生效问题 [#3541](https://github.com/vueComponent/ant-design-vue/issues/3541)
- 🐞 修复 `InputNumber` 在微软输入法下多次触发 change 事件问题 [#3550](https://github.com/vueComponent/ant-design-vue/issues/3550)
- 🐞 修复 `Tabs` disabled 状态下依然可以通过键盘切换问题 [#3575](https://github.com/vueComponent/ant-design-vue/issues/3575)
- 🐞 修复 `Switch` 在 table 中切换不生效问题 [#3512](https://github.com/vueComponent/ant-design-vue/issues/3512)

## 2.0.0-rc.8

`2021-01-07`

- 🌟 支持 Vite 2 [#3490](https://github.com/vueComponent/ant-design-vue/issues/3490)
- 🌟 使用 Composition API 重构 Affix 组件 [#3447](https://github.com/vueComponent/ant-design-vue/issues/3447)
- 🐞 修复 Image 组件类型定义错误 [#3488](https://github.com/vueComponent/ant-design-vue/issues/3488)
- 🐞 升级 icons-vue 修复 IconFont 组件类型错误 [#3474](https://github.com/vueComponent/ant-design-vue/issues/3474)
- 🐞 修复 less 4 下 Tooltip 箭头样式错误问题 [#3477](https://github.com/vueComponent/ant-design-vue/issues/3477)
- 🐞 修复 Vue 3.0.5 下 DatePicker 类型定义解析错误问题 [#bf7c62](https://github.com/vueComponent/ant-design-vue/commit/bf7c62f457fc14624881f69c5baf9a62219383f7)

## 2.0.0-rc.7

`2020-12-28`

- 🐞 修复 Switch `change`、`click` 不生效问题 [#3453](https://github.com/vueComponent/ant-design-vue/issues/3453)

## 2.0.0-rc.6

`2020-12-27`

- 🌟 支持 Less 4 [#3449](https://github.com/vueComponent/ant-design-vue/issues/3449)
- 🌟 新增 Image 组件 [#3235](https://github.com/vueComponent/ant-design-vue/issues/3235)
- 🌟 函数式组件，添加 displayName 属性 [#3445](https://github.com/vueComponent/ant-design-vue/issues/3445)
- 🐞 Message 新增自定义 class style 功能 [#3443](https://github.com/vueComponent/ant-design-vue/issues/3443)
- 🐞 修复 Tabs 组件初始 disabled 状态没生效 [#3366](https://github.com/vueComponent/ant-design-vue/issues/3366)
- 🐞 修复 Slider 精准度问题 [#3346](https://github.com/vueComponent/ant-design-vue/issues/3346)
- 🐞 修复 Select 滚动高度不正确问题 [#3419](https://github.com/vueComponent/ant-design-vue/issues/3419)
- 🐞 修复 Input small 大小时，高度偏大 2px 问题 [#3396](https://github.com/vueComponent/ant-design-vue/issues/3396)
- 🐞 修复 TreeSelect 触发两次 change 事件问题
- 🐞 修复 TreeSelect 通过 slot 定义 title 死循环问题
- 🐞 修复 Drawer handle slot 触发两次 click 事件问题
- 🌟 新增 Checkbox、Switch 事件声明

## 2.0.0-rc.5

`2020-12-13`

- 🐞 修复 Drawer 组件控制台输出 this.dom 未定义的 warning 问题
- 🐞 修复 Menu 在 Vue 3.0.3 及以上版本，出现显示错乱问题 [#3354](https://github.com/vueComponent/ant-design-vue/issues/3354)

## 2.0.0-rc.4

`2020-12-10`

- 🌟 Input.Password 支持自定义图标 [#3320](https://github.com/vueComponent/ant-design-vue/issues/3320)
- 🐞 修复 Select Option click 事件不触发问题 [#4ea00d](https://github.com/vueComponent/ant-design-vue/commit/4ea00d3a70d0afd7bea07f814df03ab7d0b25ebd)
- 🐞 修复 Menu 超出宽度后 dark 主题不生效问题 [#10f35a](https://github.com/vueComponent/ant-design-vue/commit/10f35a1fa510de91e9484b07fcfff253920cee29)
- 🐞 修复 Menu 控制台 vue key some waring [#520d6a](https://github.com/vueComponent/ant-design-vue/commit/520d6a5e85eb391e5294211c9d7b2ea598c59119)
- 🐞 移除控制台 passive 提示日志 [#8d1669](https://github.com/vueComponent/ant-design-vue/commit/8d1669b8896d84a67c61d3a00d0b13c42d70f30f)

## 2.0.0-rc.3

`2020-12-05`

- 🐞 修复函数式组件在 Vue 3.0.3 下报类型错误问题 [#f5cf7e](https://github.com/vueComponent/ant-design-vue/commit/f5cf7e0920a51f0ac024046996c99260aa41becf)
- 🐞 修复 Menu 超出宽度后显示错误问题 [#3262](https://github.com/vueComponent/ant-design-vue/issues/3262)
- 🐞 修复 Menu subMenuOpenDelay subMenuCloseDelay 不生效问题 [#3291](https://github.com/vueComponent/ant-design-vue/pull/3291)
- 🐞 修复 TreeSelect 堆栈溢出问题 [#28aeea](https://github.com/vueComponent/ant-design-vue/commit/28aeea6f0b142ed68950a3738f7cf2c1581a7a5b)
- 🐞 修复 Input 自定义 style class 被覆盖问题 [#3273](https://github.com/vueComponent/ant-design-vue/issues/3273)
- 🐞 修复 InputNumber 在生产环境下 parse 错误 [#3249](https://github.com/vueComponent/ant-design-vue/issues/3249)

## 2.0.0-rc.2

`2020-11-24`

- 🌟 优化 Menu 性能，默认开启懒加载 [#3243](https://github.com/vueComponent/ant-design-vue/pull/3243)
- 🌟 Tag 支持通过 slot 定义 icon [#3185](https://github.com/vueComponent/ant-design-vue/pull/3185)
- 🌟 small 类型的 table 改成无边框 [#3221](https://github.com/vueComponent/ant-design-vue/issues/3221)
- 🌟 @ant-design/icons-vue 升级到 5.1.6，支持 SSR，支持 spin 属性简写
- 🐞 修复 Alert 的关闭按钮在 Safari 下样式问题 [#3184](https://github.com/vueComponent/ant-design-vue/issues/3184)
- 🐞 修复 Notification top 属性类型错误问题 [#3187](https://github.com/vueComponent/ant-design-vue/issues/3187)
- 🐞 修复 DirectoryTree 自定义图标不生效问题 [#3183](https://github.com/vueComponent/ant-design-vue/issues/3183)
- 🐞 修复 Button loading delay 不生效问题 [#3194](https://github.com/vueComponent/ant-design-vue/issues/3194)
- 💄 Select optionFilterProp 不在支持按照 children 来过滤 [#3204](https://github.com/vueComponent/ant-design-vue/issues/3204)
- 🐞 修复 Select labelInValue 时报错问题 [#3216](https://github.com/vueComponent/ant-design-vue/issues/3216)
- 🐞 修复 ConfigProvider transformCellText 丢失问题 [#3206](https://github.com/vueComponent/ant-design-vue/issues/3206)
- 🐞 修复 Dropdown Button 混合使用时，样式错乱问题 [#3244](https://github.com/vueComponent/ant-design-vue/issues/3244)
- 🐞 修复 RangePicker 自定义宽度失效问题 [#3244](https://github.com/vueComponent/ant-design-vue/issues/3245)
- 🐞 修复多处 Ts 类型错误或缺失问题

## 2.0.0-rc.1

`2020-11-14`

- 🎉🎉🎉
- 🌟 Menu 取消默认懒加载，提升首次动画效果，优化贝塞尔曲线函数，更加流畅 [#3177](https://github.com/vueComponent/ant-design-vue/pull/3177)
- 🐞 修复 Select 搜索功能失效问题 [#3144](https://github.com/vueComponent/ant-design-vue/issues/3144)
- 🐞 修复 Drawer 组件没有自动 focus，导致不能直接通过 ESC 按键关闭 [#3148](https://github.com/vueComponent/ant-design-vue/issues/3148)
- 🐞 修复 Popover 弹出元素位置不正确问题 [#3147](https://github.com/vueComponent/ant-design-vue/issues/3147)
- 🐞 修复 CountDown 不更新问题 [#3170](https://github.com/vueComponent/ant-design-vue/pull/3170)
- 🐞 修复多处 Ts 类型错误或缺失问题

## 2.0.0-beta.15

`2020-11-08`

- 🌟 优化 Menu 动画，更加流畅 [#3095](https://github.com/vueComponent/ant-design-vue/issues/3095)
- 🌟 优化 VirtualList，避免无效 render [#2e61e9](https://github.com/vueComponent/ant-design-vue/commit/2e61e9cb502f2bb6910f59abfb483fd2517e594f)
- 🐞 修复 Menu overflowedIndicator 未生效问题 [#689113](https://github.com/vueComponent/ant-design-vue/commit/689113b3c9c19e929607567a4c8252c6511bff5c)
- 🐞 Select
  - 修复 dropdownRender 不支持 slot 问题 [#3098](https://github.com/vueComponent/ant-design-vue/issues/3098)
  - 修复 tag 模式下，空值异常问题 [#3100](https://github.com/vueComponent/ant-design-vue/issues/3100)
  - 修复单选模式下选择项不更新问题 [#3099](https://github.com/vueComponent/ant-design-vue/issues/3099)
  - 修复特殊场景下 foucs 状态不生效问题 [#3099](https://github.com/vueComponent/ant-design-vue/issues/3099)
- 🐞 修复 DatePicker 默认格式化失效问题 [#3091](https://github.com/vueComponent/ant-design-vue/issues/3091)
- 🐞 修复 Table customRow 配置事件不生效问题 [#3121](https://github.com/vueComponent/ant-design-vue/issues/3121)
- 🐞 修复 TreeSelect 搜索框样式错乱问题 [ee4cd3c](https://github.com/vueComponent/ant-design-vue/commit/ ee4cd3c35a84658cbbb148ce368bc247a927d528)
- 🐞 修复 Ts 类型错误或缺失问题

## 2.0.0-beta.13

`2020-11-02`

- 🐞 修复 npm install 报错问题 [#3080](https://github.com/vueComponent/ant-design-vue/issues/3080)
- 🐞 修复 Select maxPlaceHolder 显示错误问题 [#3085](https://github.com/vueComponent/ant-design-vue/issues/3085)
- 🐞 修复弹窗类组件，弹出位置不更新问题 [#3085](https://github.com/vueComponent/ant-design-vue/issues/3085)
- 🐞 修复 Table 数据为空时的 warning 问题 [#3082](https://github.com/vueComponent/ant-design-vue/issues/3082)
- 🐞 修复 Input 在 Form 中显示多个边框问题 [#3084](https://github.com/vueComponent/ant-design-vue/issues/3084)

## 2.0.0-beta.12

`2020-11-01`

- 🐞 修复 dist/antd.css 缺失组件样式问题 [#3069](https://github.com/vueComponent/ant-design-vue/issues/3069)
- 🐞 修复 Input 样式问题 [#3074](https://github.com/vueComponent/ant-design-vue/issues/3074)
- 🐞 修复 Form layout="vertical" 样式问题 [#3075](https://github.com/vueComponent/ant-design-vue/issues/3075)
- 🐞 修复 Select 无法打开弹窗问题 [#3070](https://github.com/vueComponent/ant-design-vue/issues/3070)

## 2.0.0-beta.11

`2020-10-30`

- 🎉🎉🎉 重构 Select、AutoComplete 组件，支持虚拟列表，性能大幅提升
- 🔥🔥🔥 使用 Typescript 重构所有组件，类型支持更加友好
- 🔥 优化底层动画组件，性能更好，更流畅
- 🌟 Textarea 组件添加 showCount 支持统计字数功能
- 🌟 递归 Menu 组件，支持任意嵌套其他元素 [#1452](https://github.com/vueComponent/ant-design-vue/issues/1452)
- 🇮🇪 添加爱尔兰语国际化支持
- 🐞 修复 webpack 5 兼容问题。
- 🐞 修复 Upload method 属性不生效问题 [#2837](https://github.com/vueComponent/ant-design-vue/issues/2837)
- 🐞 修复 Table 组件 filter 不支持 number 类型问题 [#3052](https://github.com/vueComponent/ant-design-vue/issues/3052)
- 🐞 修复 Table 固定列 ellipsis 不生效问题 [#2916](https://github.com/vueComponent/ant-design-vue/issues/2916)
- 🐞 修复 Table 自定义 expandIcon 不生效问题 [#3013](https://github.com/vueComponent/ant-design-vue/issues/3013)
- 🐞 修复 TreeSelect 不能自定义 slot 问题 [#2827](https://github.com/vueComponent/ant-design-vue/issues/2827)
- 🛎 更改 Avatar 的 srcSet 为 srcset

## 2.0.0-beta.10

`2020-09-24`

- 🌟 更新 Vue 依赖到 release 版本
- 🐞 修复 Menu 在 Layout 中不折叠问题 [#2819](https://github.com/vueComponent/ant-design-vue/issues/2819)
- 🐞 修复 Tabs 切换时出现 warning 问题 [#2865](https://github.com/vueComponent/ant-design-vue/issues/2865)
- 🐞 修复输入框在 compositionend 时不触发 change 事件问题
- 🐞 修复 Upload 上传按钮不消失问题 [#2884](https://github.com/vueComponent/ant-design-vue/issues/2884)
- 🐞 修复 Upload 自定义 method 不生效问题 [#2837](https://github.com/vueComponent/ant-design-vue/issues/2837)
- 🐞 修复若干 ts 类型错误

## 2.0.0-beta.8

- 🐞 修复 ts 类型错误

## 2.0.0-beta.7

- 🐞 修复 Descriptions Item 不支持 v-for 问题 [#2793](https://github.com/vueComponent/ant-design-vue/issues/2793)
- 🐞 修复 Modal button loading 效果不生效问题 [9257c1](https://github.com/vueComponent/ant-design-vue/commit/9257c1ea685db4339239589153aee3189d0434fe)
- 🐞 修复 Steps 组件使用 v-model 时不可点击的问题 [ec7309](https://github.com/vueComponent/ant-design-vue/commit/ec73097d9b6ea8e2f2942ac28853c19191ca3298)
- 🌟 Checkbox、Radio 添加事件声明
- 🐞 修复 ts 类型错误 [802446](https://github.com/vueComponent/ant-design-vue/commit/8024469b8832cfc4fe85498b639bfb48820531aa)

## 2.0.0-beta.6

- 🐞 修复 TreeSelectNode 子组件 TreeSelectNode 没有注册的问题

## 2.0.0-beta.5

- 🔥 支持 Vite。

## 2.0.0-beta.4

- 🌟 移除不再使用的 polyfill
- 🐞 修复 `Modal` afterClose 调用两次的问题
- 🐞 补充 ts 类型文件缺少原生属性的声明

## 2.0.0-beta.3

- 🔥 支持 Typescript。
- 🔥 新增 `Space` 组件。
- 🐞 修复部分组件无法使用 css scope 问题 [4bdb24](https://github.com/vueComponent/ant-design-vue/commit/4bdb241aa674b50fafa29b3b98e291643f2a06cc)。
- 🐞 修复 `List.Meta` 注册失败的问题 [03a42a](https://github.com/vueComponent/ant-design-vue/commit/03a42a5b35e7d42a39aedb1aba8346995be2c27e)
- 🐞 修复 `Table` 固定列情况下错位问题 [#1493](https://github.com/vueComponent/ant-design-vue/issues/1493)
- 🐞 修复 `Button` 没有垂直居中的问题 [bd71e3](https://github.com/vueComponent/ant-design-vue/commit/bd71e3806b73881f9a95028982d17a10b2cd0b5c)
- 🐞 修复 `Tabs` 多次出发 `change` 事件问题 [8ed937](https://github.com/vueComponent/ant-design-vue/commit/8ed937344a57142a575e5272f50933c9c4459a43)

## 2.0.0-beta.2

`2020-08-14`

### 设计规范调整

- 行高从 `1.5`(`21px`) 调整为 `1.5715`(`22px`)。
- 基础圆角调整，由`4px` 改为 `2px`。
- 分割线颜色明度降低，由 `#E8E8E8` 改为 `#F0F0F0`。
- Table 默认背景颜色从透明修改为白色。

### 兼容性调整

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
  - v-model 改成 v-model:value 的组件有: Radio、Mentions、CheckboxGroup、Rate、DatePicker
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
    <template v-slot:icon><smile-outlined /></template>
  </a-buttom>
</template>
<script>
import SmileOutlined from '@ant-design/icons-vue/SmileOutlined';
export default {
  components: {
    SmileOutlined
  }
}
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
// eslint-disable-next-line no-undef,no-unused-vars
validateFields((err, value) => {
  if (!err) {
    // Do something with value
  }
});
```

改成

```js
// v2
// eslint-disable-next-line no-undef,no-unused-vars
validateFields().then(values => {
  // Do something with value
});
```

## 1.x

去 [GitHub](https://github.com/vueComponent/ant-design-vue/blob/1.x/CHANGELOG.zh-CN.md) 查看 `0.x` 到 `1.x` 的 Change Log。
