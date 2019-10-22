## API

| 成员 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| offsetBottom | 距离窗口底部达到指定偏移量后触发 | number |  |
| offsetTop | 距离窗口顶部达到指定偏移量后触发 | number |  |
| target | 设置 `Affix` 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数 | () => HTMLElement | () => window |

### 事件

| 事件名称 | 说明                         | 回调参数          |
| -------- | ---------------------------- | ----------------- |
| change   | 固定状态改变时触发的回调函数 | Function(affixed) |

**注意：**`Affix` 内的元素不要使用绝对定位，如需要绝对定位的效果，可以直接设置 `Affix` 为绝对定位：

```html
<a-affix :style="{ position: 'absolute', top: y, left: x}">
  ...
</a-affix>
```
