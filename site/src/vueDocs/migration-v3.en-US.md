This document will help you upgrade from ant-design-vue `2.x` version to ant-design-vue `3.x` version.

The 2.x version is a compatible version developed for compatibility with Vue 3. It does not bring many new features, and most of the API changes are only for better compatibility with Vue 3. The 3.x version has greatly improved performance, ease of use, and functions. After the 3.x version is stable, we will archive the 2.x version. It is recommended that you upgrade to the 3.x version as soon as possible. Although there are many changes, they are basically compatible. You can upgrade gradually according to the warnings given by the console.

## Upgrade preparation

1. Please upgrade to the latest version of 2.x first, and remove/modify related APIs according to the warning information on the console. It is recommended to check the historical Change Log of 2.x first, which will not be detailed here.
2. Upgrade the project to Vue 3.2 and above.

## 3.0 What are the incompatible changes

### Design specification adjustment

- The font color is changed from `rgba(0, 0, 0, 0.65)` to `rgba(0, 0, 0, 0.85)`.
- The selected color of some components is uniformly changed to `@blue-1: #E6F7FF`, and the corresponding color of `hover` is changed to `@gray-2: #FAFAFA`.
- Error color value adjustment, changed from `@red-5: #F5222D` to `@red-5: #FF4D4F`.
- DatePicker interactive redo, the panel and the input box are separated, the range selection can now select the start and end time separately.

#### Removed API

- Removed the `lazy` attribute of Transfer, it does not have a real optimization effect.
- Removed the `combobox` mode of Select, please use `AutoComplete` instead.
- Deprecated Button.Group, please use `Space` instead.
- `DatePicker` `TimePicker` `Calendar` remove momentjs, please use dayjs instead
- `Tree`, `TreeSlelct`
  - Deprecated the use of `a-tree-node` and `a-tree-select-node` to construct nodes, use the `treeData` property instead
  - Deprecated `scopedSlots` `slots` custom rendering node, use `v-slot:title` instead
- `Table`
  - Removed the `rowSelection.hideDefaultSelections` property of Table, please use `SELECTION_ALL` and `SELECTION_INVERT` in `rowSelection.selections` instead, [custom options](/components/table/#components-table-demo- row-selection-custom).
  - Removed Column slots and replaced them with `v-slot:headerCell` `v-slot:headerCell` `v-slot:bodyCell` `v-slot:customFilterDropdown` `v-slot:customFilterIcon`

#### Component refactoring

In order to make the components have better performance and maintainability, we have used TS + Composition Api to refactor almost all components. There are still very few components that have not been refactored. Such components will be refactored gradually in the future, and the rest There will be no destructive updates to the components, so there is no need to worry about future upgrade costs.

Major updates after the 3.0 version refactoring include `Tree` `TreeSlelct` `DatePicker` `TimePicker` `Calendar` `Form` `Table`, other components also have corresponding function updates, you can check ChangeLog for further details

- `Tree` `TreeSlelct`

  - Added virtual scrolling, discarded using `a-tree-node` `a-tree-select-node` to build nodes, using `treeData` property instead to improve component performance
  - Deprecated `scopedSlots` `slots` custom rendering node, and replace it with `v-slot:title` to improve ease of use, avoid slot configuration expansion, and also avoid slot conflicts

- `Table`

  - Removed the `rowSelection.hideDefaultSelections` property of Table, please use `SELECTION_ALL` and `SELECTION_INVERT` in `rowSelection.selections` instead, [custom options](/components/table/#components-table-demo- row-selection-custom).
  - Removed Column slots and replaced them with `v-slot:headerCell` `v-slot:headerCell` `v-slot:bodyCell` `v-slot:customFilterDropdown` `v-slot:customFilterIcon` to improve ease of use , To avoid slot configuration expansion, but also to avoid the problem of slot conflicts
  - Added expandFixed to control whether the expanded icon is fixed
  - Added the showSorterTooltip header whether to display the tooltip for the next sort.
  - Added sticky for setting sticky head and scroll bar
  - Added rowExpandable to set whether to allow row expansion
  - New slot headerCell is used to personalize the header cell
  - Added slot bodyCell for personalized cell
  - New slot customFilterDropdown is used to customize the filter menu, which needs to be used with `column.customFilterDropdown`
  - Added slot customFilterIcon for custom filter icons
  - New slot emptyText is used to customize the display content of empty data
  - Added slot summary for the summary column

- `DatePicker` `TimePicker` `Calendar`

  - By default, a more lightweight dayjs is used to replace momentjs. If your project is too large and uses a lot of momentjs methods, you can refer to the document [Custom Time Library](/docs/vue/replace-date-cn), Replace with momentjs.
  - UI interaction adjustment, its antd 4.x interaction specification

- `Form` The main goal of this update is to improve performance. If you don't have custom form controls, you can almost ignore this part

  - Since version 3.0, Form.Item no longer hijacks child elements, but automatically checks through provider/inject dependency injection. This method can improve component performance, and there is no limit to the number of child elements. The same is true for child elements. It can be a high-level component that is further encapsulated.

    You can reference [Customized Form Controls](#components-form-demo-customized-form-controls)

    But it also has some disadvantages:

    1. If the custom component wants Form.Item to be verified and displayed, you need to inject `const {id, onFieldChange, onFieldBlur} = useFormItemContext()` and call the corresponding method.

    2. A Form.Item can only collect the data of one form item. If there are multiple form items, it will cause collection confusion, for example,

    ```html
    <a-form-item>
      <a-input name="a"></a-input>
      <a-input name="b"></a-input>
    </a-form-item>
    ```

    As above Form.Item does not know whether to collect `name="a"` or `name=`b``, you can solve this kind of problem in the following two ways:

    The first is to use multiple `a-form-item`:

    ```html
    <a-form-item>
      <a-input name="a"></a-input>
      <a-form-item><a-input name="b"></a-input></a-form-item>
    </a-form-item>
    ```

    The second way is to wrap it with a custom component and call `useFormItemContext` in the custom component, It is equivalent to merging multiple form items into one.

    ```html
    <script>
      // custom component
      import { Form } from 'ant-desing-vue';
      export default {
        name: 'custom-name',
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

    Third, the component library provides an `a-form-item-rest` component, which will prevent data collection. You can put form items that do not need to be collected and verified into this component. It is the same as the first This method is very similar, but it does not generate additional dom nodes.

    ```html
    <a-form-item>
      <a-input name="a"></a-input>
      <a-form-item-rest><a-input name="b"></a-input></a-form-item-rest>
    </a-form-item>
    ```

## Encounter problems

V3 has made a lot of detailed improvements and refactorings. We have collected all known incompatible changes and related effects as much as possible, but there may still be some scenarios that we have not considered. If you encounter problems during the upgrade process, please go to [GitHub issues](https://vuecomponent.github.io/issue-helper/) for feedback. We will respond as soon as possible and improve this document accordingly.
