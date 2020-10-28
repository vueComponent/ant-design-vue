# Change Log (The following content is translated by Google)

`ant-design-vue` strictly follows [Semantic Versioning 2.0.0](http://semver.org/).

#### Release Schedule

- Weekly release: patch version for routine bugfix.
- Monthly release: minor version for new features.
- Major version release is not included in this schedule for breaking change and new features.

---

## 1.7.1

`2020-10-28`

- 🐞 Fix Menu component, wrong display Tooltip prompt problem

## 1.7.0

`2020-10-28`

- 🌟 Recursive Menu component, supports arbitrary nesting of other elements [#1452](https://github.com/vueComponent/ant-design-vue/issues/1452)
- 🇮🇪 Add Irish language internationalization support
- 🐞 Fix webpack 5 compatibility issues.
- 🐞 Fix the problem that the Upload method attribute does not take effect [#2837](https://github.com/vueComponent/ant-design-vue/issues/2837)
- 🐞 Fix the problem that Space does not declare properties and does not mount the root node [#2902](https://github.com/vueComponent/ant-design-vue/issues/2902)
- 🐞 Fix the problem that Table component filter does not support number type [#3052](https://github.com/vueComponent/ant-design-vue/issues/3052)
- 🐞 Fix Table fixed column ellipsis not working issue [#2916](https://github.com/vueComponent/ant-design-vue/issues/2916)
- 🐞 Fix AutoComplete component, need two tab keys to focus issue [#1438](https://github.com/vueComponent/ant-design-vue/issues/1438)
- 🐞 Fix the problem that TreeSelect cannot customize slot [#2827](https://github.com/vueComponent/ant-design-vue/issues/2827)

## 1.6.5

`2020-08-25`

- 🔥🔥🔥 Vue 3 compatible [2.0.0-beta.3](https://2x.antdv.com/)
- 🔥 Add Space component [#2669](https://github.com/vueComponent/ant-design-vue/pull/2669)
- 🌟 Optimize zh_TW language pack [#2679](https://github.com/vueComponent/ant-design-vue/pull/2679)
- 🐞 Fix breadcrumb `Breadcrumb` repeated key problem [#2505](https://github.com/vueComponent/ant-design-vue/issues/2505)
- 🐞 Fix the problem of misalignment in the fixed column of Table [#1493](https://github.com/vueComponent/ant-design-vue/issues/1493)
- 🐞 Fix the problem that the Enter key will report an error when the Mentions component is empty [#2662](https://github.com/vueComponent/ant-design-vue/pull/2662)

## 1.6.4

`2020-07-21`

- 🐞 Fix breadcrumb `Breadcrumb` duplicate key problem [#2505](https://github.com/vueComponent/ant-design-vue/issues/2505)
- 🐞 Fix the Tooltip issue when MenuItem title is empty [#2526](https://github.com/vueComponent/ant-design-vue/issues/2505)
- 🐞 Fix the problem that Input textarea cannot be dragged up when allow-clear is activated. [#2563](https://github.com/vueComponent/ant-design-vue/issues/2563)
- 🌟 Add less variables @select-item-selected-color [#2458](https://github.com/vueComponent/ant-design-vue/issues/2458)
- 🌟 Add flex attribute to Col in Grid [#2558](https://github.com/vueComponent/ant-design-vue/issues/2558)

## 1.6.3

`2020-07-05`

- 🐞 Fix Input.Password focus position shift issue [#2420](https://github.com/vueComponent/ant-design-vue/pull/2420)
- 🐞 Fix Drawer maskstyle not working [#2407](https://github.com/vueComponent/ant-design-vue/issues/2407)
- 🐞 Fix Drawer maskstyle not working [#2407](https://github.com/vueComponent/ant-design-vue/issues/2407)
- 🌟 Button supports custom Icon [#2245](https://github.com/vueComponent/ant-design-vue/pull/2245)
- 🌟 DatePicker supports custom format [#2276](https://github.com/vueComponent/ant-design-vue/pull/2276)
- 🐞 Fix DatePicker year and time is incorrect [#2488](https://github.com/vueComponent/ant-design-vue/issues/2488)
- 🌟 Optimize the Menu component, the animation is smoother
- 🐞 Fix Dropdown pop-up position error [#2359](https://github.com/vueComponent/ant-design-vue/issues/2359)
- 🐞 Fix the problem of duplicate key when `Breadcrumb` has the same name [#2505](https://github.com/vueComponent/ant-design-vue/issues/2505)

## 1.6.2

`2020-06-02`

- 🐞 Fix dialogClass type error [#2298](https://github.com/vueComponent/ant-design-vue/issues/2298)
- 🐞 Fix RangePicker panel display error [#2318](https://github.com/vueComponent/ant-design-vue/issues/2318)

## 1.6.1

`2020-05-25`

- 🐞 Fix the problem of filling the current time when DatePicker blur [#2246](https://github.com/vueComponent/ant-design-vue/issues/2246)
- 🐞 Fix Drawer error when destroying [#2254](https://github.com/vueComponent/ant-design-vue/issues/2254)
- 🐞 Fix Tabs cannot remove tabs with 0 as key [55bbf9](https://github.com/vueComponent/ant-design-vue/commit/55bbf940401cf2a67114102da1c035abc4152f06)
- 🐞 Fix Menu trigger twice click event [#2266](https://github.com/vueComponent/ant-design-vue/issues/2266)
- 🐞 Fix Menu active class name is not added [ffc002](https://github.com/vueComponent/ant-design-vue/commit/ffc002f09454a56b531aeb08530303d566cf24f2)
- 🌟 TreeSelect add custom data field function [#2253](https://github.com/vueComponent/ant-design-vue/issues/2253)
- 🌟 Modal added dialogStyle and dialogClass instead of style and class before refactoring [#2285](https://github.com/vueComponent/ant-design-vue/issues/2285)
- 🐞 Fix Table sorting trigger infinite update issue [#2270](https://github.com/vueComponent/ant-design-vue/issues/2270)

## 1.6.0

`2020-05-15`

- 🌟 Tootip supports custom components [741897](https://github.com/vueComponent/ant-design-vue/commit/741897be6742c752f0b0d29481add702ee7e7fb0)
- 🐞 Refactor Modal's underlying Portal components to solve the problem of delayed content update in Modal [#2244](https://github.com/vueComponent/ant-design-vue/issues/2244)
- 🐞 Fix Select option focus border style in Input.Group [#2224](https://github.com/vueComponent/ant-design-vue/pull/2224)
- 🐞 Fix Cascader option icon color when disabled [#2223](https://github.com/vueComponent/ant-design-vue/pull/2223)
- 🐞 Fix DatePicker color when separator is disabled [#2222](https://github.com/vueComponent/ant-design-vue/pull/2222)
- 🐞 Fix Carousel keyboard switch to Radio / Checkbox on inactive slide.
- 🐞 Fix the problem that Table filter menu is not displayed when less version is `2.x`. [#23272](https://github.com/ant-design/ant-design/pull/23272)
- 🐞 Fix the failure of Table `column.filtered`.
- 🐞 Fix the style problem of Input in Safari browser in Select `multiple` mode. [#22586](https://github.com/ant-design/ant-design/pull/22586)
- 🐞 Fix the problem that Descriptions can not adapt in small size. [#22407](https://github.com/ant-design/ant-design/pull/22407)

## 1.5.6

`2020-05-09`

- 🐞 Fix the problem of missing css, min.js and other files in the dist folder

## 1.5.5

`2020-05-08`

- 🐞 Fix `Tabs` not showing issue under safari 13 [#2199](https://github.com/vueComponent/ant-design-vue/issues/2199)
- 🐞 Fix the first input failure of `Input` under FireFox [#2151](https://github.com/vueComponent/ant-design-vue/issues/2151)
- 🐞 Fix `Input` cursor shift issue in Modal component [#2207](https://github.com/vueComponent/ant-design-vue/issues/2207)

## 1.5.4

`2020-04-30`

- 🌟 `DatePicker` supports the align attribute and sets the popup position [#1112f2](https://github.com/vueComponent/ant-design-vue/commit/1112f2f791fd64866284ec82def90baefe81e798)
- 🌟 `DatePicker` supports inputReadOnly attribute [#138eae](https://github.com/vueComponent/ant-design-vue/commit/138eae594dd440ce815e45d811a0778cb3e7583f)
- 🌟 `DatePicker` `TimePicker` `Calendar` supports string-type binding values ​​[#718](https://github.com/vueComponent/ant-design-vue/issues/718)
- 🌟 `Table` `ConfigProvider` adds `transformCellText` for transforming table rendering values, such as processing of empty data [#2109](https://github.com/vueComponent/ant-design-vue/issues/2109)
- 🌟 `FormModel` added validateMessages attribute [#2130](https://github.com/vueComponent/ant-design-vue/issues/2130)
- 🌟 Optimize pop-up window animation effect [#bf52f73](https://github.com/vueComponent/ant-design-vue/commit/bf52f73c5c2f8d05981e426b41a5f46d66e096db)
- 🐞 Fix the `tabBarGutter` attribute of the `Tabs` component does not take effect [#2083](https://github.com/vueComponent/ant-design-vue/issues/2083)
- 🐞 Fix renderTabBar of `Tabs` component not working [#2157](https://github.com/vueComponent/ant-design-vue/issues/2157)
- 🌟 `Tabs` component supports number 0 as key [#2167](https://github.com/vueComponent/ant-design-vue/issues/2167)
- 🐞 Fix the style of the Input.Search component is misaligned [#2077](https://github.com/vueComponent/ant-design-vue/issues/2077)
- 🐞 Fix the style misalignment of `Slider` component [#2097](https://github.com/vueComponent/ant-design-vue/issues/2097)
- 🐞 Fix `Tree.TreeNode` customTitle scope slot can not get selected status issue [#2006](https://github.com/vueComponent/ant-design-vue/issues/2006)
- 🐞 Fix `SelectTree` showSearch error when reporting [#2082](https://github.com/vueComponent/ant-design-vue/issues/2082)
- 🐞 Fix the inconsistent position of original dots in `Badge` dot state [#2121](https://github.com/vueComponent/ant-design-vue/issues/2121)

## 1.5.3

`2020-04-13`

- 🐞 Fix the problem that the content does not respond to updates when `Dropdown` visible is unchanged [#81eb40](https://github.com/vueComponent/ant-design-vue/commit/81eb401a8899aa3fe0acca88340b323f6e09db45)

## 1.5.2

`2020-04-09`

- 🐞 Fix ts type of `FormModel` not introduced [#1996](https://github.com/vueComponent/ant-design-vue/issues/1966)
- 🐞 Fix `DatePicker.WeekPicker` type file error [#2044](https://github.com/vueComponent/ant-design-vue/issues/2044)
- 🐞 Fix "Tabs" tabClick event does not take effect [#2030](https://github.com/vueComponent/ant-design-vue/issues/2030)
- 🐞 Fix `Table` resize error issue [#2033](https://github.com/vueComponent/ant-design-vue/issues/2033)

## 1.5.1

`2020-04-02`

- 🐞 Fix `PageHeader` cannot hide backIcon [#1987](https://github.com/vueComponent/ant-design-vue/pull/1987)
- 🐞 Fix `Pagination` doesn't update when total changes [#1989](https://github.com/vueComponent/ant-design-vue/pull/1989)
- 🐞 Fix placeholder does not disappear when inputting `TreeSelect` in Chinese [#1994](https://github.com/vueComponent/ant-design-vue/pull/1994)
- 🐞 Fix `Table` customRender cannot customize class style [#2004](https://github.com/vueComponent/ant-design-vue/pull/2004)
- 🐞 Fix `Form` missing slot content when using Form.create [#1998](https://github.com/vueComponent/ant-design-vue/pull/1998)
- 🐞 Fix `Textarea` scroll bar flickering problem [#1964](https://github.com/vueComponent/ant-design-vue/pull/1964)
- 🌟 Add ts type file of `FormModel` [#1996](https://github.com/vueComponent/ant-design-vue/issues/1966)
- 🌟 Add `modal` destroyAll type declaration [#1993](https://github.com/vueComponent/ant-design-vue/pull/1963)

## 1.5.0

`2020-03-29`

- Four new components have been added:
  - 🔥🔥🔥 [Mentions](https://antdv.com/components/mentions/) Added mentioned components and discarded the original Mention components.
  - 🔥🔥🔥 [Descriptions](https://antdv.com/components/descriptions/) Display multiple read-only fields in groups.
  - 🔥🔥🔥 [PageHeader](https://antdv.com/components/page-header/) can be used to declare the topic of the page, display important information about the page that the user is concerned about, and carry the operation items related to the current page.
  - 🔥🔥🔥 [Result](https://antdv.com/components/result) is used to feedback the processing results of a series of operation tasks.
  - 🔥🔥🔥 [FormModel](https://antdv.com/components/form-model) Form components that use v-model for automatic validation are more concise than v-decorator forms.
- 🔥 Descriptions supports vertical layout.
- 🔥 Progress.Circle supports gradient colors.
- 🔥 Progress.Line supports gradient colors.
- Breadcrumb
  - 🎉 Breadcrumb.Item supports the `overlay` property to define drop-down menus.
  - 🌟 Added `Breadcrumb.Separator` component, you can customize`separator`.
- 🌟 TreeSelect's `showSearch` supports multiple selection mode.
- 🌟 Timeline.Item adds `gray` color type, which can be used in incomplete or invalid state.
- 🌟 Modal supports `closeIcon` property for customizing the close icon.
- Upload
  - 🌟 Upload provides `previewFile` property to customize the preview logic.
  - 🌟 Upload adds `transformFile` to support converting files before uploading.
  - 🌟 Upload supports previewing pictures in jfif format.
  - 🌟 Added `showDownloadIcon` property for displaying download icons.
- 🌟 Input.Search adds `loading` property, which is used to display the loading status.
- 🌟 Grid's `gutter` property adds support for vertical spacing. Now you can set an array for`gutter`, the second value of the array represents the vertical spacing.
- 🌟 message Added support for updating content with unique `key`.
- 🌟 TextArea supports `allowClear`.
- 🌟 Dropdown.Button supports `icon` property to customize the icon.
- Drawer
  - 🌟 Support `afterVisibleChange` property, which is triggered after the drawer animation is completed.
  - 🌟 Support `ESC` shutdown.
  - 🌟 Added `keyboard`, which allows the response to keyboard events to be turned on and off.
- 🌟 TreeNode supports `checkable` property.
- 🌟 Transfer supports `children` custom rendering list.
- 🌟 Pagination supports `disabled` property.
- 🌟 Steps support click to switch function.
- Slider
  - 🌟 Support `tooltipPlacement` to define the location of the tip.
  - 🌟 Support `getTooltipPopupContainer` to allow custom container for the prompt.
  - 🌟 Flip `trigger` direction when Sider is on the right.
- 🌟 Calendar supports `headerRender` to customize header.
- 🌟 Carousel supports custom panel pointing point locations.
- 🌟 Collapse supports `expandIconPosition` property.
- 🌟 Popconfirm adds `disabled` props, which are used to control whether clicking child elements pop up.
- 🌟 Select supports `showArrow` in multi-select mode.
- 🌟 Collapse.Panel added `extra`.
- Card
  - 🌟 Card component added `tabBarExtraContent` property.
  - 🌟 Card.Grid added a hoverable property to allow floating effects to be disabled.
- 🌟 Anchor.Link adds `target` attribute.
- 🌟 TimePicker added `clearIcon` prop for custom clear icon.
- Form
  - 🌟 Support to configure the `colon` property directly on the Form.
  - 🌟 Support `labelAlign` property.
- Table
  - 🌟 Table adds `getPopupContainer` property for setting various floating layer rendering nodes in the table.
  - 💄 Adjust the style of the Table expand button.
  - 🌟 Added `tableLayout` property, supports setting the table's`table-layout` layout, and enables `tableLayout =" fixed "` by default under fixed headers / columns, to solve the column alignment problem caused by the table layout automatically based on content .
  - 🌟 Added `column.ellipsis` to support automatic omission of cell contents.
  - 🌟 Added `scroll.scrollToFirstRowOnChange` property, which is used to set whether to scroll to the top of the table after page turning.   -Filter `filterDropdown` Added`visible` parameter to get the display status of the drop-down box.
  - 🌟 The `title` method adds a`sortColumn` parameter to get the currently sorted column.   -Sort When sorting, the `sorter` parameter of`onChange` will always contain `column` information.
- 🌟 Tree component supports `blockNode` property.
- 🌟 RangePicker adds `separator` definition.
- Empty
  - 🌟 Empty supports the `imageStyle` property.
  - 🌟 Empty `description` supports`false`.
  - 🌟 Empty Supports access to preset pictures via `Empty.PRESENTED_IMAGE_DEFAULT` and`Empty.PRESENTED_IMAGE_SIMPLE`
- 🌟 Badge supports custom colors.
- 🐞 Fix the problem that the label of Steps is not centered.
- 🐞 Fix cursor style problem of DatePicker and TimePicker.
- 🐞 Fix `TreeSelect` custom icon is invalid [#1901](https://github.com/vueComponent/ant-design-vue/issues/1901)
- 🐞 Fix `Tabs` keyboard left / right switching error [#1947](https://github.com/vueComponent/ant-design-vue/issues/1947)

## 1.4.12

`2020-03-03`

- 🐞 Fix ts type error of `Modal` component [#1809](https://github.com/vueComponent/ant-design-vue/issues/1809)

## 1.4.11

`2020-02-12`

- 🌟 DirectoryTree adds custom switcherIcon function [#1743](https://github.com/vueComponent/ant-design-vue/issues/1743)
- 🌟 Add draggable table column width [example](https://www.antdv.com/components/table/#components-table-demo-resizable-column)
- 🌟 Replace `this.$listeners` of all components to avoid repeated rendering of components [#1705](https://github.com/vueComponent/ant-design-vue/issues/1705)
- 🐞 Fix ConfigProvider component error report error [7a4003](https://github.com/vueComponent/ant-design-vue/commit/7a40031955d520487dcaf9054a1280ae72230049)
- 🐞 Fix placeholder does not disappear when custom input box of AutoComplete component [#1761](https://github.com/vueComponent/ant-design-vue/issues/1761)
- 🐞 Fix Statistic.Countdown does not trigger finish event [#1731](https://github.com/vueComponent/ant-design-vue/pull/1731)
- 🐞 Fix upload component preview image not refreshing [f74469](https://github.com/vueComponent/ant-design-vue/commit/f744690e929d9d6da03c5c513b3ac5497c6490ef)
- 🐞 Fix TimePicker id is not unique [#1566](https://github.com/vueComponent/ant-design-vue/pull/1566)
- 🐞 Fix Pagination pagination without animation [#1540](https://github.com/vueComponent/ant-design-vue/issues/1540)
- 🐞 Fix drop-down list does not show empty elements when Cascader's option is empty array [#1701](https://github.com/vueComponent/ant-design-vue/issues/1540)
- 🐞 Fix spellcheck rendering incorrect for Input component [#1707](https://github.com/vueComponent/ant-design-vue/issues/1707)
- 🐞 Fix Tree component cannot customize icon [#1712](https://github.com/vueComponent/ant-design-vue/pull/1712)
- 🐞 Fix SubMenu forceSubMenuRender property is invalid [#1668](https://github.com/vueComponent/ant-design-vue/issues/1668)
- 🐞 Fix style of upload button is misaligned [#1742](https://github.com/vueComponent/ant-design-vue/pull/1742)

## 1.4.10

`2019-12-11`

- 🐞 Fixed the left and right arrows of MonthPicker cannot be worked [#1543](https://github.com/vueComponent/ant-design-vue/issues/1543)

## 1.4.9

`2019-12-10`

- 🐞 Fix body scrolling issue when `Modal` is opened [#1472](https://github.com/vueComponent/ant-design-vue/issues/1472)
- 🐞 Fix `Drawer` wrapStyle not working [#1481](https://github.com/vueComponent/ant-design-vue/issues/1481)
- 🐞 Fix `InputNumber` id mount position is incorrect [#1477](https://github.com/vueComponent/ant-design-vue/issues/1477)
- 🐞 Fix `Tabs` nextClick event does not fire [#1489](https://github.com/vueComponent/ant-design-vue/pull/1489)
- 🐞 Fix `MonthPicker` cannot be changed in open state [#1510](https://github.com/vueComponent/ant-design-vue/issues/1510)
- 🐞 Fix the issue that `AutoComplete` does not disappear when entering Chinese [#1506](https://github.com/vueComponent/ant-design-vue/issues/1506)
- 🐞 Fix the problem that the content cannot pop up when referencing different Vue variables [6362bf](https://github.com/vueComponent/ant-design-vue/commit/6362bf9edb441c0c0096beca1d2c8727003dbb15)
- 🌟 `Table` `customRender` Add a third column parameter [#1513](https://github.com/vueComponent/ant-design-vue/pull/1513)
- 🌟 `InputPassword` adds focus and blur methods [#1485](https://github.com/vueComponent/ant-design-vue/pull/1485)
- 🐞 Fix `Tooltip` report error when using native html element [#1519](https://github.com/vueComponent/ant-design-vue/issues/1519)
- 🐞 Fix `Menu` report error in edge browser [#1492](https://github.com/vueComponent/ant-design-vue/issues/1492)
- 🐞 Fix empty centering of `Select` [#1445](https://github.com/vueComponent/ant-design-vue/pull/1445)
- 🐞 Fix popup window component memory leak problem [#1483](https://github.com/vueComponent/ant-design-vue/pull/1483)

## 1.4.8

`2019-11-28`

- 🐞 Fix `Menu` not trigger click event [#1470](https://github.com/vueComponent/ant-design-vue/issues/1470)
- 🐞 Fix `Tooltip` not hide in keep-alive [16ec40](https://github.com/vueComponent/ant-design-vue/commit/16ec40a012d7c400bf3028e6c938050dd6d7de2f)

## 1.4.7

`2019-11-27`

- 🌟 `getPopupContainer` of`ConfigProvider` Added popup context as the second parameter for uniform configuration of `getPopupContainer` in`Modal` [7a3c88](https://github.com/vueComponent/ant-design -vue / commit / 7a3c88107598b4b1cf6842d3254b43dc26103c14)
- 🐞 Fix `ConfigProvider` reporting error in Vue 2.5 [309baa](https://github.com/vueComponent/ant-design-vue/commit/309baa138a9c9a1885c17ef636c9132349024359)
- 🐞 Fix `Menu` click event is triggered twice [#1450](https://github.com/vueComponent/ant-design-vue/issues/1427)
- 🐞 Fix incorrect width of input box in `Select` [#1458](https://github.com/vueComponent/ant-design-vue/issues/1458)
- 🐞 Fix `Select` the problem that `placeholder` does not disappear when inputting Chinese [#1458](https://github.com/vueComponent/ant-design-vue/issues/1458#issuecomment-557477782)
- 🌟 Add the TS type declaration for the `Comment` component [#1453](https://github.com/vueComponent/ant-design-vue/pull/1453)

## 1.4.6

`2019-11-20`

- 🐞 Fix `Cascader` can't enter a space question [#1427](https://github.com/vueComponent/ant-design-vue/issues/1427)
- 🐞 Fix `AutoComplete` can't delete the last character [#1429](https://github.com/vueComponent/ant-design-vue/issues/1427)
- 🐞 Update `dbclick` in `Tree`'s `expandAction` to `dblclick` [#1437](https://github.com/vueComponent/ant-design-vue/issues/1437)
- 🐞 Update `dbclick` in the `Table` document to `dblclick` [#1437](https://github.com/vueComponent/ant-design-vue/issues/1437)
- 🌟 Add the TS type declaration for the `Empty` component [#1439](https://github.com/vueComponent/ant-design-vue/pull/1439)

## 1.4.5

`2019-11-16`

- 🌟 `Form` support `labelCol` `wrapperCol` for setting layout [#1365](https://github.com/vueComponent/ant-design-vue/pull/1365)
- 🌟 `Input` `Select` `DatePicker` trigger change event after input Chinese, reducing unnecessary performance consumption [#1281](https://github.com/vueComponent/ant-design-vue/issues/1281)
- 🐞 Fixed when the placeholder of `Input` `Select` is Chinese, the change event is automatically triggered under ie [#1387](https://github.com/vueComponent/ant-design-vue/issues/1387)
- Tree

  - 🌟 Add the `replaceFields` field to customize the `title` `children` [#1395](https://github.com/vueComponent/ant-design-vue/issues/1395)
  - 🌟 update event `doubleclick` to `dbclick` [5e27ff](https://github.com/vueComponent/ant-design-vue/commit/5e27ff8da4419f490ab5c6ebeaf43d933519fcd7)

- 🐞 Fix `Input` Delete content under ie9 does not trigger change event [#1421](https://github.com/vueComponent/ant-design-vue/issues/1421)
- 🐞 Fix `Dropdown` `disabled` invalid problem [#1400](https://github.com/vueComponent/ant-design-vue/issues/1400)
- 🐞 Fix Select type error when `lableInValue` [#1393](https://github.com/vueComponent/ant-design-vue/pull/1393)
- 🐞 Fix Comment style question [#1389](https://github.com/vueComponent/ant-design-vue/pull/1389)
- 🐞 Fix `Statistic` `Password` TypeScript type definition.

## 1.4.4

`2019-10-30`

- 🌟 Progress format support v-slot [#1348](https://github.com/vueComponent/ant-design-vue/issues/1348)
- 🐞 Fix RangePicker Year Panel not work [#1321](https://github.com/vueComponent/ant-design-vue/issues/1321)
- 🐞 Fix Pagination simple mode not work [#1333](https://github.com/vueComponent/ant-design-vue/issues/1333)
- 🐞 Fix AutoComplete flashing on fast input [#1327](https://github.com/vueComponent/ant-design-vue/issues/1327)
- 🐞 Fix Button loading mode is not centered [#1337](https://github.com/vueComponent/ant-design-vue/issues/1337)
- 🐞 Fix Menu menu collapsed in Chrome [#873](https://github.com/vueComponent/ant-design-vue/issues/873)
- 🐞 Fix Checkbox v-model parameter validation failure [#1356](https://github.com/vueComponent/ant-design-vue/issues/1356)
- 🐞 Fix Checkbox.Group error when update value to undefined [#1356](https://github.com/vueComponent/ant-design-vue/issues/1356)

## 1.4.3

`2019-10-22`

- 🐞 Fix Cascader component style issues caused by Input [#1293](https://github.com/vueComponent/ant-design-vue/issues/1280)
- 🐞 Fix some component can not use `<template slot="xxx" />` [041839](https://github.com/vueComponent/ant-design-vue/commit/041839b90131d3a4e6a5663986b811d60d4e6ba2)

## 1.4.2

`2019-10-21`

- 🐞 Fix `Radio.Group` triggers multiple change callback issues [#1280](https://github.com/vueComponent/ant-design-vue/issues/1280)
- 🐞 Fix `Pagination` keyup enter not work [#1316](https://github.com/vueComponent/ant-design-vue/issues/1316)

## 1.4.1

`2019-10-17`

- 🐞 fix `Input.Password` cannot use `v-model` [#1306](https://github.com/vueComponent/ant-design-vue/issues/1306)
- 🌟 Optimize the clear button of `Input` to display the logic. [#1296](https://github.com/vueComponent/ant-design-vue/issues/1296)
- 🌟 After click clear button, `Input` becomes the `focus` state.
- 🐞 fix progress strokeWidth not work [#1301](https://github.com/vueComponent/ant-design-vue/issues/1301)
- 🐞 Fix Radio.Group triggers multiple change callback issues [#1280](https://github.com/vueComponent/ant-design-vue/issues/1280)
- 🐞 Fix Form initialValue error [#1291](https://github.com/vueComponent/ant-design-vue/issues/1291)

## 1.4.0

`2019-10-14`

- 🎉 New component Empty, and improved empty data style of all components!
- 🎉 New component Statistic.
- 🎉 Hindi locale added (hi_IN).
- 🎉 Kannada locale added (kn_IN).
- 🌟 ConfigProvider component support prefixCls.
- Button
  - 🌟 Button support round shape.
- Collapse
  - 🌟 Add `expandIcon` to allow customization of Collapse icon.
- ConfigProvider
  - 🌟 Support Content Security Policy (CSP) config.
  - 🌟 Support `autoInsertSpaceInButton` to remove space between 2 Chinese characters on Button.
- Icon
  - 🌟 Icon component add `aria-label` prop to enhance accessibility.
  - 🌟 Add `rotate` to allow icon rotate as specified degrees.
  - 🌟 Add `eye-invisible` icon.
- Input
  - 🌟 Add Input.Password.
  - 🌟 support `allowClear`。
- Modal
  - 🌟 Add `forceRender` support.
  - 🌟 Add `destroyAll` method.
  - 🌟 Add `icon` to Modal.confirm/info/warning/error, `iconType` is deprecated.
  - 🌟 Add `mask` property support for Modal method.
  - 🌟 Add `transitionName` and `maskTransitionName` property support for Modal method.
  - 🐞 Fix the problem that the mouse moves to the mask layer to close automatically [#842](https://github.com/vueComponent/ant-design-vue/issues/842)
- 🌟 Add `small` type Card component.
- Form
  - 🌟 Add `name` option to `Form.create`。
  - 🌟 Add `selfUpdate` to improve performance [#1049](https://github.com/vueComponent/ant-design-vue/issues/1049)
  - 🐞 Fix browser stuck when `FormItem` is passed through slot [#1271](https://github.com/vueComponent/ant-design-vue/issues/1271)
- 🌟 Add switcherIcon prop to Tree.
- Dropdown
  - 🌟 Dropdown.Button support `href`.
  - 🌟 Add `openClassName`.
- Table
  - 🌟 Add prop `sortDirections` for Table and Table.Column.
  - 🐞 Fixed Badge component display over the fixed table column.
  - 🐞 Fixed rowSelection columnWidth doesn't work.
- DatePicker
  - 🌟 Will read format as default format in locale if provided.
  - 🌟 Add new `renderFooter` API for DatePicker.
  - 🐞 Fixed `dateRender` not supported at WeekPicker.
  - 🐞 Fixed disabled button style in DatePicker panel.
  - 🌟 support prop `renderExtraFooter` in all mode.
  - 🐞 Fixed month range display when start year equals end year.
- TimePicker
  - 🌟 TimePicker support new prop `popupStyle` and new event `amPmChange`.
  - 🐞 Fixed TimePicker Icon disappear when used with Input.Group.
  - 🌟 Deprecated `allowEmpty` prop and use `allowClear` instead. Sync style with DatePicker.
- 🌟 Rate component support `tooltips`.
- Upload
  - 💄 Add new less var `upload-picture-card-border-style` and Fixed `upload-picture-card-size` typo.
  - 🐞 Fixed `dpg` file type is not recognizable as image in Upload component.
- Spin
  - 🐞 Fix Spin style issue in IE 10.
- Progress
  - 🌟 All types support `successPercent` prop.
- Pagination
  - 🐞 Fix ellipsis misalignment.
- 🐞 Fixed Radio style bug in Chrome.
- 🐞 Fixed Steps style issue on IE9.
- 🐞 Fixed nested Timeline last item missing line.
- 🐞 Fixed spin never shows up when delay got initially set.
- 🐞 Fix wave style issue in Edge.

## 1.3.17

`2019-09-29`

- 🌟 `Form` adds the `selfUpdate` attribute to improve form performance [#1049](https://github.com/vueComponent/ant-design-vue/issues/1049)
- `Select`
  - 🐞 Fix keydown keyboard event invalidation
  - 🐞 Fix arrow icon can't close pop-up question [#1067](https://github.com/vueComponent/ant-design-vue/issues/1176)
  - 🐞 Fix IE browser to automatically close the problem [#1223](https://github.com/vueComponent/ant-design-vue/issues/1223)
  - 🌟 Add maxTagTextLength attribute [#1217](https://github.com/vueComponent/ant-design-vue/pull/1217)
- 🐞 Fixed an issue with 'TimePicker` input error [#1176](https://github.com/vueComponent/ant-design-vue/issues/1176)
- 🐞 Fix `defaultVisible` attribute invalidation problem for `Tooltip` component [#1232](https://github.com/vueComponent/ant-design-vue/issues/1232)
- 🐞 Fix `Comment` `ConfigProvider` TypeScript type definition problem.

## 1.3.16

`2019-08-25`

- 🐞 Fix `Select` component to uninstall component error when there is no input [#1091](https://github.com/vueComponent/ant-design-vue/pull/1091)
- 🐞 Fix `Collapse` error when no child element [#1116](https://github.com/vueComponent/ant-design-vue/pull/1116)
- 🐞 Fix TypeScript type definitions.

## 1.3.15

`2019-08-17`

- 🐞 Fix `Select` component cannot scroll under IE [#999](https://github.com/vueComponent/ant-design-vue/issues/999)
- 🐞 Fix `Form` `initialValue` warning [#1076](https://github.com/vueComponent/ant-design-vue/issues/1076)
- 🐞 Fix `Form` error when verifying `Number` type [#1090](https://github.com/vueComponent/ant-design-vue/issues/1090)

## 1.3.14

`2019-08-12`

- 🐞 Fix `MenuItem` parsing array `class` incorrect question [#1009](https://github.com/vueComponent/ant-design-vue/issues/1009)
- 🐞 Fix an error when npm install [#997](https://github.com/vueComponent/ant-design-vue/issues/997)
- 🐞 Fix `Select` component cannot scroll under IE [#999](https://github.com/vueComponent/ant-design-vue/issues/999)
- 🐞 Fix `Select` component does not trigger focus event problem [#999](https://github.com/vueComponent/ant-design-vue/issues/999)
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
- 🌟 `AutoComplete` `Cascader` `DatePicker` `DropDown` `Select` `TimePicker` add an instance of the popup reference `popupRef` [f9373e](https://github.com/vueComponent/ant-design-vue/commit/f9373e44ce229ab0ba94ababbd686e6ad6e9f10f)
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

  1.3.0 brings two new Components, a lot of exciting changes and new features.

- 🔥 Added a new component [Comment](https://www.antdv.com/components/comment/)。
- 🔥 dded a new component [ConfigProvider](https://www.antdv.com/components/config-provider/) for user to customize some global setting.

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

- 🔥🔥🔥 In the 1.1.10 version, the `Form` component better supports the single-file tempalte syntax. In previous versions, complex component requirements were required to be implemented using JSX. In order to better use the automatic collection and validation of Form forms in the template, we have optimized the way components are used. All Demo files are refactored using the latest syntax. However, for the previous API, continue to support, you can not worry about the API changes, resulting in problems in the existing system.

```html
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
```

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
- 🐞 Fix `Cascader` component does not support `getPopupContainer` problem [#257](https://github.com/vueComponent/ant-design-vue/issues/257)
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
- 🐞 Fix `tabs` component property `tabBarGutter` does not work [#205](https://github.com/vueComponent/ant-design-vue/issues/205)
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
- 🐞 Fix `Spin` content flicker problem [#174](https://github.com/vueComponent/ant-design-vue/issues/174)
- 🐞 Fix `RangePicker` selection is not disabled [#158](https://github.com/vueComponent/ant-design-vue/issues/158)
- 🐞 Fixed throw error when `Form` value was `null` [#153](https://github.com/vueComponent/ant-design-vue/issues/153)
- 🐞 Fix the `Modal` subcomponent to repeat the `mounted` question [#152](https://github.com/vueComponent/ant-design-vue/issues/152)
- 🐞 Fixed donot `render` after 'Transfer` search filter [#148](https://github.com/vueComponent/ant-design-vue/issues/148)
- 🐞 Fixed multi-level `Tabs` component nesting causing `size` not to work [#144](https://github.com/vueComponent/ant-design-vue/issues/144)
- 🐞 Fix `TreeSelect`searchPlaceholder does not work [#125](https://github.com/vueComponent/ant-design-vue/issues/125)
- 🛠 Other issues that do not appear in the issue, see antd changelog

## 1.0.3

`2018-08-11`

- 🐞 Fix `Select` children not to update the problem [#106](https://github.com/vueComponent/ant-design-vue/issues/106)
- 🐞 Fix `Badge` offset x y axis order error and support number type [#99](https://github.com/vueComponent/ant-design-vue/issues/99)
- 🐞 Fix `Input` trigger input event problem when placeholder is Chinese in IE[#92](https://github.com/vueComponent/ant-design-vue/issues/92)
- 🐞 Fix `Avatar` does not accept event issues [#102](https://github.com/vueComponent/ant-design-vue/issues/102)
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
- 🐞 `DatePicker`: Fix the issue of `change` event repeatedly call when `showTime` is `true` [81ab82](https://github.com/vueComponent/ant-design-vue/commit/81ab829b1d0f67ee926b106de788fc5b41ec4f9c)
- 🐞 `InputNumber`: Fix `placeholder` not working [ce39dc](https://github.com/vueComponent/ant-design-vue/commit/ce39dc3506474a4b31632e03c38b518cf4060cef#diff-c9d10303f22c684e66d71ab1f9dac5f9R50)

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

- 🐞 fix menu click bug

## 0.4.1

#### bug

- Transfer Vue's dependencies to devDependencies to avoid unstable bugs caused by inconsistency with business versions

## 0.4.0

#### Layout

- add `layout` component

#### Others

- support use [Vue.use(antd)](https://github.com/vueComponent/ant-design-vue/issues/3)

## 0.3.1

#### Features

- first version, provide 45 [components](https://github.com/vueComponent/ant-design-vue/blob/c7e83d6142f0c5e72ef8fe794620478e69a50a8e/site/components.js)
