## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| dataSource | 数据源，其中的数据将会被渲染到左边一栏中，`targetKeys` 中指定的除外。 | \[{key: string.isRequired,title: string.isRequired,description: string,disabled: bool}\]\[] | \[] |
| disabled | 是否禁用 | boolean | false |
| filterOption | 接收 `inputValue` `option` 两个参数，当 `option` 符合筛选条件时，应返回 `true`，反之则返回 `false`。 | (inputValue, option): boolean |  |
| footer | 可以设置为一个 作用域插槽 | slot="footer" slot-scope="props" |  |
| lazy | Transfer 使用了 [vc-lazy-load]优化性能，这里可以设置相关参数。设为 `false` 可以关闭懒加载。 | object\|boolean | `{ height: 32, offset: 32 }` |
| listStyle | 两个穿梭框的自定义样式 | object |  |
| locale | 各种语言 | object | `{ itemUnit: '项', itemsUnit: '项', notFoundContent: '列表为空', searchPlaceholder: '请输入搜索内容' }` |
| operations | 操作文案集合，顺序从上至下 | string\[] | \['>', '<'] |
| render | 每行数据渲染函数，该函数的入参为 `dataSource` 中的项，返回值为 element。或者返回一个普通对象，其中 `label` 字段为 element，`value` 字段为 title | Function(record) |  |
| selectedKeys | 设置哪些项应该被选中 | string\[] | \[] |
| showSearch | 是否显示搜索框 | boolean | false |
| targetKeys | 显示在右侧框数据的 key 集合 | string\[] | \[] |
| titles | 标题集合，顺序从左至右 | string\[] | \['', ''] |

### 事件

| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 选项在两栏之间转移时的回调函数 | (targetKeys, direction, moveKeys): void |  |
| scroll | 选项列表滚动时的回调函数 | (direction, event): void |  |
| search | 搜索框内容时改变时的回调函数 | (direction: 'left'\|'right', value: string): void | - |
| selectChange | 选中项发生改变时的回调函数 | (sourceSelectedKeys, targetSelectedKeys): void |  |

## 注意

按照 Vue 最新的规范，所有的组件数组最好绑定 key。在 Transfer 中，`dataSource`里的数据值需要指定 `key` 值。对于 `dataSource` 默认将每列数据的 `key` 属性作为唯一的标识。

如果你的数据没有这个属性，务必使用 `rowKey` 来指定数据列的主键。

```jsx
// 比如你的数据主键是 uid
return <Transfer :rowKey="record => record.uid" />;
```
