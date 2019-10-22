## API

| 参数       | 说明                     | 类型         | 默认值                                   |
| ---------- | ------------------------ | ------------ | ---------------------------------------- |
| cancelText | 取消按钮文字             | string\|slot | 取消                                     |
| okText     | 确认按钮文字             | string\|slot | 确定                                     |
| okType     | 确认按钮类型             | string       | primary                                  |
| title      | 确认框的描述             | string\|slot | 无                                       |
| icon       | 自定义弹出气泡 Icon 图标 | vNode        | &lt;Icon type="exclamation-circle" /&gt; |

### 事件

| 事件名称      | 说明           | 回调参数          |
| ------------- | -------------- | ----------------- |
| cancel        | 点击取消的回调 | function(e)       |
| confirm       | 点击确认的回调 | function(e)       |
| visibleChange | 显示隐藏的回调 | function(visible) |

更多属性请参考 [Tooltip](/components/tooltip-cn/#API)。

## 注意

请确保 `Popconfirm` 的子元素能接受 `mouseenter`、`mouseleave`、`focus`、`click` 事件。
