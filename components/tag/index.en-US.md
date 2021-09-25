---
category: Components
type: Data Display
title: Tag
cover: https://gw.alipayobjects.com/zos/alicdn/cH1BOLfxC/Tag.svg
---

Tag for categorizing or markup.

## When To Use

- It can be used to tag by dimension or property.
- When categorizing.

## API

### Tag

| Property         | Description                      | Type                | Default | Version |
| ---------------- | -------------------------------- | ------------------- | ------- | ------- |
| closable         | Whether the Tag can be closed    | boolean             | `false` |         |
| closeIcon        | Custom close icon                | VNode \| #closeIcon | -       | 2.0.0   |
| color            | Color of the Tag                 | string              | -       |         |
| icon             | Set the icon of tag              | VNode \| #icon      | -       | 2.0.0   |
| visible(v-model) | Whether the Tag is closed or not | boolean             | `true`  |         |

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
