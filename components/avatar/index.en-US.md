---
category: Components
type: Data Display
title: Avatar
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*JJBSS5lBG4IAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YbgyQaRGz-UAAAAAAAAAAAAADrJ8AQ/original
---

Avatars can be used to represent people or objects. It supports images, `Icon`s, or letters.

## API

### Avatar

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| alt | This attribute defines the alternative text describing the image | string | - |  |
| crossOrigin | cors settings attributes | `'anonymous'` \| `'use-credentials'` \| `''` | - | 3.0 |
| draggable | Whether the picture is allowed to be dragged | boolean \| `'true'` \| `'false'` | - | 2.2.0 |
| gap | Letter type unit distance between left and right sides | number | 4 | 2.2.0 |
| icon | the `Icon` type for an icon avatar, see `Icon` Component | VNode \| slot | - |  |
| loadError | handler when img load error, return false to prevent default fallback behavior | () => boolean | - |  |
| shape | the shape of avatar | `circle` \| `square` | `circle` |  |
| size | The size of the avatar | number \| `large` \| `small` \| `default` \| { xs: number, sm: number, ...} | `default` | 2.2.0 |
| src | the address of the image for an image avatar | string | - |  |
| srcset | a list of sources to use for different screen resolutions | string | - |  |

### Avatar.Group (2.2.0)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| maxCount | Max avatars to show | number | - |  |
| maxPopoverPlacement | The placement of excess avatar Popover | `top` \| `bottom` | `top` |  |
| maxPopoverTrigger | Set the trigger of excess avatar Popover | `hover` \| `focus` \| `click` | `hover` | 3.0 |
| maxStyle | The style of excess avatar style | CSSProperties | - |  |
| size | The size of the avatar | number \| `large` \| `small` \| `default` \| { xs: number, sm: number, ...} | `default` |  |
| shape | The shape of the avatar | `circle` \| `square` | `circle` | 4.0 |
