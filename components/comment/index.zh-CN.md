---
category: Components
type: 数据展示
title: Comment
subtitle: 评论
cover: https://gw.alipayobjects.com/zos/alicdn/ILhxpGzBO/Comment.svg
---

对网站内容的反馈、评价和讨论。

## 何时使用

评论组件可用于对事物的讨论，例如页面、博客文章、问题等等。

## API

| Property | Description                                            | Type         | Default |
| -------- | ------------------------------------------------------ | ------------ | ------- |
| actions  | 在评论内容下面呈现的操作项列表                         | Array\|slot  | -       |
| author   | 要显示为注释作者的元素                                 | string\|slot | -       |
| avatar   | 要显示为评论头像的元素 - 通常是 antd `Avatar` 或者 src | string\|slot | -       |
| content  | 评论的主要内容                                         | string\|slot | -       |
| datetime | 展示时间描述                                           | string\|slot | -       |
