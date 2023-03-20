---
category: Components
type: 数据展示
title: Empty
subtitle: 空状态
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*ZdiZSLzEV0wAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*obM7S5lIxeMAAAAAAAAAAAAADrJ8AQ/original
---

空状态时的展示占位图。

## 何时使用

- 当目前没有数据时，用于显式的用户提示。
- 初始化场景时的引导创建流程。

## API

```jsx
<Empty>
  <Button>创建</Button>
</Empty>
```

| 参数        | 说明                                         | 类型             | 默认值 | 版本 |
| ----------- | -------------------------------------------- | ---------------- | ------ | ---- |
| description | 自定义描述内容                               | string \| v-slot | -      |      |
| image       | 设置显示图片，为 string 时表示自定义图片地址 | string \| v-slot | false  |      |
| imageStyle  | 图片样式                                     | CSSProperties    | -      |      |

## 内置图片

- Empty.PRESENTED_IMAGE_SIMPLE

  <img src="https://user-images.githubusercontent.com/507615/54591679-b0ceb580-4a65-11e9-925c-ad15b4eae93d.png" height="35px" />

- Empty.PRESENTED_IMAGE_DEFAULT

  <img src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png" height="100px" />
