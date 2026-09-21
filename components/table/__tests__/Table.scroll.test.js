import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Table from '..';

describe('Table scroll shadows', () => {
  let wrapper;

  beforeEach(() => {
    jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function () {
      return this.classList.contains('ant-table-body') ? 500 : 0;
    });
    jest.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockImplementation(function () {
      if (!this.classList.contains('ant-table-body')) return 0;
      return Math.max(500, parseFloat(this.querySelector('table').style.width) || 0);
    });
  });

  afterEach(() => {
    wrapper?.unmount();
    jest.restoreAllMocks();
  });

  async function settle() {
    await nextTick();
    await nextTick();
    await nextTick();
  }

  it.each([
    ['empty', []],
    ['populated', [{ key: '1', name: 'Jack' }]],
  ])('updates shadows when the %s table stops overflowing without scrolling', async (_, data) => {
    wrapper = mount(Table, {
      props: {
        columns: [
          { title: 'Name', key: 'name', dataIndex: 'name', fixed: 'left', width: 100 },
          { title: 'Details', key: 'details' },
        ],
        dataSource: data,
        pagination: false,
        scroll: { x: 1000, y: 200 },
      },
    });
    await settle();
    expect(wrapper.find('.ant-table').classes()).toContain('ant-table-ping-right');

    await wrapper.setProps({ scroll: { x: 500, y: 200 } });
    await settle();
    expect(wrapper.find('.ant-table').classes()).not.toContain('ant-table-ping-right');

    await wrapper.setProps({ scroll: { x: 1000, y: 200 } });
    await settle();
    expect(wrapper.find('.ant-table').classes()).toContain('ant-table-ping-right');
  });
});
