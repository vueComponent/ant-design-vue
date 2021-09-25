---
category: Components
type: Data Display
title: Avatar
cover: https://gw.alipayobjects.com/zos/antfincdn/aBcnbw68hP/Avatar.svg
---

Avatars can be used to represent people or objects. It supports images, `Icon`s, or letters.

## API

### Avatar

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| icon | the `Icon` type for an icon avatar, see `Icon` Component | VNode \| slot | - |
| shape | the shape of avatar | `circle` \| `square` | `circle` |
| size | The size of the avatar | number \| `large` \| `small` \| `default` \| { xs: number, sm: number, ...} | `default` | 2.2.0 |
| src | the address of the image for an image avatar | string | - |
| srcset | a list of sources to use for different screen resolutions | string | - |
| alt | This attribute defines the alternative text describing the image | string | - |
| gap | Letter type unit distance between left and right sides | number | 4 | 2.2.0 |
| draggable | Whether the picture is allowed to be dragged | boolean \| `'true'` \| `'false'` | - | 2.2.0 |
| loadError | handler when img load error, return false to prevent default fallback behavior | () => boolean | - |

### Avatar.Group (2.2.0)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| maxCount | Max avatars to show | number | - |  |
| maxPopoverPlacement | The placement of excess avatar Popover | `top` \| `bottom` | `top` |  |
| maxStyle | The style of excess avatar style | CSSProperties | - |  |
| size | The size of the avatar | number \| `large` \| `small` \| `default` \| { xs: number, sm: number, ...} | `default` |  |
