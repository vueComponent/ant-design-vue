---
category: Components
type: Feedback
title: Result
cover: https://gw.alipayobjects.com/zos/alicdn/9nepwjaLa/Result.svg
---

Used to feed back the results of a series of operational tasks.

## When To Use

Use when important operations need to inform the user to process the results and the feedback is more complicated.

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| title | title string | string \| VNode \| #title | - |
| subTitle | subTitle string | string \| VNode \| #subTitle | - |
| status | result status,decide icons and colors | `'success' | 'error' | 'info' | 'warning'| '404' | '403' | '500'` | 'info' |
| icon | custom back icon | #icon | - |
| extra | operating area | #extra | - |
