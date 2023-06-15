---
category: Components
type: 数据展示
title: List
subtitle: 列表
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*EYuhSpw1iSwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*tBzwQ7raKX8AAAAAAAAAAAAADrJ8AQ/original
---

通用列表。

## 何时使用

最基础的列表展示，可承载文字、列表、图片、段落，常用于后台数据展示页面。

## API

### List

| 参数 | 说明 | 类型 | 默认值 | 版本 |  |
| --- | --- | --- | --- | --- | --- |
| bordered | 是否展示边框 | boolean | false |  |  |
| dataSource | 列表数据源 | any\[] | - | 1.5.0 |  |
| footer | 列表底部 | string\|slot | - |  |  |
| grid | 列表栅格配置 | object | - |  |  |
| header | 列表头部 | string\|slot | - |  |  |
| itemLayout | 设置 `List.Item` 布局, 设置成 `vertical` 则竖直样式显示, 默认横排 | string | - |  |  |
| loading | 当卡片内容还在加载中时，可以用 `loading` 展示一个占位 | boolean\|[object](https://www.antdv.com/components/spin-cn/#api) | false |  |  |
| loadMore | 加载更多 | string\|slot | - |  |  |
| locale | 默认文案设置，目前包括空数据文案 | object | emptyText: '暂无数据' |  |  |
| pagination | 对应的 `pagination` [配置](https://www.antdv.com/components/pagination-cn/#api), 设置 `false` 不显示 | boolean\|object | false |  |  |
| renderItem | 自定义`Item`函数，也可使用 #renderItem="{item, index}" | ({item, index}) => vNode |  | - |  |
| rowKey | 各项 key 的取值，可以是字符串或一个函数 | item => string\|number |  |  |  |
| size | list 的尺寸 | `default` \| `middle` \| `small` | `default` |  |  |
| split | 是否展示分割线 | boolean | true |  |  |

### pagination

分页的配置项。

| 参数     | 说明               | 类型                        | 默认值   |
| -------- | ------------------ | --------------------------- | -------- |
| position | 指定分页显示的位置 | 'top' \| 'bottom' \| 'both' | 'bottom' |

更多配置项，请查看 [`Pagination`](https://www.antdv.com/components/pagination-cn/#api)。

### List grid props

| 参数   | 说明                 | 类型                                     | 默认值 | 版本 |
| ------ | -------------------- | ---------------------------------------- | ------ | ---- |
| column | 列数                 | number oneOf [ 1, 2, 3, 4, 6, 8, 12, 24] | -      |      |
| gutter | 栅格间隔             | number                                   | 0      |      |
| xxxl   | `≥2000px` 展示的列数 | number                                   | -      | 3.0  |
| xs     | `<576px` 展示的列数  | number                                   | -      |      |
| sm     | `≥576px` 展示的列数  | number                                   | -      |      |
| md     | `≥768px` 展示的列数  | number                                   | -      |      |
| lg     | `≥992px` 展示的列数  | number                                   | -      |      |
| xl     | `≥1200px` 展示的列数 | number                                   | -      |      |
| xxl    | `≥1600px` 展示的列数 | number                                   | -      |      |

### List.Item

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| actions | 列表操作组，根据 `itemLayout` 的不同, 位置在卡片底部或者最右侧 | vNode[] \| slot | - |
| extra | 额外内容, 通常用在 `itemLayout` 为 `vertical` 的情况下, 展示右侧内容; `horizontal` 展示在列表元素最右侧 | string\|slot | - |  |

### List.Item.Meta

| 参数        | 说明               | 类型         | 默认值 |
| ----------- | ------------------ | ------------ | ------ |
| avatar      | 列表元素的图标     | slot         | -      |
| description | 列表元素的描述内容 | string\|slot | -      |
| title       | 列表元素的标题     | string\|slot | -      |
