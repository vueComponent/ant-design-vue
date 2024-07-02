---
category: Components
subtitle: 下拉菜单
type: 导航
title: Dropdown
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*mBBcQ6goljkAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*5qm4S4Zgh2QAAAAAAAAAAAAADrJ8AQ/original
---

向下弹出的列表。

## 何时使用

当页面上的操作命令过多时，用此组件可以收纳操作元素。点击或移入触点，会出现一个下拉菜单。可在列表中进行选择，并执行相应的命令。

- 用于收罗一组命令操作。
- Select 用于选择，而 Dropdown 是命令集合。

## API

属性如下

| 参数 | 说明 | 类型 | 默认值 |  |
| --- | --- | --- | --- | --- |
| align | 该值将合并到 placement 的配置中，设置参考 [dom-align](https://github.com/yiminghe/dom-align) | Object | - |  |
| arrow | 下拉框箭头是否显示 | boolean \| { pointAtCenter: boolean } | false | 3.3.0 |
| destroyPopupOnHide | 关闭后是否销毁 Dropdown | boolean | false | 3.0 |
| disabled | 菜单是否禁用 | boolean | - |  |
| getPopupContainer | 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。 | Function(triggerNode) | `() => document.body` |  |
| overlay(v-slot) | 菜单 | [Menu](/components/menu-cn) | - |  |
| overlayClassName | 下拉根元素的类名称 | string | - |  |
| overlayStyle | 下拉根元素的样式 | object | - |  |
| placement | 菜单弹出位置 | `bottomLeft` \| `bottom` \| `bottomRight` \| `topLeft` \| `top` \| `topRight` | `bottomLeft` |  |
| trigger | 触发下拉的行为, 移动端不支持 hover | Array&lt;`click`\|`hover`\|`contextmenu`> | `['hover']` |  |
| open(v-model) | 菜单是否显示 | boolean | - |  |

`overlay` 菜单使用 [Menu](/components/menu-cn/)，还包括菜单项 `Menu.Item`，分割线 `Menu.Divider`。

> 注意： Menu.Item 必须设置唯一的 key 属性。
>
> Dropdown 下的 Menu 默认不可选中。如果需要菜单可选中，可以指定 `<Menu selectable>`.

### 事件

| 事件名称 | 说明 | 回调参数 | 版本 |
| --- | --- | --- | --- |
| openChange | 菜单显示状态改变时调用，参数为 visible。点击菜单按钮导致的消失不会触发 | function(open) | 4.0 |

### Dropdown.Button

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| disabled | 菜单是否禁用 | boolean | - |  |
| icon | 右侧的 icon | VNode \| slot | - | 1.5.0 |
| loading | 设置按钮载入状态 | boolean \| { delay: number } | false | 3.0 |
| overlay(v-slot) | 菜单 | [Menu](/components/menu-cn/) | - |  |
| placement | 菜单弹出位置 | `bottomLeft` \| `bottom` \| `bottomRight` \| `topLeft` \| `top` \| `topRight` | `bottomLeft` |  |
| size | 按钮大小，和 [Button](/components/button-cn/) 一致 | string | 'default' |  |
| trigger | 触发下拉的行为 | Array&lt;`click`\|`hover`\|`contextmenu`> | `['hover']` |  |
| type | 按钮类型，和 [Button](/components/button-cn/) 一致 | string | 'default' |  |
| open(v-model) | 菜单是否显示 | boolean | - |  |

### Dropdown.Button 事件

| 事件名称 | 说明 | 回调参数 | 版本 |
| --- | --- | --- | --- |
| click | 点击左侧按钮的回调，和 [Button](/components/button-cn/) 一致 | Function |
| openChange | 菜单显示状态改变时调用，参数为 visible。点击菜单按钮导致的消失不会触发 | function(open) | 4.0 |
