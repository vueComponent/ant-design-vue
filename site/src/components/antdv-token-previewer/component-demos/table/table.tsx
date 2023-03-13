import { defineComponent } from 'vue';
import { Table, Tag, Space } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
  },
  {
    title: 'Action',
    key: 'action',
  },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];
const Demo = defineComponent({
  setup() {
    return () => (
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        v-slots={{
          bodyCell: ({ column, text, record }) => {
            if (column.key === 'name') {
              return <a>{record.name}</a>;
            } else if (column.key === 'tags') {
              return (
                <span>
                  {record.tags.map((tag: string) => {
                    let color = tag.length > 5 ? 'geekblue' : 'green';
                    if (tag === 'loser') {
                      color = 'volcano';
                    }
                    return (
                      <Tag color={color} key={tag}>
                        {tag.toUpperCase()}
                      </Tag>
                    );
                  })}
                </span>
              );
            } else if (column.key === 'action') {
              return (
                <Space size="middle">
                  <a>Invite {record.name}</a> <a>Delete</a>
                </Space>
              );
            } else {
              return text;
            }
          },
        }}
      />
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorPrimaryActive', 'colorBgContainer'],
  key: 'table',
};

export default componentDemo;
