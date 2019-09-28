## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| autoFocus | get focus when component mounted | boolean | false |
| checked(v-model) | determine whether the `Switch` is checked | boolean | false |
| checkedChildren | content to be shown when the state is checked | string\|slot |  |
| defaultChecked | to set the initial state | boolean | false |
| disabled | Disable switch | boolean | false |
| loading | loading state of switch | boolean | false |
| size | the size of the `Switch`, options: `default` `small` | string | default |
| unCheckedChildren | content to be shown when the state is unchecked | string\|slot |  |

### Events

| Events Name | Description | Arguments |
| --- | --- | --- |
| change | trigger when the checked state is changing | Function(checked: boolean, event: Event) |  |
| click | trigger when clicked | Function(checked: boolean, event: Event) |  |

## Methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | remove focus |
| focus() | get focus    |
