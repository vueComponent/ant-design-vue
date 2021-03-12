## API

### Collapse

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| activeKey(v-model) | 当前激活 tab 面板的 key | string\[]\|string | 默认无，accordion 模式下默认第一个元素 |  |
| defaultActiveKey | 初始化选中面板的 key | string | 无 |  |
| bordered | 带边框风格的折叠面板 | boolean | `true` |  |
| accordion | 手风琴模式 | boolean | `false` |  |
| expandIcon | 自定义切换图标 | Function(props):VNode \| slot="expandIcon" slot-scope="props"\|v-slot:expandIcon="props" |  |
| expandIconPosition | 设置图标位置： `left`, `right` | `left` | - | 1.5.0 |
| destroyInactivePanel | 销毁折叠隐藏的面板 | boolean | `false` |  |

### 事件

| 事件名称 | 说明           | 回调参数      | 版本 |
| -------- | -------------- | ------------- | ---- |
| change   | 切换面板的回调 | function(key) |      |

### Collapse.Panel

| 参数        | 说明                                       | 类型          | 默认值 | 版本  |
| ----------- | ------------------------------------------ | ------------- | ------ | ----- |
| disabled    | 禁用后的面板展开与否将无法通过用户交互改变 | boolean       | false  |       |
| forceRender | 被隐藏时是否渲染 DOM 结构                  | boolean       | false  |       |
| header      | 面板头内容                                 | string\|slot  | 无     |       |
| key         | 对应 activeKey                             | string        | 无     |       |
| showArrow   | 是否展示当前面板上的箭头                   | boolean       | `true` |       |
| extra       | 自定义渲染每个面板右上角的内容             | VNode \| slot | -      | 1.5.0 |
