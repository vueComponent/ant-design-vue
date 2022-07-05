---
category: Components
type: Data Display
title: Badge
cover: https://gw.alipayobjects.com/zos/antfincdn/6%26GF9WHwvY/Badge.svg
---

Small numerical value or status descriptor for UI elements.

## When To Use

Badge normally appears in proximity to notifications or user avatars with eye-catching appeal, typically displaying unread messages count.

## API

```html
<a-badge :count="5">
  <a href="#" class="head-example" />
</a-badge>
```

```html
<a-badge :count="5" />
```

### Badge

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| color | Customize Badge dot color | string | - | 1.5.0 |
| count | Number to show in badge | number\|string \| slot |  |  |
| dot | Whether to display a red dot instead of `count` | boolean | `false` |  |
| offset | set offset of the badge dot, like [x, y] | [number\|string, number\|string] | - |  |
| overflowCount | Max count to show | number | 99 |  |
| showZero | Whether to show badge when `count` is zero | boolean | `false` |  |
| text | `text` sets the display text of the status `dot` | string | `''` |  |
| numberStyle | sets the display style of the status `dot` | object | '' |  |
| title | Text to show when hovering over the badge | string | `count` |  |

### Badge.Ribbon (2.0.1+)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| color | Customize Ribbon color | string | - |  |
| placement | The placement of the Ribbon, `start` and `end` follow text direction (RTL or LTR) | `start` \| `end` | `end` |  |
| text | Content inside the Ribbon | string \| VNode \| slot | - |  |
