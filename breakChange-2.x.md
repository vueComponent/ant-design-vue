# break change

## global api

所有 dom 原生属性由驼峰改成全小写，涉及 API

####

maxLength -> maxlength tabIndex => tabindex readOnly => readonly autoComplete => autocomplete

## Tag

### CheckableTag

v-model -> v-model:checked

### Tag

v-model -> v-model:visible

移除 afterClose 属性

## Radio

radioGroup radio v-model -> v-model:value

## popconfirm

okButtonProps、cancelButtonProps 扁平化处理

v-model -> v-model:visible

## popover

v-model -> v-model:visible

## Tooltip

v-model -> v-model:visible

## Modal

v-model -> v-model:visible

okButtonProps、cancelButtonProps 扁平化处理

## Mentions

v-model -> v-model:value

## menu

v-model -> v-model:selectedKeys :openKeys.sync -> v-mdoel:openKeys

## dropdown

v-model -> v-model:visible

## Steps

v-model -> v-model:current

## checkbox

v-model -> v-model:checked

checkboxGroup

v-model -> v-model:value

## Switch

v-model -> v-model:checked

## tabs

v-model -> v-model:activeKey

renderTabBar({props, on, style, class}, DefaultTabBar) -> {DefaultTabBar, ...props} 多参数改成单参数并且扁平化处理

## card

tabList[{scopedSlots}] -> tabList[{slots}]

## rate

v-model -> v-model:value

## Collapse

v-model -> v-model:activeKey

## List

renderItem(item, index) => renderItem({item, index}) 该用单参数

## TreeSelect

treeData 中 scopedSlots => slots , v-model => v-model:value

## datePicker

dateRender

(current: moment.Moment, today: moment.Moment) => ({current: moment.Moment, today: moment.Moment})

monthCellContentRender (date, locale) => ({date, locale})

## table

customRender( text, record, index, column ); => customRender({ text, record, index, column });

expandedRowRender(record, index, indent, expanded) => expandedRowRender({ record, index, indent, expanded })

filterIcon(filtered, column) => filterIcon({ filtered, column })

## calendar

dateCellRender、dateFullCellRender、monthCellRender、monthFullCellRender

function (date, today?) => function({current, today?})
