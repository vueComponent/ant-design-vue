## API

| 参数              | 说明                                | 类型         | 默认值  |
| ----------------- | ----------------------------------- | ------------ | ------- |
| autoFocus         | 组件自动获取焦点                    | boolean      | false   |
| checked(v-model)  | 指定当前是否选中                    | boolean      | false   |
| checkedChildren   | 选中时的内容                        | string\|slot |         |
| defaultChecked    | 初始是否选中                        | boolean      | false   |
| disabled          | 是否禁用                            | boolean      | false   |
| loading           | 加载中的开关                        | boolean      | false   |
| size              | 开关大小，可选值：`default` `small` | string       | default |
| unCheckedChildren | 非选中时的内容                      | string\|slot |         |

### 事件

| 事件名称 | 说明           | 回调参数                                 |
| -------- | -------------- | ---------------------------------------- |
| change   | 变化时回调函数 | Function(checked:Boolean, event: Event)  |
| click    | 点击时回调函数 | Function(checked: boolean, event: Event) |  |

## 方法

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移除焦点 |
| focus() | 获取焦点 |
