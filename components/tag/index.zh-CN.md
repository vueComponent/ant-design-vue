---
category: Components
subtitle: 标签
type: 数据展示
title: Tag
cover: https://gw.alipayobjects.com/zos/alicdn/cH1BOLfxC/Tag.svg
---

进行标记和分类的小标签。

## 何时使用

- 用于标记事物的属性和维度。
- 进行分类。

## API

### Tag

| 参数             | 说明             | 类型                | 默认值 | 版本  |
| ---------------- | ---------------- | ------------------- | ------ | ----- |
| closable         | 标签是否可以关闭 | boolean             | false  |       |
| closeIcon        | 自定义关闭按钮   | VNode \| #closeIcon | -      | 2.0.0 |
| color            | 标签色           | string              | -      |       |
| icon             | 设置图标         | VNode \| #icon      | -      | 2.0.0 |
| visible(v-model) | 是否显示标签     | boolean             | `true` |       |

### 事件

| 事件名称 | 说明         | 回调参数    |
| -------- | ------------ | ----------- |
| close    | 关闭时的回调 | (e) => void |

### Tag.CheckableTag

| 参数             | 说明               | 类型    | 默认值 |
| ---------------- | ------------------ | ------- | ------ |
| checked(v-model) | 设置标签的选中状态 | boolean | false  |

### 事件

| 事件名称 | 说明                 | 回调参数          |
| -------- | -------------------- | ----------------- |
| change   | 点击标签时触发的回调 | (checked) => void |
