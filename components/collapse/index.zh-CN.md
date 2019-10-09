## API

### Collapse

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| activeKey(v-model) | 当前激活 tab 面板的 key | string\[]\|string | 默认无，accordion 模式下默认第一个元素 |
| defaultActiveKey | 初始化选中面板的 key | string | 无 |
| bordered | 带边框风格的折叠面板 | boolean | `true` |
| accordion | 手风琴模式 | boolean | `false` |
| expandIcon | 自定义切换图标 | Function(props):VNode \| slot="expandIcon" slot-scope="props"\|v-slot:expandIcon="props" |
| destroyInactivePanel | 销毁折叠隐藏的面板 | boolean | `false` |

### 事件

| 事件名称 | 说明           | 回调参数      |
| -------- | -------------- | ------------- |
| change   | 切换面板的回调 | function(key) |

### Collapse.Panel

| 参数        | 说明                                       | 类型         | 默认值 |
| ----------- | ------------------------------------------ | ------------ | ------ |
| disabled    | 禁用后的面板展开与否将无法通过用户交互改变 | boolean      | false  |
| forceRender | 被隐藏时是否渲染 DOM 结构                  | boolean      | false  |
| header      | 面板头内容                                 | string\|slot | 无     |
| key         | 对应 activeKey                             | string       | 无     |
| showArrow   | 是否展示当前面板上的箭头                   | boolean      | `true` |

## FAQ

### 我希望箭头在右边，怎么做？

通过样式调整，将箭头放到右边就行啦

```
.ant-collapse .ant-collapse-item .ant-collapse-header .anticon {
  left: initial;
  right: 16px;
}
```
