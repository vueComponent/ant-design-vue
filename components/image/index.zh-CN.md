---
category: Components
type: 数据展示
title: Image
subtitle: 图片
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*FbOCS6aFMeUAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*LVQ3R5JjjJEAAAAAAAAAAAAADrJ8AQ/original
---

可预览的图片。

## 何时使用

- 需要展示图片时使用。
- 加载大图时显示 loading 或加载失败时容错处理。

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| alt | 图像描述 | string | - | 2.0.0 |
| fallback | 加载失败容错地址 | string | - | 2.0.0 |
| height | 图像高度 | string \| number | - | 2.0.0 |
| placeholder | 加载占位, 为 `true` 时使用默认占位 | boolean \| slot | - | 2.0.0 |
| preview | 预览参数，为 `false` 时禁用 | boolean \| [previewType](#previewtype) | true | 2.0.0 |
| src | 图片地址 | string | - | 2.0.0 |
| previewMask | 自定义 mask | false \| function \| slot | - | 3.2.0 |
| width | 图像宽度 | string \| number | - | 2.0.0 |

### 事件

| 事件名称 | 说明         | 回调参数               | 版本  |
| -------- | ------------ | ---------------------- | ----- |
| error    | 加载错误回调 | (event: Event) => void | 3.2.0 |

### previewType

```ts
{
  visible?: boolean;
  onVisibleChange?: (visible, prevVisible) => void;
  getContainer: string | HTMLElement | (() => HTMLElement);
  src?: string;
  maskClassName?: string;
  current?: number;
}
```

其他属性见 [&lt;img>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Attributes)
