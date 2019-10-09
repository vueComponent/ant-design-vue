<cn>
#### 表格行/列合并
表头只支持列合并，使用 column 里的 colSpan 进行设置。
表格支持行/列合并，使用 render 里的单元格属性 colSpan 或者 rowSpan 设值为 0 时，设置的表格不会渲染。
</cn>

<us>
#### colSpan and rowSpan
Table column title supports `colSpan` that set in `column`.
Table cell supports `colSpan` and `rowSpan` that set in render return object. When each of them is set to `0`, the cell will not be rendered.
</us>

```tpl
<template>
  <a-table :columns="columns" :dataSource="data" bordered>
    <template slot="name" slot-scope="text">
      <a href="javascript:;">{{text}}</a>
    </template>
    <template slot="action" slot-scope="text, record">
      <span>
        <a href="javascript:;">Action 一 {{record.name}}</a>
        <a-divider type="vertical" />
        <a href="javascript:;">Delete</a>
        <a-divider type="vertical" />
        <a href="javascript:;" class="ant-dropdown-link"> More actions <a-icon type="down" /> </a>
      </span>
    </template>
  </a-table>
</template>
<script>
  // In the fifth row, other columns are merged into first column
  // by setting it's colSpan to be 0
  const renderContent = (value, row, index) => {
    const obj = {
      children: value,
      attrs: {},
    };
    if (index === 4) {
      obj.attrs.colSpan = 0;
    }
    return obj;
  };

  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      tel: '0571-22098909',
      phone: 18889898989,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      tel: '0571-22098333',
      phone: 18889898888,
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      tel: '0575-22098909',
      phone: 18900010002,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      key: '4',
      name: 'Jim Red',
      age: 18,
      tel: '0575-22098909',
      phone: 18900010002,
      address: 'London No. 2 Lake Park',
    },
    {
      key: '5',
      name: 'Jake White',
      age: 18,
      tel: '0575-22098909',
      phone: 18900010002,
      address: 'Dublin No. 2 Lake Park',
    },
  ];

  export default {
    data() {
      const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          customRender: (text, row, index) => {
            if (index < 4) {
              return <a href="javascript:;">{text}</a>;
            }
            return {
              children: <a href="javascript:;">{text}</a>,
              attrs: {
                colSpan: 5,
              },
            };
          },
        },
        {
          title: 'Age',
          dataIndex: 'age',
          customRender: renderContent,
        },
        {
          title: 'Home phone',
          colSpan: 2,
          dataIndex: 'tel',
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {},
            };
            if (index === 2) {
              obj.attrs.rowSpan = 2;
            }
            // These two are merged into above cell
            if (index === 3) {
              obj.attrs.rowSpan = 0;
            }
            if (index === 4) {
              obj.attrs.colSpan = 0;
            }
            return obj;
          },
        },
        {
          title: 'Phone',
          colSpan: 0,
          dataIndex: 'phone',
          customRender: renderContent,
        },
        {
          title: 'Address',
          dataIndex: 'address',
          customRender: renderContent,
        },
      ];
      return {
        data,
        columns,
      };
    },
  };
</script>
```
