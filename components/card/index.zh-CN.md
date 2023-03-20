---
category: Components
type: 数据展示
title: Card
subtitle: 卡片
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*VXtCTp93KPAAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*a-8zR6rrupgAAAAAAAAAAAAADrJ8AQ/original
---

通用卡片容器

## 何时使用

最基础的卡片容器，可承载文字、列表、图片、段落，常用于后台概览页面。

## API

### Card

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| activeTabKey | 当前激活页签的 key | string | - |  |
| bodyStyle | 内容区域自定义样式 | object | - |  |
| bordered | 是否有边框 | boolean | true |  |
| defaultActiveTabKey | 初始化选中页签的 key，如果没有设置 activeTabKey | string | 第一个页签 |  |
| extra | 卡片右上角的操作区域 | string\|slot | - |  |
| headStyle | 自定义标题区域样式 | object | - |  |
| hoverable | 鼠标移过时可浮起 | boolean | false |  |
| loading | 当卡片内容还在加载中时，可以用 loading 展示一个占位 | boolean | false |  |
| size | card 的尺寸 | `default` \| `small` | `default` |  |
| tabList | 页签标题列表, 可以通过 customTab(v3.0) 插槽自定义 tab | Array&lt;{key: string, tab: any}> | - |  |
| title | 卡片标题 | string\|slot | - |  |
| type | 卡片类型，可设置为 `inner` 或 不设置 | string | - |  |

### Card 插槽

| 插槽名称           | 说明                       | 参数                      |     |
| ------------------ | -------------------------- | ------------------------- | --- |
| actions            | 卡片操作组，位置在卡片底部 | -                         |     |
| cover              | 卡片封面                   | -                         |     |
| customTab          | 自定义 tabList tab 标签    | { item: tabList[number] } |     |
| extra              | 卡片右上角的操作区域       | -                         |     |
| tabBarExtraContent | tab bar 上额外的元素       | -                         |     |
| title              | 卡片标题                   | -                         |     |

### 事件

| 事件名称  | 说明           | 回调参数      | 版本 |     |
| --------- | -------------- | ------------- | ---- | --- |
| tabChange | 页签切换的回调 | (key) => void | -    |     |

### Card.Grid

### Card.Meta

| 参数        | 说明      | 类型         | 默认值 | 版本 |
| ----------- | --------- | ------------ | ------ | ---- |
| avatar      | 头像/图标 | slot         | -      |      |
| description | 描述内容  | string\|slot | -      |      |
| title       | 标题内容  | string\|slot | -      |      |
