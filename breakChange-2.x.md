# break change

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
