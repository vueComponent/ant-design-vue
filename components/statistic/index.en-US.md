## API

### Statistic

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| decimalSeparator | decimal separator | string | . |
| formatter | customize value display logic | (h) => VNode | - |
| groupSeparator | group separator | string | , |
| precision | precision of input value | number | - |
| prefix | prefix node of value | string \| VNode | - |
| suffix | suffix node of value | string \| VNode | - |
| title | Display title | string \| VNode | - |
| value | Display value | string \| number | - |


### Statistic.Countdown

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| format | Format as [moment](http://momentjs.com/) | string | 'HH:mm:ss' |
| prefix | prefix node of value | string \| VNode | - |
| suffix | suffix node of value | string \| VNode | - |
| title | Display title | string \| VNode | - |
| value | Set target countdown time | number \| moment | - |

#### Statistic.Countdown Events
| Events Name | Description | Arguments |
| --- | --- | --- |
| onFinish | Trigger when time's up | () => void | - |
