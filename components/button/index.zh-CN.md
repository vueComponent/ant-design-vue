## API

通过设置 Button 的属性来产生不同的按钮样式，推荐顺序为：`type` -> `shape` -> `size` -> `loading` -> `disabled`。

按钮的属性说明如下：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| disabled | 按钮失效状态 | boolean | `false` |
| ghost | 幽灵属性，使按钮背景透明 | boolean | false |
| htmlType | 设置 `button` 原生的 `type` 值，可选值请参考 [HTML 标准](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-type) | string | `button` |
| icon | 设置按钮的图标类型 | string | - |
| loading | 设置按钮载入状态 | boolean \| { delay: number } | `false` |
| shape | 设置按钮形状，可选值为 `circle`、 `round` 或者不设 | string | - |
| size | 设置按钮大小，可选值为 `small` `large` 或者不设 | string | `default` |
| type | 设置按钮类型，可选值为 `primary` `dashed` `danger` `link` 或者不设 | string | `default` |
| block | 将按钮宽度调整为其父宽度的选项 | boolean | `false` |

### 事件

| 事件名称 | 说明             | 回调参数        |
| -------- | ---------------- | --------------- |
| click    | 点击按钮时的回调 | (event) => void |

`<a-button>Hello world!</a-button>` 最终会被渲染为 `<button><span>Hello world!</span></button>`，并且除了上表中的属性，其它属性都会直接传到原生 button 上。 `<Button href="http://example.com">Hello world!</Button>` 则会渲染为 `<a href="http://example.com"><span>Hello world!</span></a>`。

## FAQ

### 如何移除 2 个汉字之间的空格

设置 [ConfigProvider](/components/config-provider/#API) 的 `autoInsertSpaceInButton` 为 `false`。
