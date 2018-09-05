## API

### Collapse

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| activeKey(v-model) | 当前激活 tab 面板的 key | string\[]\|string | 默认无，accordion模式下默认第一个元素 |
| defaultActiveKey | 初始化选中面板的 key | string | 无 |

### 事件
| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 切换面板的回调 | function(key) |

### Collapse.Panel

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| disabled | 禁用后的面板展开与否将无法通过用户交互改变 | boolean | false |
| forceRender | 被隐藏时是否渲染 DOM 结构 | boolean | false |
| header | 面板头内容 | string\|slot | 无 |
| key | 对应 activeKey | string | 无 |
