import * as Vue from 'vue';
import { mount } from '@vue/test-utils';
import { asyncExpect, sleep } from '../../../tests/utils';
import Table from '..';

function $$(className) {
  return document.body.querySelectorAll(className);
}

describe('Table.filter', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  const filterFn = (value, record) => {
    return record.name.indexOf(value) !== -1;
  };
  const column = {
    title: 'Name',
    dataIndex: 'name',
    filters: [
      { text: 'Boy', value: 'boy' },
      { text: 'Girl', value: 'girl' },
      {
        text: 'Title',
        value: 'title',
        children: [
          { text: 'Designer', value: 'designer' },
          { text: 'Coder', value: 'coder' },
        ],
      },
    ],
    onFilter: filterFn,
  };

  const data = [
    { key: 0, name: 'Jack' },
    { key: 1, name: 'Lucy' },
    { key: 2, name: 'Tom' },
    { key: 3, name: 'Jerry' },
  ];

  function getTableOptions(props = {}) {
    return {
      props: {
        columns: [column],
        dataSource: data,
        pagination: false,
        ...props,
      },
      sync: false,
      attachTo: 'body',
    };
  }

  function renderedNames(wrapper) {
    return wrapper.findAllComponents({ name: 'TableRow' }).map(row => {
      return row.props().record.name;
    });
  }

  it('renders filter correctly', done => {
    const wrapper = mount(Table, getTableOptions());
    Vue.nextTick(() => {
      expect(wrapper.html()).toMatchSnapshot();
      done();
    });
  });

  xit('renders menu correctly', async () => {
    const wrapper = mount(Table, getTableOptions());
    let dropdownWrapper = null;
    await asyncExpect(() => {
      dropdownWrapper = mount(
        {
          render() {
            return wrapper.findComponent({ name: 'Trigger' }).getComponent();
          },
        },
        { sync: false },
      );
    });
    await asyncExpect(() => {
      expect(dropdownWrapper.html()).toMatchSnapshot();
    });
  });

  xit('renders radio filter correctly', async () => {
    const wrapper = mount(
      Table,
      getTableOptions({
        columns: [
          {
            ...column,
            filterMultiple: false,
          },
        ],
      }),
    );
    let dropdownWrapper = null;
    await asyncExpect(() => {
      dropdownWrapper = mount(
        {
          render() {
            return wrapper.find({ name: 'Trigger' }).vm.getComponent();
          },
        },
        { sync: false },
      );
    });
    await asyncExpect(() => {
      expect(dropdownWrapper.html()).toMatchSnapshot();
    });
  });

  xit('renders custom content correctly', done => {
    const wrapper = mount(Table, {
      ...getTableOptions({
        columns: [
          {
            ...column,
            slots: {
              filterDropdown: 'filterDropdown',
            },
          },
        ],
      }),
      slots: {
        filterDropdown: `<div class='custom-filter-dropdown'>custom filter</div>`,
      },
    });

    Vue.nextTick(() => {
      const dropdownWrapper = mount({
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      });
      expect(dropdownWrapper.html()).toMatchSnapshot();
      done();
    });
  });
  // TODO
  xit('can be controlled by filterDropdownOpen', done => {
    const wrapper = mount(
      Table,
      getTableOptions({
        columns: [
          {
            ...column,
            filterDropdownOpen: true,
          },
        ],
      }),
    );

    let dropdown = wrapper.find({ name: 'ADropdown' });
    expect(dropdown.props().visible).toBe(true);

    wrapper.setProps({
      columns: [
        {
          ...column,
          filterDropdownOpen: false,
        },
      ],
    });
    Vue.nextTick(() => {
      dropdown = wrapper.find({ name: 'ADropdown' });
      expect(dropdown.props().visible).toBe(false);
      done();
    });
  });

  it('fires change event when visible change', () => {
    const handleChange = jest.fn();
    const wrapper = mount(
      Table,
      getTableOptions({
        columns: [
          {
            ...column,
            onFilterDropdownOpenChange: handleChange,
          },
        ],
      }),
    );

    wrapper.findAll('.ant-dropdown-trigger')[0].trigger('click');

    expect(handleChange).toBeCalledWith(true);
  });

  it('can be controlled by filteredValue', done => {
    const wrapper = mount(
      Table,
      getTableOptions({
        columns: [
          {
            ...column,
            filteredValue: ['Lucy'],
          },
        ],
      }),
    );

    expect(wrapper.findAll('tbody tr').length).toBe(1);
    wrapper.setProps({
      columns: [
        {
          ...column,
          filteredValue: [],
        },
      ],
    });
    Vue.nextTick(() => {
      expect(wrapper.findAll('tbody tr').length).toBe(4);
      done();
    });
  });

  it('can be controlled by filteredValue null', done => {
    const wrapper = mount(
      Table,
      getTableOptions({
        columns: [
          {
            ...column,
            filteredValue: ['Lucy'],
          },
        ],
      }),
    );

    expect(wrapper.findAll('tbody tr').length).toBe(1);
    wrapper.setProps({
      columns: [
        {
          ...column,
          filteredValue: null,
        },
      ],
    });
    Vue.nextTick(() => {
      expect(wrapper.findAll('tbody tr').length).toBe(4);
      done();
    });
  });

  xit('fires change event', async () => {
    const handleChange = jest.fn();
    const wrapper = mount(Table, getTableOptions({ onChange: handleChange }));
    const dropdownWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      dropdownWrapper.find({ name: 'MenuItem' }).trigger('click');
      dropdownWrapper.find('.confirm').trigger('click');
    });
    await asyncExpect(() => {
      expect(handleChange).toBeCalledWith(
        {},
        { name: ['boy'] },
        {},
        {
          currentDataSource: [],
        },
      );
    });
  });

  xit('three levels menu', async () => {
    const filters = [
      { text: 'Upper', value: 'Upper' },
      { text: 'Lower', value: 'Lower' },
      {
        text: 'Level2',
        value: 'Level2',
        children: [
          { text: 'Large', value: 'Large' },
          { text: 'Small', value: 'Small' },
          {
            text: 'Level3',
            value: 'Level3',
            children: [
              { text: 'Black', value: 'Black' },
              { text: 'White', value: 'White' },
              { text: 'Jack', value: 'Jack' },
            ],
          },
        ],
      },
    ];
    const wrapper = mount(
      Table,
      getTableOptions({
        columns: [
          {
            ...column,
            filters,
          },
        ],
      }),
    );
    await asyncExpect(() => {
      $$('.ant-dropdown-trigger')[0].click();
    });
    await asyncExpect(() => {
      $$('.ant-dropdown-menu-submenu-title')[0].dispatchEvent(new MouseEvent('mouseenter'));
    }, 0);
    await asyncExpect(() => {
      $$('.ant-dropdown-menu-submenu-title')[1].dispatchEvent(new MouseEvent('mouseenter'));
    }, 500);
    await asyncExpect(() => {
      const menuItem = $$('.ant-dropdown-menu-item');
      menuItem[menuItem.length - 1].click();
    }, 500);

    await asyncExpect(() => {
      $$('.confirm')[0].click();
    });
    await asyncExpect(() => {
      expect(renderedNames(wrapper)).toEqual(['Jack']);
    }, 500);
  });

  xit('works with JSX in controlled mode', async () => {
    const { Column } = Table;

    const App = {
      data() {
        return {
          filters: {},
        };
      },
      methods: {
        handleChange(pagination, filters) {
          this.filters = filters;
        },
      },
      render() {
        return (
          <Table dataSource={data} onChange={this.handleChange}>
            <Column
              title="name"
              dataIndex="name"
              key="name"
              filters={[
                { text: 'Jack', value: 'Jack' },
                { text: 'Lucy', value: 'Lucy' },
              ]}
              filteredValue={this.filters.name}
              onFilter={filterFn}
            />
          </Table>
        );
      },
    };

    const wrapper = mount(App, { sync: false });
    const dropdownWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await asyncExpect(() => {
      dropdownWrapper.find({ name: 'MenuItem' }).trigger('click');
      dropdownWrapper.find('.confirm').trigger('click');
    }, 500);
    await asyncExpect(() => {
      expect(renderedNames(wrapper)).toEqual(['Jack']);
      dropdownWrapper.find('.clear').trigger('click');
    }, 500);
    await asyncExpect(() => {
      expect(renderedNames(wrapper)).toEqual(['Jack', 'Lucy', 'Tom', 'Jerry']);
    }, 500);
  });

  xit('works with grouping columns in controlled mode', async () => {
    const columns = [
      {
        title: 'group',
        key: 'group',
        children: [
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            filters: [
              { text: 'Jack', value: 'Jack' },
              { text: 'Lucy', value: 'Lucy' },
            ],
            onFilter: filterFn,
            filteredValue: ['Jack'],
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
    await sleep(500);
    expect(renderedNames(wrapper)).toEqual(['Jack']);
  });

  fit('confirm filter when dropdown hidden', async () => {
    const handleChange = jest.fn();
    const wrapper = mount(Table, {
      ...getTableOptions({
        columns: [
          {
            ...column,
            filters: [
              { text: 'Jack', value: 'Jack' },
              { text: 'Lucy', value: 'Lucy' },
            ],
          },
        ],
        onChange: handleChange,
      }),
      attachTo: 'body',
    });
    await asyncExpect(() => {
      wrapper.find('.ant-dropdown-trigger').trigger('click');
    }, 0);
    await asyncExpect(() => {
      $$('.ant-dropdown-menu-item')[0].click();
    }, 500);
    await asyncExpect(() => {
      wrapper.find('.ant-dropdown-trigger').trigger('click');
    }, 500);
    await asyncExpect(() => {
      expect(handleChange).toBeCalled();
    }, 0);
  });
});
