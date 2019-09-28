## API

### Card

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| actions | 卡片操作组，位置在卡片底部 | slots | - |
| activeTabKey | 当前激活页签的 key | string | - |
| headStyle | 自定义标题区域样式 | object | - |
| bodyStyle | 内容区域自定义样式 | object | - |
| bordered | 是否有边框 | boolean | true |
| cover | 卡片封面 | slot | - |
| defaultActiveTabKey | 初始化选中页签的 key，如果没有设置 activeTabKey | string | 第一个页签 |
| extra | 卡片右上角的操作区域 | string\|slot | - |
| hoverable | 鼠标移过时可浮起 | boolean | false |
| loading | 当卡片内容还在加载中时，可以用 loading 展示一个占位 | boolean | false |
| tabList | 页签标题列表, 可以通过 scopedSlots 属性自定义 tab | Array<{key: string, tab: any, scopedSlots: {tab: 'XXX'}}> | - |
| size | card 的尺寸 | `default` \| `small` | `default` |
| title | 卡片标题 | string\|slot | - |
| type | 卡片类型，可设置为 `inner` 或 不设置 | string | - |

### 事件

| 事件名称  | 说明           | 回调参数      |
| --------- | -------------- | ------------- |
| tabChange | 页签切换的回调 | (key) => void | - |

### Card.Grid

### Card.Meta

| Property    | Description | Type         | Default |
| ----------- | ----------- | ------------ | ------- |
| avatar      | 头像/图标   | slot         | -       |
| description | 描述内容    | string\|slot | -       |
| title       | 标题内容    | string\|slot | -       |
