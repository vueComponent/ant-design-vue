

## API

### Radio

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| autoFocus | 自动获取焦点 | boolean | false |
| checked | 指定当前是否选中 | boolean | false |
| defaultChecked | 初始是否选中 | boolean | false |
| value | 根据 value 进行比较，判断是否选中 | any | 无 |

### RadioGroup

单选框组合，用于包裹一组 `Radio`。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| defaultValue | 默认选中的值 | any | 无 |
| name | RadioGroup 下所有 `input[type="radio"]` 的 `name` 属性 | string | 无 |
| options | 以配置形式设置子元素 | string\[] \| Array&lt;{ label: string value: string disabled?: boolean }> | 无 |
| size | 大小，只对按钮样式生效 | `large` \| `default` \| `small` | `default` |
| value(v-model) | 用于设置当前选中的值 | any | 无 |

### RadioGroup 事件

| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 选项变化时的回调函数 | Function(e:Event) |

## 方法

### Radio

| 名称 | 描述 |
| --- | --- |
| blur() | 移除焦点 |
| focus() | 获取焦点 |
