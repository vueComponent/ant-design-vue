---
category: Components
type: 数据展示
title: Badge
subtitle: 徽标数
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*e0qITYqF394AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*v8EQT7KoGbcAAAAAAAAAAAAADrJ8AQ/original
---

图标右上角的圆形徽标数字。

## 何时使用

一般出现在通知图标或头像的右上角，用于显示需要处理的消息条数，通过醒目视觉形式吸引用户处理。

## API

```html
<a-badge :count="5">
  <a href="#" class="head-example" />
</a-badge>
```

```html
<a-badge :count="5" />
```

### Badge

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| color | 自定义小圆点的颜色 | string | - | 1.5.0 |
| count | 展示的数字，大于 overflowCount 时显示为 `${overflowCount}+`，为 0 时隐藏 | number \| string \| slot |  |  |
| dot | 不展示数字，只有一个小红点 | boolean | false |  |
| numberStyle | 设置状态点的样式 | object | '' |  |
| offset | 设置状态点的位置偏移，格式为 [x, y] | [number\|string, number\|string] | - |  |
| overflowCount | 展示封顶的数字值 | number | 99 |  |
| showZero | 当数值为 0 时，是否展示 Badge | boolean | false |  |
| status | 设置 Badge 为状态点 | Enum{ 'success', 'processing, 'default', 'error', 'warning' } | '' |  |
| text | 在设置了 `status` 的前提下有效，设置状态点的文本 | string | '' |  |
| title | 设置鼠标放在状态点上时显示的文字 | string | `count` |  |

### Badge.Ribbon (2.0.1+)

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| color | 自定义缎带的颜色 | string | - |  |
| placement | 缎带的位置，`start` 和 `end` 随文字方向（RTL 或 LTR）变动 | `start` \| `end` | `end` |  |
| text | 缎带中填入的内容 | string \| VNode \| slot | - |  |
