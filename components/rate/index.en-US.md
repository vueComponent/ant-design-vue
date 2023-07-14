---
category: Components
type: Data Entry
title: Rate
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*oyOcTrB12_YAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*M7_ER7GJr6wAAAAAAAAAAAAADrJ8AQ/original
---

Rate component.

# When To Use

- Show evaluation.
- A quick rating operation on something.

## API

| Property       | Description                             | type           | Default            |
| -------------- | --------------------------------------- | -------------- | ------------------ |
| allowClear     | whether to allow clear when click again | boolean        | true               |
| allowHalf      | whether to allow semi selection         | boolean        | false              |
| autofocus      | get focus when component mounted        | boolean        | false              |
| character      | custom character of rate                | string \| slot | `<StarOutlined />` |
| count          | star count                              | number         | 5                  |
| disabled       | read only, unable to interact           | boolean        | false              |
| tooltips       | Customize tooltip by each character     | string[]       | -                  |
| value(v-model) | current value                           | number         | -                  |

### events

| Events Name | Description                        | Arguments               |     |
| ----------- | ---------------------------------- | ----------------------- | --- |
| blur        | callback when component lose focus | Function()              | -   |
| change      | callback when select value         | Function(value: number) | -   |
| focus       | callback when component get focus  | Function()              | -   |
| hoverChange | callback when hover item           | Function(value: number) | -   |
| keydown     | callback when keydown on component | Function(event)         | -   |

## Methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | remove focus |
| focus() | get focus    |
