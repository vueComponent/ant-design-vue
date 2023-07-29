---
category: Components
type: Feedback
title: Spin
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*5mC5TomY4B0AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*i43_ToFrL8YAAAAAAAAAAAAADrJ8AQ/original
---

A spinner for displaying loading state of a page or a section.

## When To Use

When part of the page is waiting for asynchronous data or during a rendering process, an appropriate loading animation can effectively alleviate users' inquietude.

## API

| Property | Description | Type | Default Value | Version |
| --- | --- | --- | --- | --- |
| delay | specifies a delay in milliseconds for loading state (prevent flush) | number (milliseconds) | - |  |
| indicator | vue node of the spinning indicator | vNode \|slot | - |  |
| size | size of Spin, options: `small`, `default` and `large` | string | `default` |  |
| spinning | whether Spin is visible | boolean | true |  |
| tip | customize description content when Spin has children | string \| slot | - | slot 3.0 |
| wrapperClassName | className of wrapper when Spin has children | string | - |  |

### Static Method

- `Spin.setDefaultIndicator({indicator})` As `indicator`, you can define the global default spin element

```jsx
import { h } from 'vue';
Spin.setDefaultIndicator({
  indicator: h('i', { class: 'anticon anticon-loading anticon-spin ant-spin-dot' }),
});
```
