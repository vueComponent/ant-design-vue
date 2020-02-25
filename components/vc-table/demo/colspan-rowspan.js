/* eslint-disable no-console,func-names */
import Table from '../index';
import '../assets/index.less';

const data = [
  { a: '13812340987', b: '0571-12345678', c: '张三', d: '文一西路', e: 'Male', key: '1' },
  { a: '13812340986', b: '0571-98787658', c: '张夫人', d: '文一西路', e: 'Female', key: '2' },
  { a: '13812988888', b: '0571-099877', c: '李四', d: '文二西路', e: 'Male', key: '3' },
  { a: '1381200008888', b: '0571-099877', c: '王五', d: '文二西路', e: 'Male', key: '4' },
  { a: '0571-88888110', c: '李警官', d: '武林门', e: 'Male', key: '5' },
  { a: '资料统计完毕于xxxx年xxx月xxx日', key: '6' },
];

export default {
  data() {
    this.columns = [
      {
        title: '手机号',
        dataIndex: 'a',
        colSpan: 2,
        width: 100,
        key: 'a',
        customRender: (o, row, index) => {
          const obj = {
            children: o,
            attrs: {},
          };
          // 设置第一行为链接
          if (index === 0) {
            obj.children = <a href="#">{o}</a>;
          }
          // 第5行合并两列
          if (index === 4) {
            obj.attrs.colSpan = 2;
          }

          if (index === 5) {
            obj.attrs.colSpan = 6;
          }
          return obj;
        },
      },
      {
        title: '电话',
        dataIndex: 'b',
        colSpan: 0,
        width: 100,
        key: 'b',
        customRender: (o, row, index) => {
          const obj = {
            children: o,
            attrs: {},
          };
          // 列合并掉的表格设置colSpan=0，不会去渲染
          if (index === 4 || index === 5) {
            obj.attrs.colSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Name',
        dataIndex: 'c',
        width: 100,
        key: 'c',
        customRender: (o, row, index) => {
          const obj = {
            children: o,
            attrs: {},
          };

          if (index === 5) {
            obj.attrs.colSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Address',
        dataIndex: 'd',
        width: 200,
        key: 'd',
        customRender: (o, row, index) => {
          const obj = {
            children: o,
            attrs: {},
          };
          if (index === 0) {
            obj.attrs.rowSpan = 2;
          }
          if (index === 1 || index === 5) {
            obj.attrs.rowSpan = 0;
          }

          return obj;
        },
      },
      {
        title: 'Gender',
        dataIndex: 'e',
        width: 200,
        key: 'e',
        customRender: (o, row, index) => {
          const obj = {
            children: o,
            attrs: {},
          };
          if (index === 5) {
            obj.attrs.colSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Operations',
        dataIndex: '',
        key: 'f',
        customRender: (o, row, index) => {
          if (index === 5) {
            return {
              attrs: {
                colSpan: 0,
              },
            };
          }
          return <a href="#">Operations</a>;
        },
      },
    ];
    return {};
  },
  render() {
    return (
      <div>
        <h2>colSpan & rowSpan</h2>
        <Table columns={this.columns} data={data} class="table" />
      </div>
    );
  },
};
