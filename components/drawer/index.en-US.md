---
category: Components
type: Feedback
title: Drawer
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*v3TvSq2E0HAAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*4wzwRIBLuqEAAAAAAAAAAAAADrJ8AQ/original
---

A panel which slides in from the edge of the screen.

## When To Use

A Drawer is a panel that is typically overlaid on top of a page and slides in from the side. It contains a set of information or actions. Since the user can interact with the Drawer without leaving the current page, tasks can be achieved more efficiently within the same context.

- Use a Form to create or edit a set of information.
- Processing subtasks. When subtasks are too heavy for a Popover and we still want to keep the subtasks in the context of the main task, Drawer comes very handy.
- When the same Form is needed in multiple places.

## API

**🚨 Note:** v4 use `rootClassName` & `rootStyle` to config wrapper style instead of `class` & `style` in v4 to align the API with Modal.

| Props | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autofocus | Whether Drawer should get focused after open | boolean | true | 3.0.0 |
| bodyStyle | Style of the drawer content part | CSSProperties | - |  |
| class | Config Drawer Panel className. Use `rootClassName` if want to config top dom style | string | - |  |
| closable | Whether a close (x) button is visible on top left of the Drawer dialog or not | boolean | true |  |
| closeIcon | Custom close icon | VNode \| slot | `<CloseOutlined />` | 3.0.0 |
| contentWrapperStyle | Style of the drawer wrapper of content part | CSSProperties | - | 3.0.0 |
| destroyOnClose | Whether to unmount child components on closing drawer or not | boolean | false |  |
| extra | Extra actions area at corner | VNode \| slot | - | 3.0.0 |
| footer | The footer for Drawer | VNode \| slot | - | 3.0.0 |
| footerStyle | Style of the drawer footer part | CSSProperties | - | 3.0.0 |
| forceRender | Prerender Drawer component forcely | boolean | false | 3.0.0 |
| getContainer | mounted node and display window for Drawer | HTMLElement \| `() => HTMLElement` \| Selectors | 'body' |  |
| headerStyle | Style of the drawer header part | CSSProperties | - | 3.0.0 |
| height | Placement is `top` or `bottom`, height of the Drawer dialog | string \| number | 378 |  |
| keyboard | Whether support press esc to close | boolean | true |  |
| mask | Whether to show mask or not | Boolean | true |  |
| maskClosable | Clicking on the mask (area outside the Drawer) to close the Drawer or not | boolean | true |  |
| maskStyle | Style for Drawer's mask element | CSSProperties | {} |  |
| placement | The placement of the Drawer | 'top' \| 'right' \| 'bottom' \| 'left' | 'right' |  |
| push | Nested drawers push behavior | boolean \| {distance: string \| number} | { distance: 180 } | 3.0.0 |
| rootClassName | The class name of the container of the Drawer dialog | string | - | 4.0 |
| rootStyle | Style of wrapper element which **contains mask** compare to `style` | CSSProperties | - | 4.0 |
| style | Style of Drawer panel. Use `bodyStyle` if want to config body only | CSSProperties | - |  |
| size | presetted size of drawer, default `378px` and large `736px` | `default` \| `large` | `default` | 3.0.0 |
| style | Style of wrapper element which contains mask compare to drawerStyle | CSSProperties | - |  |
| title | The title for Drawer | string \| slot | - |  |
| open(v-model) | Whether the Drawer dialog is visible or not | boolean | - | 4.0 |
| width | Width of the Drawer dialog | string \| number | 378 |  |
| zIndex | The `z-index` of the Drawer | Number | 1000 |  |

## Events

| Events Name | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| afterOpenChange | Callback after the animation ends when switching drawers. | function(open) | - | 4.0 |
| close | Specify a callback that will be called when a user clicks mask, close button or Cancel button. | function(e) | - |  |
