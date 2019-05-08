## API

#### Statistic

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| decimalSeparator | decimal separator | string | . |
| formatter | customize value display logic | (value) => ReactNode | - |
| groupSeparator | group separator | string | , |
| precision | precision of input value | number | - |
| prefix | prefix node of value | string \| ReactNode | - |
| suffix | suffix node of value | string \| ReactNode | - |
| title | Display title | string \| ReactNode | - |
| value | Display value | string \| number | - |


#### Statistic.Countdown

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| format | Format as [moment](http://momentjs.com/) | string | 'HH:mm:ss' |
| onFinish | Trigger when time's up | () => void | - |
| prefix | prefix node of value | string \| ReactNode | - |
| suffix | suffix node of value | string \| ReactNode | - |
| title | Display title | string \| ReactNode | - |
| value | Set target countdown time | number \| moment | - |