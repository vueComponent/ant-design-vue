---
category: Components
type: Feedback
title: Alert
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Ct7bT7rrTTAAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*-U3XQqYN7VsAAAAAAAAAAAAADrJ8AQ/original
---

Alert component for feedback.

## When To Use

- When you need to show alert messages to users.
- When you need a persistent static container which is closable by user actions.

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| action | The action of Alert | slot | - | 4.0.0 |
| afterClose | Called when close animation is finished | () => void | - |  |
| banner | Whether to show as banner | boolean | false |  |
| closable | Whether Alert can be closed | boolean |  |  |
| closeIcon | Custom close icon | slot | `<CloseOutlined />` | 3.0 |
| closeText | Close text to show | string\|slot | - |  |
| description | Additional content of Alert | string\|slot | - |  |
| icon | Custom icon, effective when `showIcon` is `true` | vnode \| slot | - |  |
| message | Content of Alert | string\|slot | - |  |
| showIcon | Whether to show icon | boolean | false,in `banner` mode default is true |  |
| type | Type of Alert styles, options: `success`, `info`, `warning`, `error` | string | `info`,in `banner` mode default is `warning` |  |

### events

| Events Name | Description                   | Arguments               | Version |
| ----------- | ----------------------------- | ----------------------- | ------- |
| close       | Callback when Alert is closed | (e: MouseEvent) => void | -       |
