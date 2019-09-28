## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| closable | 是否显示右上角的关闭按钮 | boolean | true |
| destroyOnClose | 关闭时销毁 Drawer 里的子元素 | boolean | false |
| getContainer | 指定 Drawer 挂载的 HTML 节点 | HTMLElement \| `() => HTMLElement` \| Selectors | 'body' |
| maskClosable | 点击蒙层是否允许关闭 | boolean | true |
| mask | 是否展示遮罩 | Boolean | true |
| maskStyle | 遮罩样式 | object | {} |
| title | 标题 | string \| slot | - |
| visible | Drawer 是否可见 | boolean | - |
| wrapClassName | 对话框外层容器的类名 | string | - |
| wrapStyle | 对话框外层容器的`style` | object | - |
| bodyStyle | 可用于设置 Drawer 的样式，调整浮层位置等 | object | - |
| width | 宽度 | string \| number | 256 |
| height | 高度, 在 `placement` 为 `top` 或 `bottom` 时使用 | string \| number | 256 |
| zIndex | 设置 Drawer 的 `z-index` | Number | 1000 |
| placement | 抽屉的方向 | 'top' \| 'right' \| 'bottom' \| 'left' | 'right' |
| handle | 设置后抽屉直接挂载到 DOM 上，你可以通过该 handle 控制抽屉打开关闭 | VNode \| slot | - |

## 方法

| 名称  | 描述                                 | 类型        | 默认值 |
| ----- | ------------------------------------ | ----------- | ------ |
| close | 点击遮罩层或右上角叉或取消按钮的回调 | function(e) | 无     |
