---
category: Components
type: 反馈
title: Result
subtitle: 结果
cover: https://gw.alipayobjects.com/zos/alicdn/9nepwjaLa/Result.svg
---

用于反馈一系列操作任务的处理结果。

## 何时使用

当有重要操作需告知用户处理结果，且反馈内容较为复杂时使用。

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | title 文字 | string \| VNode \| #title | - |
| subTitle | subTitle 文字 | string \| VNode \| #subTitle | - |
| status | 结果的状态,决定图标和颜色 | `'success' | 'error' | 'info' | 'warning'| '404' | '403' | '500'` | 'info' |
| icon | 自定义 icon | #icon | - |
| extra | 操作区 | #extra | - |
