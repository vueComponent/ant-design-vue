---
category: Components
type: Feedback
title: Popconfirm
cover: https://gw.alipayobjects.com/zos/alicdn/fjMCD9xRq/Popconfirm.svg
---

A simple and compact confirmation dialog of an action.

## When To Use

A simple and compact dialog used for asking for user confirmation.

The difference with the 'confirm' modal dialog is that it's more lightweight than the static popped full-screen confirm modal.

## API

| Param | Description | Type | Default value | Version |
| --- | --- | --- | --- | --- |
| cancelButtonProps | The cancel button props | [ButtonProps](/components/button/#API) | - |
| cancelText | text of the Cancel button | string\|slot | `Cancel` |  |
| cancelButton | custom render cancel button | slot | - | 3.0 |
| okButtonProps | The ok button props | [ButtonProps](/components/button/#API) | - |
| okText | text of the Confirm button | string\|slot | `Confirm` |  |
| okButton | custom render confirm button | slot | - | 3.0 |
| okType | Button `type` of the Confirm button | string | `primary` |  |
| title | title of the confirmation box | string\|slot | - |  |
| visible (v-model) | hide or show | boolean| - |  |
| icon | customize icon of confirmation | vNode\|slot | &lt;Icon type="exclamation-circle" /&gt; |  |
| disabled | is show popconfirm when click its childrenNode | boolean | false | |

### events

| Events Name | Description | Arguments |
| --- | --- | --- | --- |
| cancel | callback of cancel | function(e) | - |
| confirm | callback of confirmation | function(e) | - |
| visibleChange | Callback executed when visibility of the tooltip card is changed | function(visible) | - |

Consult [Tooltip's documentation](/components/tooltip/#API) to find more APIs.

## Note

Please ensure that the child node of `Popconfirm` accepts `mouseenter`, `mouseleave`, `focus`, `click` events.
