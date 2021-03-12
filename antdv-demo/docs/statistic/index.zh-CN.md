## API

### Statistic

| 参数             | 说明             | 类型                            | 默认值 |
| ---------------- | ---------------- | ------------------------------- | ------ |
| decimalSeparator | 设置小数点       | string                          | .      |
| formatter        | 自定义数值展示   | v-slot \| ({h, value}) => VNode | -      |
| groupSeparator   | 设置千分位标识符 | string                          | ,      |
| precision        | 数值精度         | number                          | -      |
| prefix           | 设置数值的前缀   | string \| v-slot                | -      |
| suffix           | 设置数值的后缀   | string \| v-slot                | -      |
| title            | 数值的标题       | string \| v-slot                | -      |
| value            | 数值内容         | string \| number                | -      |
| valueStyle       | 设置数值的样式   | style                           | -      |

### Statistic.Countdown

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| format | 格式化倒计时展示，参考 [moment](http://momentjs.com/) | string | 'HH:mm:ss' |
| prefix | 设置数值的前缀 | string \| v-slot | - |
| suffix | 设置数值的后缀 | string \| v-slot | - |
| title | 数值的标题 | string \| v-slot | - |
| value | 数值内容 | number \| moment | - |
| valueStyle | 设置数值的样式 | style | - |

#### Statistic.Countdown 事件

| 事件名称 | 说明             | 回调参数   |
| -------- | ---------------- | ---------- |
| finish   | 倒计时完成时触发 | () => void |
