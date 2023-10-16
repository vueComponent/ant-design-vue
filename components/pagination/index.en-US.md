---
category: Components
type: Navigation
title: Pagination
cols: 1
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*8y_iTJGY_aUAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*WM86SrBC8TsAAAAAAAAAAAAADrJ8AQ/original
---

A long list can be divided into several pages using `Pagination`, and only one page will be loaded at a time.

## When To Use

- When it will take a long time to load/render all items.
- If you want to browse the data by navigating through pages.

## API

```html
<a-pagination @change="onChange" :total="50" />
```

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| current(v-model) | current page number | number | - |  |
| defaultCurrent | default initial page number | number | 1 |  |
| defaultPageSize | default number of data items per page | number | 10 |  |
| disabled | Disable pagination | boolean | - | 1.5.0 |
| hideOnSinglePage | Whether to hide pager on single page | boolean | false |  |
| itemRender | to customize item innerHTML | (page, type: 'page' \| 'prev' \| 'next', originalElement) => vNode \| v-slot | - |  |
| pageSize(v-model) | number of data items per page | number | - |  |
| pageSizeOptions | specify the sizeChanger options | string\[] \| number\[] | \['10', '20', '50', '100'] |  |
| responsive | If `size` is not specified, `Pagination` would resize according to the width of the window | boolean | - | 3.1 |
| showLessItems | Show less page items | boolean | false | 1.5.0 |
| showQuickJumper | determine whether you can jump to pages directly | boolean | false |  |
| showSizeChanger | Determine whether to show `pageSize` select, it will be true when `total > 50` | boolean | - |  |
| showTitle | Show page item's title | boolean | true | 1.5.0 |
| showTotal | to display the total number and range | Function(total, range) | - |  |
| simple | whether to use simple mode | boolean | - |  |
| size | specify the size of `Pagination`, can be set to `small` | string | "" |  |
| total | total number of data items | number | 0 |  |

### events

| Events Name | Description | Arguments |  |
| --- | --- | --- | --- |
| change | Called when the page number or `pageSize` is changed, and it takes the resulting page number and pageSize as its arguments | Function(page, pageSize) | noop |
| showSizeChange | a callback function, executed when `pageSize` is changed | Function(current, size) | noop |
