# Change Log

`ant-design-vue` strictly follows [Semantic Versioning 2.0.0](http://semver.org/).

#### Release Schedule

* Weekly release: patch version at the end of every week for routine bugfix (anytime for urgent bugfix).
* Monthly release: minor version for new features.
* Major version release is not included in this schedule for breaking change and new features.

---

## 1.3.15
`2019-08-17`
- 🐞 Fix `Select` component cannot scroll under IE [#999](https://github.com/vueComponent/ant-design-vue/issues/999)
- 🐞 Fix `Form` `initialValue` warning  [#1076](https://github.com/vueComponent/ant-design-vue/issues/1076)
- 🐞 Fix `Form` error when verifying `Number` type [#1090](https://github.com/vueComponent/ant-design-vue/issues/1090)

## 1.3.14
`2019-08-12`
- 🐞 Fix `MenuItem` parsing array `class` incorrect question [#1009](https://github.com/vueComponent/ant-design-vue/issues/1009)
- 🐞 Fix an error when npm install [#997](https://github.com/vueComponent/ant-design-vue/issues/997)
- 🐞 Fix `Select` component cannot scroll under IE [#999] (https://github.com/vueComponent/ant-design-vue/issues/999)
- 🐞 Fix `Select` component does not trigger focus event problem [#999] (https://github.com/vueComponent/ant-design-vue/issues/999)
- 🐞 Fix `DropdownButton` `size` attribute does not work [#71b7c9](https://github.com/vueComponent/ant-design-vue/commit/71b7c9d33895f55694e28aaba4b2cfca7228771b)
- 🐞 Fix `Table` component does not support vue 2.6 v-slot syntax problem [#1058](https://github.com/vueComponent/ant-design-vue/issues/1058)
- 🌟 `Popover` add `builtinPlacements` attribute [#1073](https://github.com/vueComponent/ant-design-vue/issues/1073)
- 🌟 `Button` support `link` type [#1077](https://github.com/vueComponent/ant-design-vue/pull/1077)
- 🌟 `Modal.confirm` `title` and `content` support function [#824](https://github.com/vueComponent/ant-design-vue/issues/824)

## 1.3.13
`2019-07-22`
- 🐞 Fix `dist` missing `antd.less` file problem [#995](https://github.com/vueComponent/ant-design-vue/issues/995)

## 1.3.12
`2019-07-22`
- 🐞 `package.json` `files` add `scripts`

## 1.3.11
`2019-07-22`

- Dropdown
  - 🐞 Uodate disable style [#912](https://github.com/vueComponent/ant-design-vue/pull/912) [#921](https://github.com/vueComponent/ant-design-vue/pull/921)
  - 🐞 Fix `SubMenu` flashing problem [#975](https://github.com/vueComponent/ant-design-vue/issues/970)
- 🌟 `AutoComplete` `Cascader` `DatePicker` `DropDown` `Select` `TimePicker` add an instance of the popup reference `popupRef`  [f9373e](https://github.com/vueComponent/ant-design-vue/commit/f9373e44ce229ab0ba94ababbd686e6ad6e9f10f)
- 🐞 Fix `DatePicker` can not open when placeholder is chinese at ie 10 and 11 [#865](https://github.com/vueComponent/ant-design-vue/issues/865)
- 🌟 `DatePicker` add custom render trigger [#957](https://github.com/vueComponent/ant-design-vue/pull/957)
- 🌟 `@ant-design/icons-vue` update to `^2.0.0`
- 🌟 `Icon` add `focusable="false"` [#924](https://github.com/vueComponent/ant-design-vue/issues/924)
- 🐞 Fix custom `Form` prompts for custom components. `warning` problem [#915](https://github.com/vueComponent/ant-design-vue/issues/915)
- 🐞 Fix `FormItem` `v-decorator` error [#930](https://github.com/vueComponent/ant-design-vue/issues/930)
- 🐞 Fixed an issue where the `Upload` component reported an error in `form.resetFields()` [#929](https://github.com/vueComponent/ant-design-vue/pull/929)
- 🐞 Fix `Select` shows bounce problem [#970](https://github.com/vueComponent/ant-design-vue/issues/970)
- 🐞 Fix TypeScript type definitions.

## 1.3.10
`2019-06-11`
- 🐞 Remove useless `module.export` of package. [#850](https://github.com/vueComponent/ant-design-vue/issues/850)

## 1.3.9
`2019-05-26`
- 🐞 Fix `TreeSelect` without `dataRef` [#712](https://github.com/vueComponent/ant-design-vue/issues/712)
- 🌟 `Tooltip` add `destroyTooltipOnHide` to identify whether to destroy tooltip after hiding [#727](https://github.com/vueComponent/ant-design-vue/issues/727)
- 🐞 Fix `Avatar` does not update the problem when setting `src` dynamically [#731](https://github.com/vueComponent/ant-design-vue/issues/731)
- 🐞 Fix `LocaleProvider` change `moment` language does not work [28b7a6](https://github.com/vueComponent/ant-design-vue/commit/28b7a68dc48a0a994e98063d462b99380e3ee547)
- 🌟 `Modal.confirm` add `closable` configuration [#798](https://github.com/vueComponent/ant-design-vue/pull/798)
- 🐞 Fixed a problem when `Select` custom `dropdownRender` was not automatically closed [#644](https://github.com/vueComponent/ant-design-vue/issues/644)
- 🐞 Fix the problem of removing Dom error under ie9, no need to introduce polyfill separately [#705](https://github.com/vueComponent/ant-design-vue/issues/705)
- 🐞 Fix `Input.Search` repeat mount id problem [#726](https://github.com/vueComponent/ant-design-vue/issues/726)
- 🐞 Fix `Table` does not work when customizing expandIcon using function form [#751](https://github.com/vueComponent/ant-design-vue/issues/751)
- 🐞 Fix `Icon` `extraCommonProps` property does not work [#737](https://github.com/vueComponent/ant-design-vue/issues/737)
- 🐞 Fix `DirectoryTree` expandAction="doubleclick" does not work [#745](https://github.com/vueComponent/ant-design-vue/issues/745)

## 1.3.8
`2019-04-04`
- 🐞 Fix `Table` unclickable problem under IE [#504](https://github.com/vueComponent/ant-design-vue/issues/504)
- 🐞 Fix `Table` Header is not aligned under Firefox [#579](https://github.com/vueComponent/ant-design-vue/issues/579)
- 🌟 Drawer `Drawer` add custom `handel`
- 🐞 Fix TypeScript type definitions.

## 1.3.7
`2019-03-18`
- 🐞 Fix `Select` `selectedKeys` type validation error [#597](https://github.com/vueComponent/ant-design-vue/issues/597)

## 1.3.6
`2019-03-17`
- 🐞 Fix `Select` title attribute to display confusion [#588](https://github.com/vueComponent/ant-design-vue/issues/588)
- 🐞 Fix `InputSearch` does not support slot mode customization addonAfter and addonBefore issues [#581](https://github.com/vueComponent/ant-design-vue/issues/581)
- 🐞 Fix `Input` repeat class question [#faf9ba](https://github.com/vueComponent/ant-design-vue/commit/faf9ba0033eed9ae6ac17879f2e39dd341db847f)
- 🐞 Fix `Message` Customize content by function does not work [#554](https://github.com/vueComponent/ant-design-vue/issues/554)
- 🌟 `Cascader` `option.value` supports `String` `Number` type [#595](https://github.com/vueComponent/ant-design-vue/issues/595)
- 🐞 Fix some TypeScript definitions.

## 1.3.5
`2019-02-23`

- 🌟 Optimize the `Popover` `Popconfirm` component arrow style.
- 🐞 Fix using autoprefixer 9.4.5 in postcss (vue-cli) will throw an error `Replace text-decoration-skip: ink to text-decoration-skip-ink: auto, because spec had been changed`. [#471](https://github.com/vueComponent/ant-design-vue/pull/471)
- Tree
  - 🐞 Fixed growing space of Tree nodes.[#502](https://github.com/vueComponent/ant-design-vue/issues/502)
  - 🐞 Fixing the `Tree` node can't drag and drop the target node problem.[#469](https://github.com/vueComponent/ant-design-vue/issues/502)
  - 📝 Update the document: `Tree` component `dragxxx` event changed to all lowercase.[#467](https://github.com/vueComponent/ant-design-vue/issues/467)
- 🐞 Fix `Modal.confirm` `class` does not work.[#475](https://github.com/vueComponent/ant-design-vue/pull/475)
- 🐞 Fix some TypeScript definitions.

## 1.3.4
`2019-01-31`

🎉 🎉 🎉 Happy New Year!
- 🐞 fix: AutoComplete placeholder not display when disabled. [#402](https://github.com/vueComponent/ant-design-vue/issues/402)。
- 🐞 Add the `BreadcrmbItem` ts type file.[#452](https://github.com/vueComponent/ant-design-vue/issues/452)。
- 🐞 Fixed an issue where the FormItem was not updated when it was in a subcomponent. [#446](https://github.com/vueComponent/ant-design-vue/issues/446)。
- 🐞 Fix some component TypeScript definitions.

## 1.3.3
`2019-01-26`

- 🐞 Fix `message` not close When you configure maxcount.[#428](https://github.com/vueComponent/ant-design-vue/pull/428)。
- 🐞 Fix some component TypeScript definitions.[#422](https://github.com/vueComponent/ant-design-vue/pull/422)。
- 🌟 The Anchor component add `warpperClass` `wrapperStyle` property.[1aa42d](https://github.com/vueComponent/ant-design-vue/commit/1aa42dfe18bd7ac7893a765b6ee341844ea02550)
- 📝 Update the document: form adds the `preserve` description, and the `icon` modifies the custom component reference document description.

## 1.3.2
`2019-01-17`

- 🐞 Fix Form reports an error when using the obsolete API `autoCreateForm`.[#413](https://github.com/vueComponent/ant-design-vue/issues/413)。
- 🐞 Fix Slider error when clicking mark. [#407](https://github.com/vueComponent/ant-design-vue/issues/407)。

## 1.3.1
`2019-01-15`

- 🐞 Fixed the `Table` component could not be scrolled under ie.。[#390](https://github.com/vueComponent/ant-design-vue/issues/390)。
- 🐞 Fix `Form` does not clear that does not need to check the field.[#367](https://github.com/vueComponent/ant-design-vue/issues/367)。

## 1.3.0
`2019-01-12`

- 🎉 🎉 🎉 Publish the vscode plugin [ant-design-vue-helper](https://marketplace.visualstudio.com/items?itemName=ant-design-vue.vscode-ant-design-vue-helper)
- 🎉 🎉 🎉 Optimize official website document interaction

### Component features and styles are synchronized to antd version 3.11.6.
1.3.0 brings two new Components, a lot of exciting changes and new features.

- 🔥 Added a new component [Comment](https://vue.ant.design/components/comment/)。
- 🔥 dded a new component [ConfigProvider](https://vue.ant.design/components/config-provider/) for user to customize some global setting.

Component Fixes / Enhancements:

- 🌟 Avatar Added `srcSet` prop that is a list of sources to use for different screen resolutions.
- 🌟 Notification Added `onClick` prop that is called when the notification is clicked.
- Transfer
  - 🌟 Added `search` event that is executed when search field are changed and deprecated `searchChange` event.
  - 🌟 Added `disabled` prop that whether disable transfer.
- 🌟 Refactor Badge, support `count` as custom component.
- Slider
  - 🌟 Added `tooltipVisible` prop that whether Tooltip will always show.
  - 🌟 Optimize the focus effect
  - 🐞 Fix tooltip does not display the problem when focus through the keyboard tab.
  - 🐞 Fix the hidden switch problem of Tooltip while dragging.
- Calendar
  - 🌟 Support multiple date format.
  - 🌟 showSearch added `limit` prop that support limit filtered item count.
- Table
  - 🌟 Added `expandIcon` prop that custom the default expand icon.
  - 🌟 customCell added `index` prop.
- Select
  - 🌟 Added `removeIcon`、`clearIcon`、`menuItemSelectedIcon` prop，allow setting `remove`、`clear`、`menuItemSelected` custom icons.
  - 🌟 Added `dropdownRender` prop that custom dropdown content.
  - 🌟 Added `loading` prop that indicate loading state.
- 🌟 Optimize the display of the Button when it contains an Icon.
- ⚡️ Refactor Tag component with less code and better performance.
- 💄 Added `title` prop that Menu.Item support tooltip title when collapsed.
- 💄 Chore Card header and loading UI.
- 💄 Optimized Spin wrapper styles and improve performance slightly.
- 🐞 Fix TextArea use resize observer to check textarea size.
- 🐞 Fix Tooltip in the disabled state, the style error problem.[#389](https://github.com/vueComponent/ant-design-vue/issues/389)
- 🐞 Fix some component TypeScript definitions.


## 1.2.5
`2019-01-06`

- 🌟 Add `Typescript` type file[#250](https://github.com/vueComponent/ant-design-vue/issues/250)
- 🐞 Fix `Icon` component can't support static class and dynamic class problems at the same time[#371](https://github.com/vueComponent/ant-design-vue/issues/371)

## 1.2.4
`2018-12-29`

- 🐞 Fix `Select` component does not trigger `popupScroll` event[#350](https://github.com/vueComponent/ant-design-vue/issues/350)
- 🐞 Fixing the custom `Icon` component does not support `class` `style` issues.[#351](https://github.com/vueComponent/ant-design-vue/issues/351)
- 🌟 `Tree` `TreeSelect` supports `key` of `number` type. [#343](https://github.com/vueComponent/ant-design-vue/issues/343)
- 🌟 `Tree` components `selectedKeys`, `expandedKeys` support the `.sync` modifier.[6373ce](https://github.com/vueComponent/ant-design-vue/commit/6373ce8e92a979abb1f5dc94fa9697ee64b08dc2)
- `TreeSelect`
  - 🌟 `treeExpandedKeys` supports the `.sync` modifier.[983318](https://github.com/vueComponent/ant-design-vue/commit/983318b985ad727c008232c75a8598d52d0f924b)
  - 🐞 Fix page scrolling issue when the first `focus`.[139356](https://github.com/vueComponent/ant-design-vue/commit/1393563c9b7f8cb7d7ddc0409aa5422c53fca60b)
- 🐞 Remove the expansion animation when the `Menu` component is initialized.[#338](https://github.com/vueComponent/ant-design-vue/issues/338)

## 1.2.3
`2018-12-25`

- 📝 Remove Christmas egg.
- 🐞 Fix some components do not support array type `class` problem[#322](https://github.com/vueComponent/ant-design-vue/issues/322)
- 🌟 `TreeSelect` adds the `treeExpandedKeys` props and `treeExpand` event to control the expansion of the tree.
- 🐞 Fix the `Tree` component warning duplicate `key` question when using `TreeNode`。

## 1.2.2
`2018-12-19`

- 🐞 `Datepicker` render footer twice question. [#315](https://github.com/vueComponent/ant-design-vue/issues/315)
- `Menu`
  - 🐞 menu automatically close up to fit width in `horizontal` mode.[aa1b24](https://github.com/vueComponent/ant-design-vue/commit/aa1b2462cb333505d3efc53af1afb30fd0574dc7)。
  - 🐞 menu first expand not animation in `inline` mode. [d63935](https://github.com/vueComponent/ant-design-vue/commit/d63935e50671fab2aa561a013c35af878c610c7c)
  - 🐞 flashing problem when change collapse = true and change openKeys=[][3393f0](https://github.com/vueComponent/ant-design-vue/commit/3393f0e1513c5d29e2734397bb9e0c0b272c259f)
- 🐞 Fix form validateStatus icon not work [#321](https://github.com/vueComponent/ant-design-vue/issues/321)
- 🐞 `Upload` thumbnail icon broken styles [f1e130](https://github.com/vueComponent/ant-design-vue/commit/f1e130bdc0c12c625573c08a35c895b2d5d47568)
- 🐞 `Icon` support native event [cffef3](https://github.com/vueComponent/ant-design-vue/commit/cffef392e5605de8d342787d7562e81ca8588800)

## 1.2.1
`2018-12-17`

- 🐞 Fix `Menu` flashing problem when scaling under `Layout`
- 🐞 Fix `Icon` report Warning problem

## 1.2.0
`2018-12-16`
### Synchronize with antd 3.10.x

- 🔥🔥🔥 replaced font icons with svg icons which bring benefits below:：
  - Complete offline usage of icon, no dependency of alipay cdn font icon file and no more empty square during downloading than no need to deploy icon font files locally either.
  - Much more display accuracy in lower-level screens.
  - Support multiple colors for icon.
  - No need to change built-in icons with overriding styles by providing more props in component.
  - 😓 But at the same time bring the problem that the bundle file is too big, related solutions and discussions can check the React version of ant-design [issue](https://github.com/ant-design/ant-design/issues/12011).
  - 🌟 Add the `theme` attribute to set the theme style of the icon.
  - 🌟 Added `component` attribute, you can externally pass a component to customize the control rendering result.
  - 🌟 The `twoToneColor` property is added to control the theme color of the two-color icon.
  - 🌟 Added static methods `Icon.getTowToneColor()` and `Icon.setTwoToneColor(...)` to globally get and set the theme color of all two-color icons.
  - 🌟 The new static method `Icon.createFromIconfontCN({...})` is added to make it easier to use icons hosted on [`iconfont.cn`](http://iconfont.cn/).
- 🔥 Added a new component `Skeleton`.
- 🔥 Menu will automatically close up to fit width in `horizontal` mode.
- 🔥 The `placement` of the drawer supports `top` and `bottom` to accommodate more scenes.
- 🌟 The following components add a `suffixIcon` prop, which is used to set the icon behind the input box. For details, please refer to the documentation.
  - Cascader
  - DatePicker
  - Select
  - TreeSelect
  - TimePicker
- 🌟 Added Modal.open for optional icon dialog.
- 🌟 Modal.info adds the configuration of `getContainer`.
- 🌟 Improve RangePicker footer UI by merging them.
- 🌟 The Anchor component adds `onClick` property.
- 🌟 The Tab component adds the `renderTabBar` property.
- 🌟 The Input component adds the `select` method.
- 🌟 Steps adds the `initial` attribute.
- 🌟 Upload adds `openFileDialogOnClick` prop to allow setting whether to open the upload dialog when the component is clicked.
- 🌟 InputNumber adds `decimalSeparator` prop to allow setting a custom decimal.
- 🐞 Fix a lot of hidden bugs that have not yet been issued, and then not list them one by one.

## 1.1.10

`2018-12-7`
- 🔥🔥🔥 In the 1.1.10 version, the `Form` component better supports the single-file tempalte syntax. In previous versions, complex component requirements were required to be implemented using JSX. In order to better use the automatic collection and validation of Form forms in the template, we have optimized the way components are used. All Demo files are refactored using the latest syntax.
However, for the previous API, continue to support, you can not worry about the API changes, resulting in problems in the existing system.
````html
<template>
  <a-form :form="form">
    <a-form-item>
      <a-input v-decorator="[id, options]">
    </a-form-item>
  </a-form>
</template>
<script>
export default {
  beforeCreate () {
    this.form = this.$form.createForm(this, options)
  },
}
</script>
````
- 🐞 Fix `Steps` component `labelPlacement` does not work [#281](https://github.com/vueComponent/ant-design-vue/issues/281)
- 🐞 Fix the `Timeline` component style problem, add `reverse` `mode` props [#8e37cd](https://github.com/vueComponent/ant-design-vue/commit/8e37cd89f92ee2541f641fd860785cfd2361b2b3)
- `Tree`
  - 🐞 Fix `treeDefaultExpandedKeys` does not work [#284](https://github.com/vueComponent/ant-design-vue/issues/284)
  - 🐞 Fixes the component not update when other array attributes such as `expandedKeys` `selectedKeys` changed by array’s mutation methods. [#239](https://github.com/vueComponent/ant-design-vue/issues/239)

## 1.1.9

`2018-11-26`
- 🐞 Fix the `TreeSelect` component getPopupContainer does not work [#265](https://github.com/vueComponent/ant-design-vue/issues/265)
- 🐞 Fix `Carousel` component on-demand loading does not work [#271](https://github.com/vueComponent/ant-design-vue/issues/271)
- 🐞 Fix `Upload` component remove event no return value problem [#259](https://github.com/vueComponent/ant-design-vue/issues/259)


## 1.1.8

`2018-11-11`
- `Progress`
  - 🐞 Fix `circle` type does not support `strokeColor` problem [#238](https://github.com/vueComponent/ant-design-vue/issues/238)
  - 🐞 Add `normal` type [#257](https://github.com/vueComponent/ant-design-vue/issues/257)
- 🐞 Fix `Cascader` component does not support `getPopupContainer` problem  [#257](https://github.com/vueComponent/ant-design-vue/issues/257)
- 🌟 `Tooltip` support align [#252](https://github.com/vueComponent/ant-design-vue/issues/252)


## 1.1.7

`2018-10-27`
- 🐞 Fix `Cascader` component type error problem [#219](https://github.com/vueComponent/ant-design-vue/issues/219)
- 🐞 Fix `Tree` component custom Icon the callback parameter order error [#223](https://github.com/vueComponent/ant-design-vue/issues/223)
- 🐞 Fix `Table` pagination trigger multiple change events when `showSizeChange=true` [#228](https://github.com/vueComponent/ant-design-vue/issues/228)
- 🌟 Optimize the `Tabs` component to add tabs to the visible area by default [#215](https://github.com/vueComponent/ant-design-vue/issues/215)
- 🐞 Fix `RadioGroup` component does not support number 0 problem [#226](https://github.com/vueComponent/ant-design-vue/issues/226)
- 🐞 Fix `Slider` component When setting zoom is not 1, the position error problem, some browsers need visualViewport Polyfill [#227](https://github.com/vueComponent/ant-design-vue/issues/227)

## 1.1.6

`2018-10-10`
- 🐞 Fix `Select` component keyboard event error [#217](https://github.com/vueComponent/ant-design-vue/issues/217)
- 🐞 Fix the `Drawer` component children update issue [#209](https://github.com/vueComponent/ant-design-vue/issues/209)

## 1.1.4

`2018-09-29`
- 🛠 Refactor the `vc-tree` component and add a directory tree component
- 🐞 Fix `tabs` component property `tabBarGutter` does not work  [#205](https://github.com/vueComponent/ant-design-vue/issues/205)
- 🐞 Fix `table` component data synchronization error [#202](https://github.com/vueComponent/ant-design-vue/issues/202)


## 1.1.3

`2018-09-22`
- 🎉 Optimize component registration methods, such as Vue.use(Form) [a6620c](https://github.com/vueComponent/ant-design-vue/commit/a6620cbbe58cc1694a994e6714853906d1d794be)
- 🐞 `Select.Option` component `value` property supports `0` [#194](https://github.com/vueComponent/ant-design-vue/issues/194)
- 🐞 Fix `Layout.Sider` trigger button width does not work [#201](https://github.com/vueComponent/ant-design-vue/issues/201)
- 🐞 Fix `Menu` When switching inlineCollapsed, there is no animation problem [#200](https://github.com/vueComponent/ant-design-vue/issues/200)
- 🐞 Fix style problem in `Steps` `dot` mode [#199](https://github.com/vueComponent/ant-design-vue/issues/199)

## 1.1.2

`2018-09-17`
- 🎉 Synchronize antd3.8.4 style
- 🌟 Tag component adds `visible` attribute and wave effect
- 🐞 Fix the 'Cascader` component, the selected item is not expanded [#195](https://github.com/vueComponent/ant-design-vue/issues/195)

## 1.1.1

`2018-09-13`
- 🐞 dropdown position incorrect caused by window size change [#184](https://github.com/vueComponent/ant-design-vue/issues/184)
- 🐞 tabs container add custom event listeners [#189](https://github.com/vueComponent/ant-design-vue/issues/189)
- 🐞 Fixing 'centered` does not work when calling Modal window via API form [#183](https://github.com/vueComponent/ant-design-vue/issues/183)
- 🐞 Slider marks support {number: function}形式 [#171](https://github.com/vueComponent/ant-design-vue/issues/171)

## 1.1.0

`2018-09-11`
- 🎉 Synchronize components from [3.4.0](https://github.com/ant-design/ant-design/releases/tag/3.4.0) to antd [3.8.2](https://github.com/ Ant-design/ant-design/releases/tag/3.8.2)
- 🌟 Add the `Drawer` component
- 🐞  Fix `Spin` content flicker problem [#174](https://github.com/vueComponent/ant-design-vue/issues/174)
- 🐞 Fix `RangePicker` selection is not disabled [#158](https://github.com/vueComponent/ant-design-vue/issues/158)
- 🐞 Fixed throw error when `Form` value was `null` [#153](https://github.com/vueComponent/ant-design-vue/issues/153)
- 🐞 Fix the `Modal` subcomponent to repeat the `mounted` question  [#152](https://github.com/vueComponent/ant-design-vue/issues/152)
- 🐞 Fixed donot `render` after 'Transfer` search filter [#148](https://github.com/vueComponent/ant-design-vue/issues/148)
- 🐞 Fixed multi-level `Tabs` component nesting causing `size` not to work  [#144](https://github.com/vueComponent/ant-design-vue/issues/144)
- 🐞 Fix `TreeSelect`searchPlaceholder does not work [#125](https://github.com/vueComponent/ant-design-vue/issues/125)
- 🛠 Other issues that do not appear in the issue, see antd changelog

## 1.0.3

`2018-08-11`
- 🐞 Fix `Select` children not to update the problem [#106](https://github.com/vueComponent/ant-design-vue/issues/106)
- 🐞 Fix `Badge` offset x y axis order error and support number type [#99](https://github.com/vueComponent/ant-design-vue/issues/99)
- 🐞 Fix `Input` trigger input event problem when placeholder is Chinese in IE[#92](https://github.com/vueComponent/ant-design-vue/issues/92)
- 🐞 Fix `Avatar` does not accept event issues [#102] (https://github.com/vueComponent/ant-design-vue/issues/102)
- 🐞 Fix `grid.row` gutter type error problem [4af03c4](https://github.com/vueComponent/ant-design-vue/commit/4af03c4ab9596ede9d1b79c8308d0a3ed58b7a11)
- 🐞 Fix `CheckboxGroup` to report defaultValue warning in `Form` [#110](https://github.com/vueComponent/ant-design-vue/issues/110)

## 1.0.2

`2018-08-04`
- 🎉 Modify the component library name to `ant-design-vue`
- 🌟 The official site supports IE9 access[a8a5f8](https://github.com/vueComponent/ant-design-vue/commit/a8a5f854c3b6a78df526caf2fb391e5c9d0848ac)
- 🐞 Fix reminder issues caused by exporting undefined variables[#87](https://github.com/vueComponent/ant-design-vue/issues/87)
- 🐞 Fix some component classname duplicates[b48bbac](https://github.com/vueComponent/ant-design-vue/commit/b48bbac695dabec9160d947f9b27b2d91028c455)
- 🐞 Fix `Select` component label does not update the problem[da1b924](https://github.com/vueComponent/ant-design-vue/commit/da1b924cba0fcc871b73590ac3ebd96af81b3897)
- 🛠 Corrected some documentation errors

## 1.0.1

`2018-07-27`
- 🌟 Optimize Chinese input for `Input` components(just support v-model) [4a5154](https://github.com/vueComponent/ant-design-vue/commit/4a51544bd6470ab628dda80e9d7593e4603dd0b6)
- 🐞 Fix `treeSelect` `treeData[i].children` throw error when null[#81](https://github.com/vueComponent/ant-design-vue/issues/81)
- 🐞 Fix `Calendar` change event call twice[#82](https://github.com/vueComponent/ant-design-vue/issues/82)
- 🐞 Fix the `description` and `title` slot attribute of the `Card` component does not work[#83](https://github.com/vueComponent/ant-design-vue/issues/83)
- 🐞 Fix `dropdownClassName` attribute of `DataPicker` component does not working[02ab242](https://github.com/vueComponent/ant-design-vue/commit/02ab242197b923f2157f41d98a7930512475a799)

## 1.0.0

`2018-07-21`
- 🌟 Add `Carousel` component [edddbd](https://github.com/vueComponent/ant-design-vue/commit/edddbd982a279b62229ce825855c14c556866ece)
- modify some error document

## 0.7.1

`2018-07-17`
- 🐞 fix `Tooltip` containing disabled button does not show and style[#73](https://github.com/vueComponent/ant-design-vue/issues/73)
- 🐞 add `Table` panagation deep watch[#b464c6](https://github.com/vueComponent/ant-design-vue/commit/b464c6f6ee4df6df1b6c55f29ac85b2f462763bc)


## 0.7.0

`2018-07-11`
- 🌟 Add `TreeSelect` component
- 🌟 `Select` add `options`, Easy to generate a selection list directly[#37](https://github.com/vueComponent/ant-design-vue/issues/37)
- 🐞 Fix `blur` event error when using `Select` component in `Tooltip`[#67](https://github.com/vueComponent/ant-design-vue/issues/67)
- 🐞 Modify the `Upload` component `action` attribute to optional[#66](https://github.com/vueComponent/ant-design-vue/issues/66)


## 0.6.8

`2018-07-05`
- 🐞 Fix `notification` h is not defined[#63](https://github.com/vueComponent/ant-design-vue/issues/63)
- 🐞 Fix `Transfer` local-provider miss `titles`[#64](https://github.com/vueComponent/ant-design-vue/issues/64)

## 0.6.7

`2018-07-03`
- 🐞 Fix `Form` component cannot be updated when using template syntax[#62](https://github.com/vueComponent/ant-design-vue/issues/62)

## 0.6.6

`2018-07-03`
- 🐞 Fix `Upload` type validation error issue and update related demo[#61](https://github.com/vueComponent/ant-design-vue/issues/61)
- 🐞 Fix `Upload` image preview does not jump correctly[1584b3](https://github.com/vueComponent/ant-design-vue/commit/1584b3839e500d2d6b07abf704f5cd084ca00e87)


## 0.6.5

`2018-07-01`
- 🐞 Fix `Select` `getPopupContainer` not working [#56](https://github.com/vueComponent/ant-design-vue/issues/56)
- 🐞 Fix `Select` popup position is not updated[8254f7](https://github.com/vueComponent/ant-design-vue/commit/8254f783a32189b63ffcf2c53702b50afef1f3db)

## 0.6.4

`2018-06-28`
- 🐞 Fix `InputSearch` `v-model` return wrong value[#53](https://github.com/vueComponent/ant-design-vue/issues/53)

## 0.6.3

`2018-06-26`
- 🐞 Fix `Popover` `v-model` not working[#49](https://github.com/vueComponent/ant-design-vue/issues/49)

## 0.6.2

`2018-06-24`
- 🌟 `Form` component data auto-checking support for `template` syntax[7c9232](https://github.com/vueComponent/ant-design-vue/commit/7c923278b3678a822ff90da0cb8db7653d79e15c)
- `Select`: 🐞 add `focus` `blur` methods[52f6f5](https://github.com/vueComponent/ant-design-vue/commit/52f6f50dbe38631c0e698a6ea23b3686f6c2a375)
- `Radio`
  - 🐞 Fix Radiogroup `disabled` className[9df74b](https://github.com/vueComponent/ant-design-vue/commit/9df74bedd7640b6066010c498f942ce544c658b7)
  - 🐞 Fix `autoFoucs` `focus` `blur` `mouseenter` `mouseleave` not working[f7886c](https://github.com/vueComponent/ant-design-vue/commit/f7886c7203730bedf519bc45f5f78726735d3aac)
- `TimePicker`: 🐞 Fix `autoFoucs` `focus` `blur` not working[28d009](https://github.com/vueComponent/ant-design-vue/commit/28d009d3ced807051a86a2c09cd2764303de98f7)

## 0.6.1

`2018-06-17`
- 🌟 Add `List` Component
- `Table`
  - 🐞 Fix `'querySelectorAll` error when updating height[#33](https://github.com/vueComponent/ant-design-vue/issues/33)
  - 🐞 fix `defaultChecked` not working[ec1999](https://github.com/vueComponent/ant-design-vue/commit/ec1999dea4cea126b78e3fd84bef620b876e9841)
  - `columns key` support `number` type[9b7f5c](https://github.com/vueComponent/ant-design-vue/commit/9b7f5c2f81b6f83190e5b022b2b1e28de3f68a2b)
- `Tooltip`: 🛠 update events API `change` to `visibleChange`
- `Textarea`: 🐞 Fix `autoFoucs` not working[787927](https://github.com/vueComponent/ant-design-vue/commit/787927912307db7edb9821a440feacd216e3a6a2)
- `InputSearch`: 🐞 Add `focus` `blur` methods[3cff62](https://github.com/vueComponent/ant-design-vue/commit/3cff62997d16811ae17618f9b41617973d805d7d)
- `InputNumber`: 🐞 Fix `autoFoucs` not working[88f165](https://github.com/vueComponent/ant-design-vue/commit/88f165edb5c3993f4dba90c3267a1ea037e0869b)
- `DatePicker`: 🐞 Fix `autoFoucs` not working[264abf](https://github.com/vueComponent/ant-design-vue/commit/264abff59791181b9190ca0914b780a8df6aa81a)
- `Cascader`: 🐞 Fix `autoFoucs` not working[be69bd](https://github.com/vueComponent/ant-design-vue/commit/be69bd9af1bae184a4ebe8c4ef9560479ab11027)
- `Rate`: 🐞 Fix `autoFoucs` not working，and `blur` error[c2c984](https://github.com/vueComponent/ant-design-vue/commit/c2c9841eb9b8e5ce4decff57a925e60d4bd7d809)
- `RangePicker`: 🐞 Fix value type check error problem[228f44](https://github.com/vueComponent/ant-design-vue/commit/228f4478a5d169d22960c97d1d8a8320c58da9cc)

## 0.6.0

`2018-06-04`
- 🌟 Add `Anchor` Component
- `Table`
  - 🐞 Fix show `emptyText` problem when `loading.spinning` [17b9dc](https://github.com/vueComponent/ant-design-vue/commit/17b9dc14f5225eb75542facdb5053f4916b9d77f)
  - 🐞 Fixed `header style` not working [#30](https://github.com/vueComponent/ant-design-vue/pull/30)
- 🐞  `DatePicker`: Fix the issue of `change` event repeatedly call when `showTime` is `true` [81ab82](https://github.com/vueComponent/ant-design-vue/commit/81ab829b1d0f67ee926b106de788fc5b41ec4f9c)
- 🐞  `InputNumber`: Fix `placeholder` not working [ce39dc](https://github.com/vueComponent/ant-design-vue/commit/ce39dc3506474a4b31632e03c38b518cf4060cef#diff-c9d10303f22c684e66d71ab1f9dac5f9R50)

## 0.5.4

`2018-05-26`
- 🐞 Fix missing `less` file problem in dist directory[ca084b9](https://github.com/vueComponent/ant-design-vue/commit/ca084b9e6f0958c25a8278454c864ac8127cce95)

## 0.5.3

`2018-05-25`
- 🐞 Fixed issue with building `antd-with-locales.js` containing test files[90583a3](https://github.com/vueComponent/ant-design-vue/commit/90583a3c42e8b520747d6f6ac10cfd718d447030)

## 0.5.2

`2018-05-25`

- 🐞 `Timeline`: Fix duplicated loading component bug [fa5141b](https://github.com/vueComponent/ant-design-vue/commit/fa5141bd0061385f251b9026a07066677426b319)
- `Transfer`
  - 🐞 Fix search box clear button does not work Problem [4582da3](https://github.com/vueComponent/ant-design-vue/commit/4582da3725e65c47a542f164532ab75a5618c265)
  - 💄 Override property change listener logic to avoid unnecessary [0920d23](https://github.com/vueComponent/ant-design-vue/commit/0920d23f12f6c133f667cd65316f1f0e6af27a33)
- 💄 `Select`: Optimizing `title` display logic [9314957](https://github.com/vueComponent/ant-design-vue/commit/931495768f8b573d12ce4e058e853c875f22bcd3)
- `Form`
  - 🐞 Fixed Form component `directive` error [#20](https://github.com/vueComponent/ant-design-vue/issues/20)
  - 🌟 Maintain an ref for wrapped component instance, use `wrappedComponentRef` [c5e421c](https://github.com/vueComponent/ant-design-vue/commit/c5e421cdb2768e93288ce7b4654bee2114f8e5ba)
- 🐞 `DatePicker`: Fix calendar keyboard event does not work [e9b6914](https://github.com/vueComponent/ant-design-vue/commit/e9b6914282b1ac8d84b4262b8a6b33aa4e515831)
- `Avatar`: Fixing font size adaptation issues [#22](https://github.com/vueComponent/ant-design-vue/pull/22)
- 🌟 Added single test for some components
- 🌟 sorted component library `dependencies` and `devDependencies`, deleted unused packages, and added `peerDependencies`

## 0.5.1

`2018-05-10`

- 🐞 `Table`: Fix `customRow` events not working[#16](https://github.com/vueComponent/ant-design-vue/issues/16)

## 0.5.0

`2018-05-08`

- 🌟 `Form`: add Form component
- 💄 `Upload.Dragger`: Modify `name` name to `a-upload-dragger`
- 🐞 `Upload`: Fix `name` prop not working

## 0.4.3

`2018-05-02`

- 🐞 Fix component style loss problem
- 🌟 site add babel-polyfill

## 0.4.2

`2018-04-24`

- 🐞  fix menu click bug

## 0.4.1

#### bug

- Transfer Vue's dependencies to devDependencies to avoid unstable bugs caused by inconsistency with business versions

## 0.4.0

#### Layout

- add  `layout` component

#### Others

- support use [Vue.use(antd)](https://github.com/vueComponent/ant-design-vue/issues/3)


## 0.3.1

#### Features

- first version, provide 45 [components](https://github.com/vueComponent/ant-design-vue/blob/c7e83d6142f0c5e72ef8fe794620478e69a50a8e/site/components.js)
