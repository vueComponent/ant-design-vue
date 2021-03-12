## API

### Anchor Props

| 成员 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| affix | 固定模式 | boolean | true |  |
| bounds | 锚点区域边界 | number | 5(px) |  |
| getContainer | 指定滚动的容器 | () => HTMLElement | () => window |  |
| offsetBottom | 距离窗口底部达到指定偏移量后触发 | number |  |  |
| offsetTop | 距离窗口顶部达到指定偏移量后触发 | number |  |  |
| showInkInFixed | 固定模式是否显示小圆点 | boolean | false |  |
| wrapperClass | 容器的类名 | string | - |  |
| wrapperStyle | 容器样式 | object | - |  |
| getCurrentAnchor | 自定义高亮的锚点 | () => string | - | 1.5.0 |
| targetOffset | 锚点滚动偏移量，默认与 offsetTop 相同，[例子](#components-anchor-demo-targetOffset) | number | `offsetTop` | 1.5.0 |

### 事件

| 事件名称 | 说明                   | 回调参数                            | 版本 |
| -------- | ---------------------- | ----------------------------------- | ---- |
| click    | `click` 事件的 handler | Function(e: Event, link: Object)    |      |
| change   | 监听锚点链接改变       | (currentActiveLink: string) => void |      | 1.5.0 |

### Link Props

| 成员   | 说明                             | 类型         | 默认值 | 版本  |
| ------ | -------------------------------- | ------------ | ------ | ----- |
| href   | 锚点链接                         | string       |        |       |
| title  | 文字内容                         | string\|slot |        |       |
| target | 该属性指定在何处显示链接的资源。 | string       |        | 1.5.0 |
