import { mount } from '@vue/test-utils';
import Table from '..';
import * as Vue from 'vue';
import { asyncExpect, sleep } from '../../../tests/utils';

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

  function getTableOptions(props = {}) {
    return {
      props: {
        columns,
        dataSource: data,
        pagination: { ...pagination },
        ...props,
      },
      sync: false,
    };
  }

  function renderedNames(wrapper) {
    return wrapper.findAllComponents({ name: 'BodyRow' }).map(row => {
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

  it('paginate data', async () => {
    const wrapper = mount(Table, getTableOptions());
    await sleep();
    expect(renderedNames(wrapper)).toEqual(['Jack', 'Lucy']);
    const pager = wrapper.findAllComponents({ name: 'Pager' });
    pager[pager.length - 1].trigger('click');
    await sleep();
    expect(renderedNames(wrapper)).toEqual(['Tom', 'Jerry']);
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
      getTableOptions({
        pagination: {
          ...pagination,
          onChange: handlePaginationChange,
          onShowSizeChange: noop,
        },
        onChange: handleChange,
      }),
    );
    Vue.nextTick(() => {
      const pager = wrapper.findAllComponents({ name: 'Pager' });
      pager[pager.length - 1].trigger('click');

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
          action: 'paginate',
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
      expect(wrapper.findAll('.ant-pagination-item')).toHaveLength(2); // pageSize will be 10
      expect(renderedNames(wrapper)).toEqual(['Tom', 'Jerry']);
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
    const wrapper = mount(Table, getTableOptions({ pagination: { position: ['topLeft'] } }));
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-spin-container > *')).toHaveLength(2);
      expect(wrapper.findAll('.ant-pagination')).toHaveLength(1);
      wrapper.setProps({ pagination: { position: 'bottomRight' } });
    }, 0);
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-spin-container > *')).toHaveLength(2);
      expect(wrapper.findAll('.ant-pagination')).toHaveLength(1);
      wrapper.setProps({ pagination: { position: ['topLeft', 'bottomRight'] } });
    }, 0);
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-spin-container > *')).toHaveLength(3);
      expect(wrapper.findAll('.ant-pagination')).toHaveLength(2);
    }, 0);
    wrapper.setProps({ pagination: { position: ['none', 'none'] } });
    await sleep();
    expect(wrapper.findAll('.ant-pagination')).toHaveLength(0);
    wrapper.setProps({ pagination: { position: ['invalid'] } });
    await sleep();
    expect(wrapper.findAll('.ant-pagination')).toHaveLength(1);
    wrapper.setProps({ pagination: { position: ['invalid', 'invalid'] } });
    await sleep();
    expect(wrapper.findAll('.ant-pagination')).toHaveLength(1);
  });
});
