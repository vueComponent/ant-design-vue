## API

| Property | Description | type | Default |
| --- | --- | --- | --- |
| allowClear | whether to allow clear when click again | boolean | true |
| allowHalf | whether to allow semi selection | boolean | false |
| autoFocus | get focus when component mounted | boolean | false |
| character | custom character of rate | String or slot="character" | `<Icon type="star" />` |
| count | star count | number | 5 |
| defaultValue | default value | number | 0 |
| disabled | read only, unable to interact | boolean | false |
| tooltips | Customize tooltip by each character | string\[] | - |
| value(v-model) | current value | number | - |

### events

| Events Name | Description                        | Arguments               |
| ----------- | ---------------------------------- | ----------------------- |
| blur        | callback when component lose focus | Function()              | - |
| change      | callback when select value         | Function(value: number) | - |
| focus       | callback when component get focus  | Function()              | - |
| hoverChange | callback when hover item           | Function(value: number) | - |
| keydown     | callback when keydown on component | Function(event)         | - |

## Methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | remove focus |
| focus() | get focus    |
