## API

### Descriptions props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 描述列表的标题，显示在最顶部 | string \| VNode \| v-slot:title | - |
| bordered | 是否展示边框 | boolean | false |
| column | 一行的 `DescriptionItems` 数量，可以写成像素值或支持响应式的对象写法 `{ xs: 8, sm: 16, md: 24}` | number | 3 |
| size | 设置列表的大小。可以设置为 `middle` 、`small`, 或不填（只有设置 `bordered={true}` 生效） | `default | middle | small` | `default` |
| layout | 描述布局 | `horizontal | vertical` | `horizontal` |
| colon | 配置 `Descriptions.Item` 的 `colon` 的默认值 | boolean | true |

### Item props

| 参数  | 说明         | 类型                            | 默认值 |
| ----- | ------------ | ------------------------------- | ------ |
| label | 内容的描述   | string \| VNode \| v-slot:label | -      |
| span  | 包含列的数量 | number                          | 1      |

> span 是 Descriptions.Item 的数量。 span={2} 会占用两个 DescriptionsItem 的宽度。
