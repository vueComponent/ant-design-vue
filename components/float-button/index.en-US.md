---
category: Components
type: Other
title: FloatButton
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*HS-wTIIwu0kAAAAAAAAAAAAADrJ8AQ/original
---

FloatButton. Available since `4.0.0`.

## When To Use

- For global functionality on the site.
- Buttons that can be seen wherever you browse.

## API

> This component is available since `ant-design-vue@4.0.0`.

### common API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| icon | Set the icon component of button | slot | - |  |
| description | Text and other | string \| slot | - |  |
| tooltip | The text shown in the tooltip | string \| slot |  |  |
| type | Setting button type | `default` \| `primary` | `default` |  |
| shape | Setting button shape | `circle` \| `square` | `circle` |  |
| onClick | Set the handler to handle `click` event | (event) => void | - |  |
| href | The target of hyperlink | string | - |  |
| target | Specifies where to display the linked URL | string | - |  |

### FloatButton.Group

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| shape | Setting button shape of children | `circle` \| `square` | `circle` |  |
| trigger | Which action can trigger menu open/close | `click` \| `hover` | - |  |
| open | Whether the menu is visible or not | boolean | - |  |
| onOpenChange | Callback executed when active menu is changed | (open: boolean) => void | - |  |

### FloatButton.BackTop

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| duration | Time to return to top（ms） | number | 450 |  |
| target | Specifies the scrollable area dom node | () => HTMLElement | () => window |  |
| visibilityHeight | The BackTop button will not show until the scroll height reaches this value | number | 400 |  |
| onClick | A callback function, which can be executed when you click the button | () => void | - |  |
