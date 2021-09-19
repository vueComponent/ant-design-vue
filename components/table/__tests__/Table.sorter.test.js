import * as Vue from 'vue';
import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
import Table from '..';

describe('Table.sorter', () => {
  const sorterFn = (a, b) => a.name[0].charCodeAt() - b.name[0].charCodeAt();

  const column = {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: sorterFn,
  };

  const data = [
    { key: 0, name: 'Jack' },
    { key: 1, name: 'Lucy' },
    { key: 2, name: 'Tom' },
    { key: 3, name: 'Jerry' },
  ];

  function getTableOptions(props = {}, columnProps = {}) {
    return {
      props: {
        columns: [
          {
            ...column,
            ...columnProps,
          },
        ],
        dataSource: data,
        pagination: false,
        ...props,
      },
      sync: false,
      attachedToDocument: true,
    };
  }

  function renderedNames(wrapper) {
    return wrapper.findAllComponents({ name: 'BodyRow' }).map(row => {
      return row.props().record.name;
    });
  }

  it('renders sorter icon correctly', done => {
    const wrapper = mount(Table, getTableOptions());
    Vue.nextTick(() => {
      expect(wrapper.find('thead').html()).toMatchSnapshot();
      done();
    });
  });

  it('default sort order ascend', done => {
    const wrapper = mount(
      Table,
      getTableOptions(
        {},
        {
          defaultSortOrder: 'ascend',
        },
      ),
    );
    Vue.nextTick(() => {
      expect(renderedNames(wrapper)).toEqual(['Jack', 'Jerry', 'Lucy', 'Tom']);
      done();
    });
  });

  it('default sort order descend', done => {
    const wrapper = mount(
      Table,
      getTableOptions(
        {},
        {
          defaultSortOrder: 'descend',
        },
      ),
    );
    Vue.nextTick(() => {
      expect(renderedNames(wrapper)).toEqual(['Tom', 'Lucy', 'Jack', 'Jerry']);
      done();
    });
  });

  it('sort records', async () => {
    const wrapper = mount(Table, getTableOptions());
    await asyncExpect(() => {
      // descent
      wrapper.find('.ant-table-column-sorters').trigger('click');
    });
    await asyncExpect(() => {
      expect(wrapper.find('.ant-table-tbody').text()).toEqual(
        ['Jack', 'Jerry', 'Lucy', 'Tom'].join(''),
      );

      // ascent
      wrapper.find('.ant-table-column-sorters').trigger('click');
    });
    await asyncExpect(() => {
      expect(wrapper.find('.ant-table-tbody').text()).toEqual(
        ['Tom', 'Lucy', 'Jack', 'Jerry'].join(''),
      );
    });
  });

  it('can be controlled by sortOrder', done => {
    const wrapper = mount(
      Table,
      getTableOptions({
        columns: [{ ...column, sortOrder: 'ascend' }],
      }),
    );
    Vue.nextTick(() => {
      expect(renderedNames(wrapper)).toEqual(['Jack', 'Jerry', 'Lucy', 'Tom']);
      done();
    });
  });

  it('fires change event', async () => {
    const handleChange = jest.fn();
    const wrapper = mount(Table, getTableOptions({ onChange: handleChange }, {}));

    wrapper.find('.ant-table-column-sorters').trigger('click');
    await asyncExpect(() => {
      const sorter1 = handleChange.mock.calls[0][2];
      expect(sorter1.column.dataIndex).toBe('name');
      expect(sorter1.order).toBe('ascend');
      expect(sorter1.field).toBe('name');
      expect(sorter1.columnKey).toBe('name');
    });
    wrapper.find('.ant-table-column-sorters').trigger('click');
    await asyncExpect(() => {
      const sorter2 = handleChange.mock.calls[1][2];
      expect(sorter2.column.dataIndex).toBe('name');
      expect(sorter2.order).toBe('descend');
      expect(sorter2.field).toBe('name');
      expect(sorter2.columnKey).toBe('name');
    });

    wrapper.find('.ant-table-column-sorters').trigger('click');
    await asyncExpect(() => {
      const sorter3 = handleChange.mock.calls[2][2];
      expect(sorter3.column).toBe(undefined);
      expect(sorter3.order).toBe(undefined);
      expect(sorter3.field).toBe('name');
      expect(sorter3.columnKey).toBe('name');
    });
  });

  it('works with grouping columns in controlled mode', done => {
    const columns = [
      {
        title: 'group',
        key: 'group',
        children: [
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: sorterFn,
            sortOrder: 'descend',
          },
          {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
          },
        ],
      },
    ];
    const testData = [
      { key: 0, name: 'Jack', age: 11 },
      { key: 1, name: 'Lucy', age: 20 },
      { key: 2, name: 'Tom', age: 21 },
      { key: 3, name: 'Jerry', age: 22 },
    ];
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: testData,
      },
      sync: false,
    });
    Vue.nextTick(() => {
      expect(renderedNames(wrapper)).toEqual(['Tom', 'Lucy', 'Jack', 'Jerry']);
      done();
    });
  });
});
