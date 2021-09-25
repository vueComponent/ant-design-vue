---
category: Components
type: Data Entry
title: Mentions
cover: https://gw.alipayobjects.com/zos/alicdn/jPE-itMFM/Mentions.svg
---

Mention component.

## When To Use

- When need to mention someone or something.

## API

### Mention

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| autofocus | Auto get focus when component mounted | boolean | `false` |
| defaultValue | Default value | string |  |
| filterOption | Customize filter option logic | false \| (input: string, option: OptionProps) => boolean |  |
| notFoundContent | Set mentions content when not match | ReactNode | 'Not Found' |
| placement | Set popup placement | `top` \| `bottom` | `bottom` |
| prefix | Set trigger prefix keyword | string \| string[] | '@' |
| split | Set split string before and after selected mention | string | ' ' |
| validateSearch | Customize trigger search logic | (text: string, props: MentionsProps) => void |  |
| value(v-model) | Set value of mentions | string |  |
| getPopupContainer | Set the mount HTML node for suggestions | () => HTMLElement |  |

### Events

| Events Name | Description | Arguments |
| --- | --- | --- |
| blur | remove focus | function |
| change | Trigger when value changed | function(value: string) |
| focus | get focus | function |
| search | Trigger when prefix hit | function(value: string, prefix: string) |
| select | Trigger when user select the option | function(option: OptionProps, prefix: string) |

### Mention methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | remove focus |
| focus() | get focus    |

### Option

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value | value of suggestion, the value will insert into input filed while selected | string | '' |
