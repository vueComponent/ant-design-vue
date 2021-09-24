本文档将帮助你从 ant-design-vue `2.x` 版本升级到 ant-design-vue `3.x` 版本。

2.x 版本是为了兼容 Vue 3 开发的兼容版本，他并没有带来很多新的特性，大多数的 API 改变也只是为了更好的兼容 Vue 3。 3.x 版本在性能、易用性、功能上都有了很大的提升，3.x 版本稳定后，我们会归档 2.x 版本，建议您尽快升级 3.x 版本。虽然有很多改动，但基本都做了兼容，你可以按照控制台给出的警告逐步升级。

## 升级准备

1. 请先升级到 2.x 的最新版本，按照控制台 warning 信息移除/修改相关的 API，建议优先查看 2.x 的历史 Change Log，在这里就不再详述。
2. 升级项目 Vue 3.2 以上。
3. 您和 3.0 只有这份文档的距离，相信我，今日加的班，是为了明天摸更多的鱼。

## 3.0 有哪些不兼容的变化

### 设计规范调整

- 字体颜色从 `rgba(0, 0, 0, 0.65)` 调深为 `rgba(0, 0, 0, 0.85)`。
- 部分组件选中颜色统一改为 `@blue-1: #E6F7FF`，对应 `hover` 颜色改为 `@gray-2: #FAFAFA`。
- 报错色色值调整，由 `@red-5: #F5222D` 改为 `@red-5: #FF4D4F`。
- DatePicker 交互重做，面板和输入框分离，范围选择现可单独选择开始和结束时间。

#### 移除的 API

- 移除了 Transfer 的 `lazy` 属性，它并没有起到真正的优化效果。
- 移除了 Select 的 `combobox` 模式，请使用 `AutoComplete` 替代。
- 废弃 Button.Group，请使用 `Space` 代替。
- `DatePicker` `TimePicker` `Calendar` 移除 momentjs，请使用 dayjs 替换
- `Tree`、`TreeSlelct`
  - 废弃使用 `a-tree-node` `a-tree-select-node` 构建节点，使用 `treeData` 属性替代
  - 废弃 `scopedSlots` `slots` 自定义渲染节点，使用 `v-slot:title` 替换
- `Table`
  - 移除了 Table 的 `rowSelection.hideDefaultSelections` 属性，请在 `rowSelection.selections` 中使用 `SELECTION_ALL` 和 `SELECTION_INVERT` 替代，[自定义选择项](/components/table/#components-table-demo-row-selection-custom)。
  - 移除了 Column slots，分别使用 `v-slot:headerCell` `v-slot:headerCell` `v-slot:bodyCell` `v-slot:customFilterDropdown` `v-slot:customFilterIcon` 替换

#### 组件重构

为了让组件拥有更好的性能和可维护性，我们几乎使用 TS + Composition Api 重构了所有组件，目前还有极个别的组件没有重构，这类组件会在接下来逐步重构，剩余的组件不会有破坏性更新，所以不用担心未来的升级成本。

3.0 版本重构后较大的更新有 `Tree` `TreeSlelct` `DatePicker` `TimePicker` `Calendar` `Form` `Table`，其它组件也有相应功能的更新，你可以查看 ChangeLog 进一步了解详情

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

## 遇到问题

v3 做了非常多的细节改进和重构，我们尽可能收集了已知的所有不兼容变化和相关影响，但是有可能还是有一些场景我们没有考虑到。如果你在升级过程中遇到了问题，请到 [GitHub issues](https://vuecomponent.github.io/issue-helper/) 进行反馈。我们会尽快响应和相应改进这篇文档。
