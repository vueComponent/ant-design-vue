---
category: Components
type: Data Display
title: Tag
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*_SBsSrKLg00AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*JPNAQYrVkYkAAAAAAAAAAAAADrJ8AQ/original
---

Tag for categorizing or markup.

## When To Use

- It can be used to tag by dimension or property.
- When categorizing.

## API

### Tag

| Property  | Description                   | Type          | Default | Version |
| --------- | ----------------------------- | ------------- | ------- | ------- |
| closable  | Whether the Tag can be closed | boolean       | `false` |         |
| closeIcon | Custom close icon             | VNode \| slot | -       | 2.0.0   |
| color     | Color of the Tag              | string        | -       |         |
| icon      | Set the icon of tag           | VNode \| slot | -       | 2.0.0   |
| bordered  | Whether has border style      | boolean       | `true`  | 4.x     |

### Tag Events

| Events Name | Description                          | Arguments   |
| ----------- | ------------------------------------ | ----------- |
| close       | Callback executed when tag is closed | (e) => void |

### Tag.CheckableTag

| Property         | Description           | Type    | Default |
| ---------------- | --------------------- | ------- | ------- |
| checked(v-model) | Checked status of Tag | boolean | `false` |

### Tag.CheckableTag Events

| Events Name | Description                                     | Arguments         |
| ----------- | ----------------------------------------------- | ----------------- |
| change      | Callback executed when Tag is checked/unchecked | (checked) => void |
