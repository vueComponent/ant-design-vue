---
category: Components
title: ColorPicker
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*PpY4RYNM8UcAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*EHL-QYJofZsAAAAAAAAAAAAADrJ8AQ/original
---

Components providing color selection, Available since `5.5.0`.

## When To Use

Used when the user needs to customize the color selection.

## API

> This component is available since `antd@5.5.0`.

<!-- prettier-ignore -->
| Property | Description | Type | Default |
| :-- | :-- | :-- | :-- |
| format | Format of color | `rgb` \| `hex` \| `hsb` | `hex` |
| onFormatChange | Callback when `format` is changed | `(format: 'hex' \| 'rgb' \| 'hsb') => void` | - |
| value | Value of color | string \| `Color` | - |
| defaultValue | Default value of color | string \| `Color` | - |
| onChange | Callback when `value` is changed | `(value: Color, hex: string) => void` | - |
| allowClear |  Allow clearing color selected | boolean | false |
| presets |  Preset colors | `{ label: VueNode, colors: Array<string \| Color> }[]` | - |
| children | Trigger of ColorPicker | VueNode | - |
| trigger | ColorPicker trigger mode | `hover` \| `click` | `click` |
| open | Whether to show popup | boolean | - |
| onOpenChange | Callback when `open` is changed | `(open: boolean) => void` | - |
| disabled | Disable ColorPicker | boolean | - |
| placement | Placement of popup | `top` \| `topLeft` \| `topRight` \| `bottom` \| `bottomLeft` \| `bottomRight` | `bottomLeft` |
| arrow | Configuration for popup arrow | `boolean \| { pointAtCenter: boolean }` | `true` | - |

### Color

<!-- prettier-ignore -->
| Property | Description | Type | Default |
| :-- | :-- | :-- | :-- |
| toHex | Convert to `hex` format characters | `() => string` | - |
| toHexString | Convert to `hex` format color string | `() => string` | - |
| toHsb | Convert to `hsb` object  | `() => ({ h: number, s: number, b: number, a number })` | - |
| toHsbString | Convert to `hsb` format color string | `() => string` | - |
| toRgb | Convert to `rgb` object  | `() => ({ r: number, g: number, b: number, a number })` | - |
| toRgbString | Convert to `rgb` format color string | `() => string` | - |

## FAQ

### Questions about color assignment

The value of the color selector supports both string color values and selector-generated `Color` objects. However, since there is a precision error when converting color strings of different formats to each other, it is recommended to use selector-generated `Color` objects for assignment operations in controlled scenarios, so that the precision problem can be avoided and the values are guaranteed to be accurate and the selector can work as expected.
