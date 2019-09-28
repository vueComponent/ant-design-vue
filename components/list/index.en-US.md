## API

### List

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| bordered | Toggles rendering of the border around the list | boolean | false |
| footer | List footer renderer | string\|slot | - |
| grid | The grid type of list. You can set grid to something like {gutter: 16, column: 4} | object | - |
| header | List header renderer | string\|slot | - |
| itemLayout | The layout of list, default is `horizontal`, If a vertical list is desired, set the itemLayout property to `vertical` | string | - |
| rowKey | Item's unique key, could be a string or function that returns a string | string\|Function(record):string | `key` |
| loading | Shows a loading indicator while the contents of the list are being fetched | boolean\|[object](https://vue.ant.design/components/spin/#API) | false |
| loadMore | Shows a load more content | string\|slot | - |
| locale | i18n text including empty text | object | emptyText: 'No Data' <br> |
| pagination | Pagination [config](https://vue.ant.design/components/pagination/#API), hide it by setting it to false | boolean \| object | false |
| split | Toggles rendering of the split under the list item | boolean | true |
| renderItem | Custom item renderer, slot="renderItem" and slot-scope="item, index" | (item, index) => vNode |  | - |

### pagination

Properties for pagination.

| Property | Description                          | Type                        | Default  |
| -------- | ------------------------------------ | --------------------------- | -------- |
| position | specify the position of `Pagination` | 'top' \| 'bottom' \| 'both' | 'bottom' |

More about pagination, please check [`Pagination`](https://vue.ant.design/components/pagination/#API).

### List grid props

| Property | Description              | Type                                     | Default   |
| -------- | ------------------------ | ---------------------------------------- | --------- |
| column   | column of grid           | number oneOf [ 1, 2, 3, 4, 6, 8, 12, 24] | -         |
| gutter   | spacing between grid     | number                                   | 0         |
| size     | Size of list             | `default` \| `middle` \| `small`         | `default` |
| xs       | `<576px` column of grid  | number                                   | -         |
| sm       | `≥576px` column of grid  | number                                   | -         |
| md       | `≥768px` column of grid  | number                                   | -         |
| lg       | `≥992px` column of grid  | number                                   | -         |
| xl       | `≥1200px` column of grid | number                                   | -         |
| xxl      | `≥1600px` column of grid | number                                   | -         |

### List.Item

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| actions | The actions content of list item. If `itemLayout` is `vertical`, shows the content on bottom, otherwise shows content on the far right. | Array\<vNode>\|slot | - |
| extra | The extra content of list item. If `itemLayout` is `vertical`, shows the content on right, otherwise shows content on the far right. | string\|slot | - |

### List.Item.Meta

| Property    | Description                  | Type         | Default |
| ----------- | ---------------------------- | ------------ | ------- |
| avatar      | The avatar of list item      | slot         | -       |
| description | The description of list item | string\|slot | -       |
| title       | The title of list item       | string\|slot | -       |
