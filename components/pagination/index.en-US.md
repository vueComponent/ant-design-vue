---
category: Components
type: Navigation
title: Pagination
cols: 1
cover: https://gw.alipayobjects.com/zos/alicdn/1vqv2bj68/Pagination.svg
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
| pageSize(v-model) | number of data items per page | number | - |  |
| defaultCurrent | default initial page number | number | 1 |  |
| defaultPageSize | default number of data items per page | number | 10 |  |
| disabled | Disable pagination | boolean | - | 1.5.0 |
| hideOnSinglePage | Whether to hide pager on single page | boolean | false |  |
| itemRender | to customize item innerHTML | (page, type: 'page' \| 'prev' \| 'next', originalElement) => vNode \| v-slot | - |  |
| pageSizeOptions | specify the sizeChanger options | string\[] | \['10', '20', '30', '40'] |  |
| showLessItems | Show less page items | boolean | false | 1.5.0 |
| showQuickJumper | determine whether you can jump to pages directly | boolean | false |  |
| showSizeChanger | determine whether `pageSize` can be changed | boolean | false |  |
| showTitle | Show page item's title | boolean | true | 1.5.0 |
| showTotal | to display the total number and range | Function(total, range) | - |  |
| simple | whether to use simple mode | boolean | - |  |
| size | specify the size of `Pagination`, can be set to `small` | string | "" |  |
| total | total number of data items | number | 0 |  |

### events

| Events Name | Description | Arguments |
| --- | --- | --- |
| change | a callback function, executed when the page number is changed, and it takes the resulting page number and pageSize as its arguments | Function(page, pageSize) | noop |
| showSizeChange | a callback function, executed when `pageSize` is changed | Function(current, size) | noop |
