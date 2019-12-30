import Vue from 'vue';
import { mount } from '@vue/test-utils';
import { asyncExpect } from '@/tests/utils';
import Table from '..';

function $$(className) {
  return document.body.querySelectorAll(className);
}

describe('Table.filter', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  const filterFn = (value, record) => record.name.indexOf(value) !== -1;
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

  function getTableOptions(props = {}, listeners = {}) {
    return {
      propsData: {
        columns: [column],
        dataSource: data,
        pagination: false,
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

  it('renders filter correctly', done => {
    const wrapper = mount(Table, getTableOptions());
    Vue.nextTick(() => {
      expect(wrapper.html()).toMatchSnapshot();
      done();
    });
  });

  it('renders menu correctly', async () => {
    const wrapper = mount(Table, getTableOptions());
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

  it('renders radio filter correctly', async () => {
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

  it('renders custom content correctly', done => {
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
  it('can be controlled by filterDropdownVisible', done => {
    const wrapper = mount(
      Table,
      getTableOptions({
        columns: [
          {
            ...column,
            filterDropdownVisible: true,
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
          filterDropdownVisible: false,
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
            onFilterDropdownVisibleChange: handleChange,
          },
        ],
      }),
    );

    wrapper
      .findAll('.ant-dropdown-trigger')
      .at(0)
      .trigger('click');

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

  it('fires change event', async () => {
    const handleChange = jest.fn();
    const wrapper = mount(Table, getTableOptions({}, { change: handleChange }));
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

  it('three levels menu', async () => {
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
    // jest.useFakeTimers()
    const dropdownWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false, attachToDocument: true },
    );
    await asyncExpect(() => {
      dropdownWrapper
        .findAll('.ant-dropdown-menu-submenu-title')
        .at(0)
        .trigger('mouseenter');
    });
    await asyncExpect(() => {
      $$('.ant-dropdown-menu-submenu-title')[1].dispatchEvent(new MouseEvent('mouseenter'));
    }, 1000);
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

  it('works with JSX in controlled mode', async () => {
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
      { sync: false, attachToDocument: true },
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
      propsData: {
        columns,
        dataSource: testData,
      },
      sync: false,
    });
    Vue.nextTick(() => {
      expect(renderedNames(wrapper)).toEqual(['Jack']);
      done();
    });
  });

  //   it('confirm filter when dropdown hidden', (done) => {
  //     const handleChange = jest.fn()
  //     const wrapper = mount(Table, { ...getTableOptions({
  //       columns: [{
  //         ...column,
  //         filters: [
  //           { text: 'Jack', value: 'Jack' },
  //           { text: 'Lucy', value: 'Lucy' },
  //         ],
  //       }],
  //     }, { change: handleChange }), attachToDocument: true })

  //     wrapper.find('.ant-dropdown-trigger').first().simulate('click')
  //     wrapper.find('.ant-dropdown-menu-item').first().simulate('click')
  //     wrapper.find('.ant-dropdown-trigger').first().simulate('click')

  //     expect(handleChange).toBeCalled()
  //   })
});
