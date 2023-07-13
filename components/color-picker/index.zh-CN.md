---
category: Components
subtitle: 颜色选择器
title: ColorPicker
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*PpY4RYNM8UcAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*EHL-QYJofZsAAAAAAAAAAAAADrJ8AQ/original
---

提供颜色选取的组件，自 `4.0.0` 版本开始提供该组件。

## 何时使用

当用户需要自定义颜色选择的时候使用。

## API

> 自 `antdv@4.0.0` 版本开始提供该组件。

<!-- prettier-ignore -->
| 参数 | 说明 | 类型 | 默认值 | 版本 |
| :-- | :-- | :-- | :-- | :-- |
| allowClear | 允许清除选择的颜色 | boolean | false | |
| arrow | 配置弹出的箭头 | `boolean \| { pointAtCenter: boolean }` | true | |
| children | 颜色选择器的触发器 | VueNode | - | |
| defaultValue | 颜色默认的值 | string \| `Color` | - | |
| disabled | 禁用颜色选择器 | boolean | - | |
| destroyTooltipOnHide | 关闭后是否销毁弹窗 | `boolean` | false | - |
| format | 颜色格式 | `rgb` \| `hex` \| `hsb` | `hex` | |
| open | 是否显示弹出窗口 | boolean | - | |
| presets | 预设的颜色 | `{ label: ReactNode, colors: Array<string \| Color> }[]` | - | |
| placement | 弹出窗口的位置 | `top` \| `topLeft` \| `topRight` \| `bottom` \| `bottomLeft` \| `bottomRight` | `bottomLeft` | |
| panelRender | 自定义渲染面板 | `(panel: VueNode, extra: { components: { Picker: FC; Presets: FC } }) => VueNode` | - | - |
| showText | 显示颜色文本 | boolean \| `(color: Color) => VueNode` | - | - |
| size | 设置触发器大小 | `large` \| `middle` \| `small` | `middle` | - |
| trigger | 颜色选择器的触发模式 | `hover` \| `click` | `click` | |
| value | 颜色的值 | string \| `Color` | - | |
| onChange | 颜色变化的回调 | `(value: Color, hex: string) => void` | - | |
| onChangeComplete | 颜色选择完成的回调  | `(value: Color) => void` | - | - |
| onFormatChange | 颜色格式变化的回调 | `(format: 'hex' \| 'rgb' \| 'hsb') => void` | - | |
| onOpenChange | 当 `open` 被改变时的回调 | `(open: boolean) => void` | - | |
| onClear | 清除的回调 | `() => void` | - | - |

### Color

<!-- prettier-ignore -->
| 参数 | 说明 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| toHex | 转换成 `hex` 格式字符，返回格式如：`1677ff` | `() => string` | - |
| toHexString | 转换成 `hex` 格式颜色字符串，返回格式如：`#1677ff` | `() => string` | - |
| toHsb | 转换成 `hsb` 对象  | `() => ({ h: number, s: number, b: number, a number })` | - |
| toHsbString | 转换成 `hsb` 格式颜色字符串，返回格式如：`hsb(215, 91%, 100%)` | `() => string` | - |
| toRgb | 转换成 `rgb` 对象  | `() => ({ r: number, g: number, b: number, a number })` | - |
| toRgbString | 转换成 `rgb` 格式颜色字符串，返回格式如：`rgb(22, 119, 255)` | `() => string` | - |

## FAQ

### 关于颜色赋值的问题

颜色选择器的值同时支持字符串色值和选择器生成的 `Color` 对象，但由于不同格式的颜色字符串互相转换会有精度误差问题，所以受控场景推荐使用选择器生成的 `Color` 对象来进行赋值操作，这样可以避免精度问题，保证取值是精准的，选择器也可以按照预期工作。
