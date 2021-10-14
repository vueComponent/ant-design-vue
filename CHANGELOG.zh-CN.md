# 更新日志

`ant-design-vue` 严格遵循 [Semantic Versioning 2.0.0](http://semver.org/lang/zh-CN/) 语义化版本规范。

#### 发布周期

- 修订版本号：每周末会进行日常 bugfix 更新。（如果有紧急的 bugfix，则任何时候都可发布）
- 次版本号：每月发布一个带有新特性的向下兼容的版本。
- 主版本号：含有破坏性更新和新特性，不在发布周期内。

---

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

- 文档开源，如果您的公司不能外网访问，可以私有化部署，但不可以传播，不可以商业化
- 移除了 Transfer 的 `lazy` 属性，它并没有起到真正的优化效果。
- 移除了 Select 的 `combobox` 模式，请使用 `AutoComplete` 替代。
- 废弃 Button.Group，请使用 `Space` 代替。
- `Timeline.Item` 新增 label
- `Steps` 新增 `responsive`、`percent`
- `Collapse` 新增 `ghost`、`collapsible`
- `Popconfirm` 新增 `cancelButton`、`okButton`, 以及 `esc` 按键隐藏
- `ConfigProvider` 新增 ConfigProvider.config，定义 `Modal.xxx` `message` `notification` 的配置
- `Tree` `TreeSlelct`

  - 新增了虚拟滚动，废弃使用 `a-tree-node` `a-tree-select-node` 构建节点，使用 `treeData` 属性替代，提升组件性能
  - 废弃 `scopedSlots` `slots` 自定义渲染节点，使用 `v-slot:title` 替换，提升易用性，避免插槽配置膨胀，同时也避免了插槽冲突问题

- `Table`

  - 移除了 Table 的 `rowSelection.hideDefaultSelections` 属性，请在 `rowSelection.selections` 中使用 `SELECTION_ALL` 和 `SELECTION_INVERT` 替代，[自定义选择项](/components/table/#components-table-demo-row-selection-custom)。
  - 移除了 Column slots，分别使用 `v-slot:headerCell` `v-slot:headerCell` `v-slot:bodyCell` `v-slot:customFilterDropdown` `v-slot:customFilterIcon` 替换，提升易用性，避免插槽配置膨胀，同时也避免了插槽冲突问题
  - 新增 expandFixed 控制展开图标是否固定
  - 新增 showSorterTooltip 表头是否显示下一次排序的 tooltip 提示。
  - 新增 sticky 用于设置粘性头部和滚动条
  - 新增 rowExpandable 用于设置是否允许行展开
  - 新增插槽 headerCell 用于个性化头部单元格
  - 新增插槽 bodyCell 用于个性化单元格
  - 新增插槽 customFilterDropdown 用于自定义筛选菜单，需要配合 `column.customFilterDropdown` 使用
  - 新增插槽 customFilterIcon 用于自定义筛选图标
  - 新增插槽 emptyText 用于自定义空数据时的显示内容
  - 新增插槽 summary 用于总结栏

- `DatePicker` `TimePicker` `Calendar`

  - 默认使用更加轻量级的 dayjs 替换 momentjs，如果你的项目过大，使用了大量的 momentjs 的方法，你可以参考文档[自定义时间库](/docs/vue/replace-date-cn)，替换成 momentjs。
  - UI 交互调整，对其 antd 4.x 交互规范

- `Form` 这次更新主要目标是提升性能，如果你没有自定义表单控件，几乎可以忽略该部分

  - 自 3.0 版本以后，Form.Item 不再劫持子元素，而是通过 provider / inject 依赖注入的方式进行自动校验，这种方式可以提高组件性能，子元素也不会限制个数，同样子元素也可以是进一步封装的高级组件。你可以参考[自定义表单控件示例](#components-form-demo-customized-form-controls)

    但它同样会有一些缺点：

    1、自定义组件如果希望 Form.Item 进行校验展示，你需要 `const {id, onFieldChange, onFieldBlur} = useFormItemContext()` 注入，并调用相应的方法。

    2、一个 Form.Item 只能收集一个表单项的数据，如果有多个表单项，会导致收集错乱，例如，

    ```html
    <a-form-item>
      <a-input name="a"></a-input>
      <a-input name="b"></a-input>
    </a-form-item>
    ```

    如上 Form.Item 并不知道需要收集 `name="a"` 还是 `name=`b``，你可以通过如下三种方式去解决此类问题：

    第一种，使用多个 `a-form-item`:

    ```html
    <a-form-item>
      <a-input name="a"></a-input>
      <a-form-item><a-input name="b"></a-input></a-form-item>
    </a-form-item>
    ```

    第二种，使用自定义组件包裹，并在自定义组件中调用 `useFormItemContext`，相当于把多个表单项合并成了一个

    ```html
    <script>
      // 自定义组件
      import { Form } from 'ant-desing-vue';
      export default {
        setup() {
          const formItemContext = Form.useFormItemContext();
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
