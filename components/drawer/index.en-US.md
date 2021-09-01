---
category: Components
type: Feedback
title: Drawer
cover: https://gw.alipayobjects.com/zos/alicdn/7z8NJQhFb/Drawer.svg
---

A panel which slides in from the edge of the screen.

## When To Use

A Drawer is a panel that is typically overlaid on top of a page and slides in from the side. It contains a set of information or actions. Since the user can interact with the Drawer without leaving the current page, tasks can be achieved more efficiently within the same context.

- Use a Form to create or edit a set of information.
- Processing subtasks. When subtasks are too heavy for a Popover and we still want to keep the subtasks in the context of the main task, Drawer comes very handy.
- When the same Form is needed in multiple places.


## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| closable | Whether a close (x) button is visible on top right of the Drawer dialog or not. | boolean | true |  |
| destroyOnClose | Whether to unmount child components on closing drawer or not. | boolean | false |  |
| getContainer | Return the mounted node for Drawer. | HTMLElement \| `() => HTMLElement` \| Selectors | 'body' |  |
| mask | Whether to show mask or not. | Boolean | true |  |
| maskClosable | Clicking on the mask (area outside the Drawer) to close the Drawer or not. | boolean | true |  |
| maskStyle | Style for Drawer's mask element. | object | {} |  |
| title | The title for Drawer. | string\|slot | - |  |
| visible(v-model) | Whether the Drawer dialog is visible or not. | boolean | false |  |
| wrapClassName | The class name of the container of the Drawer dialog. | string | - |  |
| wrapStyle | Style of wrapper element which **contains mask** compare to `drawerStyle` | object | - |  |
| drawerStyle | Style of the popup layer element | object | - |  |
| headerStyle | Style of the drawer header part | object | - |  |
| bodyStyle | Style of the drawer content part | object | - |  |
| width | Width of the Drawer dialog. | string\|number | 256 |  |
| height | placement is `top` or `bottom`, height of the Drawer dialog. | string\|number | - |  |
| zIndex | The `z-index` of the Drawer. | Number | 1000 |  |
| placement | The placement of the Drawer. | 'top' \| 'right' \| 'bottom' \| 'left' | 'right' |  |
| handle | After setting, the drawer is directly mounted on the DOM, and you can control the drawer to open or close through this `handle`. | VNode \| slot | - |  |
| afterVisibleChange | Callback after the animation ends when switching drawers. | function(visible) | - |  |
| keyboard | Whether support press esc to close | Boolean | true |  |

## Methods

| Name | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| close | Specify a callback that will be called when a user clicks mask, close button or Cancel button. | function(e) | - |  |
