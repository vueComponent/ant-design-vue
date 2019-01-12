import { mount } from '@vue/test-utils';
import Table from '..';
import Vue from 'vue';
import { asyncExpect } from '@/tests/utils';

describe('Table.pagination', () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
  ];

  const data = [
    { key: 0, name: 'Jack' },
    { key: 1, name: 'Lucy' },
    { key: 2, name: 'Tom' },
    { key: 3, name: 'Jerry' },
  ];

  const pagination = { class: 'my-page', pageSize: 2 };

  function getTableOptions(props = {}, listeners = {}) {
    return {
      propsData: {
        columns,
        dataSource: data,
        pagination,
        ...props,
      },
      listeners: {
        ...listeners,
      },
      sync: false,
    };
  }

  function renderedNames(wrapper) {
    return wrapper.findAll({ name: 'TableRow' }).wrappers.map(row => {
      return row.props().record.name;
    });
  }

  it('renders pagination correctly', done => {
    const wrapper = mount(Table, getTableOptions());
    Vue.nextTick(() => {
      expect(wrapper.html()).toMatchSnapshot();
      done();
    });
  });

  it('should not show pager if pagination.hideOnSinglePage is true and only 1 page', async () => {
    const wrapper = mount(
      Table,
      getTableOptions({ pagination: { pageSize: 3, hideOnSinglePage: true } }),
    );
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-pagination')).toHaveLength(1);
      wrapper.setProps({ pagination: { pageSize: 3, hideOnSinglePage: false } });
    });
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-pagination')).toHaveLength(1);
      wrapper.setProps({ pagination: { pageSize: 4, hideOnSinglePage: true } });
    });
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-pagination')).toHaveLength(0);
      wrapper.setProps({ pagination: { pageSize: 4, hideOnSinglePage: false } });
    });
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-pagination')).toHaveLength(1);
      wrapper.setProps({ pagination: { pageSize: 5, hideOnSinglePage: true } });
    });
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-pagination')).toHaveLength(0);
      wrapper.setProps({ pagination: { pageSize: 5, hideOnSinglePage: false } });
    });
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-pagination')).toHaveLength(1);
    });
  });

  it('paginate data', done => {
    const wrapper = mount(Table, getTableOptions());
    Vue.nextTick(() => {
      expect(renderedNames(wrapper)).toEqual(['Jack', 'Lucy']);
      const pager = wrapper.findAll({ name: 'Pager' });
      pager.at(pager.length - 1).trigger('click');
      Vue.nextTick(() => {
        expect(renderedNames(wrapper)).toEqual(['Tom', 'Jerry']);
        done();
      });
    });
  });

  it('repaginates when pageSize change', () => {
    const wrapper = mount(Table, getTableOptions());
    wrapper.setProps({ pagination: { pageSize: 1 } });
    Vue.nextTick(() => {
      expect(renderedNames(wrapper)).toEqual(['Jack']);
    });
  });

  it('fires change event', done => {
    const handleChange = jest.fn();
    const handlePaginationChange = jest.fn();
    const noop = () => {};
    const wrapper = mount(
      Table,
      getTableOptions(
        {
          pagination: { ...pagination, onChange: handlePaginationChange, onShowSizeChange: noop },
        },
        { change: handleChange },
      ),
    );
    Vue.nextTick(() => {
      const pager = wrapper.findAll({ name: 'Pager' });
      pager.at(pager.length - 1).trigger('click');

      expect(handleChange).toBeCalledWith(
        {
          class: 'my-page',
          current: 2,
          pageSize: 2,
        },
        {},
        {},
        {
          currentDataSource: [
            { key: 0, name: 'Jack' },
            { key: 1, name: 'Lucy' },
            { key: 2, name: 'Tom' },
            { key: 3, name: 'Jerry' },
          ],
        },
      );

      expect(handlePaginationChange).toBeCalledWith(2, 2);
      done();
    });
  });

  // https://github.com/ant-design/ant-design/issues/4532
  // https://codepen.io/afc163/pen/dVeNoP?editors=001
  it('should have pager when change pagination from false to undefined', done => {
    const wrapper = mount(Table, getTableOptions({ pagination: false }));
    Vue.nextTick(() => {
      expect(wrapper.findAll('.ant-pagination')).toHaveLength(0);
      wrapper.setProps({ pagination: undefined });
      Vue.nextTick(() => {
        expect(wrapper.findAll('.ant-pagination')).toHaveLength(1);
        expect(wrapper.findAll('.ant-pagination-item-active')).toHaveLength(1);
        done();
      });
    });
  });

  // https://github.com/ant-design/ant-design/issues/4532
  // https://codepen.io/afc163/pen/pWVRJV?editors=001
  it('should display pagination as prop pagination change between true and false', async () => {
    const wrapper = mount(Table, getTableOptions());
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-pagination')).toHaveLength(1);
      expect(wrapper.findAll('.ant-pagination-item')).toHaveLength(2);
      wrapper.setProps({ pagination: false });
    });
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-pagination')).toHaveLength(0);
      wrapper.setProps({ pagination });
    });
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-pagination')).toHaveLength(1);
      expect(wrapper.findAll('.ant-pagination-item')).toHaveLength(2);
      wrapper.find('.ant-pagination-item-2').trigger('click');
    });
    await asyncExpect(() => {
      expect(renderedNames(wrapper)).toEqual(['Tom', 'Jerry']);
      wrapper.setProps({ pagination: false });
    });
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-pagination')).toHaveLength(0);
      wrapper.setProps({ pagination: true });
    });
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-pagination')).toHaveLength(1);
      expect(wrapper.findAll('.ant-pagination-item')).toHaveLength(1); // pageSize will be 10
      expect(renderedNames(wrapper)).toHaveLength(4);
    });
  });

  // https://github.com/ant-design/ant-design/issues/5259
  it('change to correct page when data source changes', done => {
    const wrapper = mount(Table, getTableOptions({ pagination: { pageSize: 1 } }));
    Vue.nextTick(() => {
      wrapper.find('.ant-pagination-item-3').trigger('click');
      wrapper.setProps({ dataSource: [data[0]] });
      Vue.nextTick(() => {
        expect(wrapper.find('.ant-pagination-item-1').classes()).toContain(
          'ant-pagination-item-active',
        );
        done();
      });
    });
  });

  it('specify the position of pagination', async () => {
    const wrapper = mount(Table, getTableOptions({ pagination: { position: 'top' } }));
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-spin-container > *')).toHaveLength(2);
      expect(
        wrapper
          .findAll('.ant-spin-container > *')
          .at(0)
          .findAll('.ant-pagination'),
      ).toHaveLength(1);
      wrapper.setProps({ pagination: { position: 'bottom' } });
    }, 0);
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-spin-container > *')).toHaveLength(2);
      expect(
        wrapper
          .findAll('.ant-spin-container > *')
          .at(1)
          .findAll('.ant-pagination'),
      ).toHaveLength(1);
      wrapper.setProps({ pagination: { position: 'both' } });
    }, 0);
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-spin-container > *')).toHaveLength(3);
      expect(
        wrapper
          .findAll('.ant-spin-container > *')
          .at(0)
          .findAll('.ant-pagination'),
      ).toHaveLength(1);
      expect(
        wrapper
          .findAll('.ant-spin-container > *')
          .at(2)
          .findAll('.ant-pagination'),
      ).toHaveLength(1);
    }, 0);
  });
});
