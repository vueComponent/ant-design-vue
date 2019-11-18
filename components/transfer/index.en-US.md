## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| dataSource | Used for setting the source data. The elements that are part of this array will be present the left column. Except the elements whose keys are included in `targetKeys` prop. | \[{key: string.isRequired,title: string.isRequired,description: string,disabled: bool}\] | \[] |
| disabled | Whether disabled transfer | boolean | false |
| filterOption | A function to determine whether an item should show in search result list | (inputValue, option): boolean |  |
| footer | customize the progress dot by setting a scoped slot | slot="footer" slot-scope="props" |  |
| lazy | property of vc-lazy-load for lazy rendering items. Turn off it by set to `false`. | object\|boolean | `{ height: 32, offset: 32 }` |
| listStyle | A custom CSS style used for rendering the transfer columns. | object |  |
| locale | i18n text including filter, empty text, item unit, etc | object | `{ itemUnit: 'item', itemsUnit: 'items', notFoundContent: 'The list is empty', searchPlaceholder: 'Search here' }` |
| operations | A set of operations that are sorted from top to bottom. | string\[] | \['>', '<'] |
| render | The function to generate the item shown on a column. Based on an record (element of the dataSource array), this function should return a element which is generated from that record. Also, it can return a plain object with `value` and `label`, `label` is a element and `value` is for title | Function(record) |  |
| selectedKeys | A set of keys of selected items. | string\[] | \[] |
| showSearch | If included, a search box is shown on each column. | boolean | false |
| targetKeys | A set of keys of elements that are listed on the right column. | string\[] | \[] |
| titles | A set of titles that are sorted from left to right. | string\[] | - |

### events

| Events Name | Description | Arguments |
| --- | --- | --- |
| change | A callback function that is executed when the transfer between columns is complete. | (targetKeys, direction, moveKeys): void |  |
| scroll | A callback function which is executed when scroll options list | (direction, event): void |  |
| search | A callback function which is executed when search field are changed | (direction: 'left'\|'right', value: string): void | - |
| selectChange | A callback function which is executed when selected items are changed. | (sourceSelectedKeys, targetSelectedKeys): void |  |

## Warning

According the standard of Vue, the key should always be supplied directly to the elements in the array. In Transfer, the keys should be set on the elements included in `dataSource` array. By default, `key` property is used as an unique identifier.

If there's no `key` in your data, you should use `rowKey` to specify the key that will be used for uniquely identify each element.

```jsx
// eg. your primary key is `uid`
return <Transfer :rowKey="record => record.uid" />;
```
