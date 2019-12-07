import { shallowMount as shallow, mount } from '@vue/test-utils';
import Table from '..';
import Vue from 'vue';

const { Column, ColumnGroup } = Table;

describe('Table', () => {
  const data = [
    {
      key: '1',
      firstName: 'John',
      lastName: 'Brown',
      age: 32,
    },
    {
      key: '2',
      firstName: 'Jim',
      lastName: 'Green',
      age: 42,
    },
  ];

  it('renders JSX correctly', done => {
    const wrapper = mount(
      {
        render() {
          return (
            <Table dataSource={data} pagination={false}>
              <ColumnGroup title="Name">
                <Column title="First Name" dataIndex="firstName" key="firstName" />
                <Column title="Last Name" dataIndex="lastName" key="lastName" />
              </ColumnGroup>
              <Column title="Age" dataIndex="age" key="age" />
            </Table>
          );
        },
      },
      { sync: false },
    );

    Vue.nextTick(() => {
      expect(wrapper.html()).toMatchSnapshot();
      done();
    });
  });

  it('updates columns when receiving props', done => {
    const columns = [
      {
        title: 'Name',
        key: 'name',
        dataIndex: 'name',
      },
    ];
    const wrapper = shallow(Table, {
      propsData: {
        columns,
      },
      sync: false,
    });
    const newColumns = [
      {
        title: 'Title',
        key: 'title',
        dataIndex: 'title',
      },
    ];
    wrapper.setProps({ columns: newColumns });
    Vue.nextTick(() => {
      expect(wrapper.vm.columns).toBe(newColumns);
      done();
    });
  });

  it('loading with Spin', done => {
    const loading = {
      spinning: false,
      delay: 500,
    };
    const wrapper = mount(Table, {
      propsData: {
        loading,
      },
      sync: false,
    });
    Vue.nextTick(async () => {
      expect(wrapper.findAll('.ant-spin')).toHaveLength(0);
      expect(wrapper.find('.ant-table-placeholder').text()).not.toEqual('');

      loading.spinning = true;
      wrapper.setProps({ loading });
      expect(wrapper.findAll('.ant-spin')).toHaveLength(0);

      await new Promise(resolve => setTimeout(resolve, 1000));
      expect(wrapper.findAll('.ant-spin')).toHaveLength(1);
      done();
    });
  });

  it('align column should not override cell style', done => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        align: 'center',
        customCell: (record, rowIndex) => {
          return {
            style: {
              color: 'red',
            },
          };
        },
      },
    ];
    const wrapper = mount(Table, {
      propsData: {
        columns,
        dataSource: data,
      },
      sync: false,
    });
    Vue.nextTick(() => {
      expect(wrapper.html()).toMatchSnapshot();
      done();
    });
  });
});
