---
category: Components
title: ColorPicker
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*PpY4RYNM8UcAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*EHL-QYJofZsAAAAAAAAAAAAADrJ8AQ/original
---

Components providing color selection, Available since `4.0.0`.

## When To Use

Used when the user needs to customize the color selection.

## API

> This component is available since `antdv@4.0.0`.

<!-- prettier-ignore -->
| Property | Description | Type | Default | Version |
| :-- | :-- | :-- | :-- | :-- |
| allowClear |  Allow clearing color selected | boolean | false | |
| arrow | Configuration for popup arrow | `boolean \| { pointAtCenter: boolean }` | true | |
| children | Trigger of ColorPicker | VueNode | - | |
| defaultValue | Default value of color | string \| `Color` | - | |
| disabled | Disable ColorPicker | boolean | - | |
| destroyTooltipOnHide | Whether destroy popover when hidden | `boolean` | false | - |
| format | Format of color | `rgb` \| `hex` \| `hsb` | `hex` | |
| open | Whether to show popup | boolean | - | |
| presets |  Preset colors | `{ label: ReactNode, colors: Array<string \| Color> }[]` | - | |
| placement | Placement of popup | `top` \| `topLeft` \| `topRight` \| `bottom` \| `bottomLeft` \| `bottomRight` | `bottomLeft` | |
| panelRender | Custom Render Panel | `(panel: VueNode, extra: { components: { Picker: FC; Presets: FC } }) => VueNode` | - | - |
| showText | Show color text | boolean \| `(color: Color) => VueNode` | - | - |
| size | Setting the trigger size | `large` \| `middle` \| `small` | `middle` | - |
| trigger | ColorPicker trigger mode | `hover` \| `click` | `click` | |
| value | Value of color | string \| `Color` | - | |
| onChange | Callback when `value` is changed | `(value: Color, hex: string) => void` | - | |
| onChangeComplete | Called when color pick ends   | `(value: Color) => void` | - | - |
| onFormatChange | Callback when `format` is changed | `(format: 'hex' \| 'rgb' \| 'hsb') => void` | - | |
| onOpenChange | Callback when `open` is changed | `(open: boolean) => void` | - | |
| onClear | Called when clear | `() => void` | - | - |

### Color

<!-- prettier-ignore -->
| Property | Description | Type | Default |
| :-- | :-- | :-- | :-- |
| toHex | Convert to `hex` format characters, the return type like: `1677ff` | `() => string` | - |
| toHexString | Convert to `hex` format color string, the return type like: `#1677ff` | `() => string` | - |
| toHsb | Convert to `hsb` object  | `() => ({ h: number, s: number, b: number, a number })` | - |
| toHsbString | Convert to `hsb` format color string, the return type like: `hsb(215, 91%, 100%)` | `() => string` | - |
| toRgb | Convert to `rgb` object  | `() => ({ r: number, g: number, b: number, a number })` | - |
| toRgbString | Convert to `rgb` format color string, the return type like: `rgb(22, 119, 255)` | `() => string` | - |

## FAQ

### Questions about color assignment

The value of the color selector supports both string color values and selector-generated `Color` objects. However, since there is a precision error when converting color strings of different formats to each other, it is recommended to use selector-generated `Color` objects for assignment operations in controlled scenarios, so that the precision problem can be avoided and the values are guaranteed to be accurate and the selector can work as expected.
