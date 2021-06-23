import { mount } from '@vue/test-utils';
import { asyncExpect } from '@/tests/utils';
import Table from '..';
import { sleep } from '../../../tests/utils';

describe('Table.rowSelection', () => {
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
  function getTableOptions(props = {}) {
    return {
      props: {
        columns,
        dataSource: data,
        rowSelection: {},
        ...props,
      },
      sync: false,
      attachedToDocument: true,
    };
  }
  function renderedNames(wrapper) {
    return wrapper.findAllComponents({ name: 'TableRow' }).map(row => {
      return row.props().record.name;
    });
  }

  function getStore(wrapper) {
    return wrapper.vm.$refs.table.store;
  }

  it('select by checkbox', async () => {
    const wrapper = mount(Table, getTableOptions());
    const checkboxes = wrapper.findAll('input');
    const checkboxAll = checkboxes[0];
    checkboxAll.element.checked = true;
    checkboxAll.trigger('change');
    await asyncExpect(() => {
      expect(getStore(wrapper)).toEqual({
        selectedRowKeys: [0, 1, 2, 3],
        selectionDirty: true,
      });
    });
    checkboxes[1].element.checked = false;
    checkboxes[1].trigger('change');
    await asyncExpect(() => {
      expect(getStore(wrapper)).toEqual({
        selectedRowKeys: [1, 2, 3],
        selectionDirty: true,
      });
    });
    checkboxes[1].element.checked = true;
    checkboxes[1].trigger('change');
    await asyncExpect(() => {
      expect(getStore(wrapper)).toEqual({
        selectedRowKeys: [1, 2, 3, 0],
        selectionDirty: true,
      });
    });
  });

  it('select by radio', async () => {
    const wrapper = mount(Table, getTableOptions({ rowSelection: { type: 'radio' } }));
    const radios = wrapper.findAll('input');

    expect(radios.length).toBe(4);
    radios[0].element.checked = true;
    radios[0].trigger('change');
    await asyncExpect(() => {
      expect(getStore(wrapper)).toEqual({
        selectedRowKeys: [0],
        selectionDirty: true,
      });
    });
    radios[radios.length - 1].element.checked = true;
    radios[radios.length - 1].trigger('change');
    await asyncExpect(() => {
      expect(getStore(wrapper)).toEqual({
        selectedRowKeys: [3],
        selectionDirty: true,
      });
    });
  });

  xit('pass getCheckboxProps to checkbox', async () => {
    const rowSelection = {
      getCheckboxProps: record => ({
        props: {
          disabled: record.name === 'Lucy',
          name: record.name,
        },
      }),
    };

    const wrapper = mount(Table, getTableOptions({ rowSelection }));
    const checkboxes = wrapper.findAll('input');
    await sleep();
    expect(checkboxes[1].props.disabled).toBe(false);
    expect(checkboxes[1].vnode.data.attrs.name).toEqual(data[0].name);
    expect(checkboxes[2].vnode.data.attrs.disabled).toBe(true);
    expect(checkboxes[2].vnode.data.attrs.name).toEqual(data[1].name);
  });

  xit('works with pagination', async () => {
    const wrapper = mount(Table, getTableOptions({ pagination: { pageSize: 2 } }));

    const checkboxAll = wrapper.findAllComponents({ name: 'SelectionCheckboxAll' });
    const pagers = wrapper.findAllComponents({ name: 'Pager' });
    checkboxAll.find('input').element.checked = true;
    checkboxAll.find('input').trigger('change');
    await asyncExpect(() => {
      expect(checkboxAll.vm.$data).toEqual({ checked: true, indeterminate: false });
    });
    pagers[1].trigger('click');
    await asyncExpect(() => {
      expect(checkboxAll.vm.$data).toEqual({ checked: false, indeterminate: false });
    });
    pagers[0].trigger('click');
    await asyncExpect(() => {
      expect(checkboxAll.vm.$data).toEqual({ checked: true, indeterminate: false });
    });
  });

  // https://github.com/ant-design/ant-design/issues/4020
  xit('handles defaultChecked', async () => {
    const rowSelection = {
      getCheckboxProps: record => {
        return {
          props: {
            defaultChecked: record.key === 0,
          },
        };
      },
    };

    const wrapper = mount(Table, getTableOptions({ rowSelection }));

    await asyncExpect(() => {
      const checkboxs = wrapper.findAll('input');
      expect(checkboxs[1].vnode.data.domProps.checked).toBe(true);
      expect(checkboxs.at(2).vnode.data.domProps.checked).toBe(false);
      checkboxs.at(2).element.checked = true;
      checkboxs.at(2).trigger('change');
    }, 0);

    await asyncExpect(() => {
      const checkboxs = wrapper.findAll('input');
      expect(checkboxs[1].vnode.data.domProps.checked).toBe(true);
      expect(checkboxs.at(2).vnode.data.domProps.checked).toBe(true);
    }, 1000);
  });

  it('can be controlled', async () => {
    const wrapper = mount(Table, getTableOptions({ rowSelection: { selectedRowKeys: [0] } }));

    expect(getStore(wrapper)).toEqual({
      selectedRowKeys: [0],
      selectionDirty: false,
    });

    wrapper.setProps({ rowSelection: { selectedRowKeys: [1] } });
    await asyncExpect(() => {
      expect(getStore(wrapper)).toEqual({
        selectedRowKeys: [1],
        selectionDirty: false,
      });
    });
  });

  it('fires change & select events', async () => {
    const handleChange = jest.fn();
    const handleSelect = jest.fn();
    const rowSelection = {
      onChange: handleChange,
      onSelect: handleSelect,
    };
    const wrapper = mount(Table, getTableOptions({ rowSelection }));
    const checkboxs = wrapper.findAll('input');
    checkboxs[checkboxs.length - 1].element.checked = true;
    checkboxs[checkboxs.length - 1].trigger('change');
    await asyncExpect(() => {
      expect(handleChange).toBeCalledWith([3], [{ key: 3, name: 'Jerry' }]);
      expect(handleSelect.mock.calls.length).toBe(1);
      expect(handleSelect.mock.calls[0][0]).toEqual({ key: 3, name: 'Jerry' });
      expect(handleSelect.mock.calls[0][1]).toEqual(true);
      expect(handleSelect.mock.calls[0][2]).toEqual([{ key: 3, name: 'Jerry' }]);
    });
  });

  it('fires selectAll event', async () => {
    const handleSelectAll = jest.fn();
    const rowSelection = {
      onSelectAll: handleSelectAll,
    };
    const wrapper = mount(Table, getTableOptions({ rowSelection }));
    const checkboxs = wrapper.findAll('input');
    checkboxs[0].element.checked = true;
    checkboxs[0].trigger('change');
    await asyncExpect(() => {
      expect(handleSelectAll).toBeCalledWith(true, data, data);
    });
    checkboxs[0].element.checked = false;
    checkboxs[0].trigger('change');
    await asyncExpect(() => {
      expect(handleSelectAll).toBeCalledWith(false, [], data);
    });
  });

  xit('render with default selection correctly', async () => {
    const rowSelection = {
      selections: true,
    };
    const wrapper = mount(Table, getTableOptions({ rowSelection }));
    const dropdownWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      expect(dropdownWrapper.html()).toMatchSnapshot();
    });

    await asyncExpect(() => {});
  });

  xit('click select all selection', () => {
    const handleSelectAll = jest.fn();
    const rowSelection = {
      onSelectAll: handleSelectAll,
      selections: true,
    };
    const wrapper = mount(Table, getTableOptions({ rowSelection }));

    const dropdownWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    dropdownWrapper.findAll('.ant-dropdown-menu-item > div')[0].trigger('click');

    expect(handleSelectAll).toBeCalledWith(true, data, data);
  });

  xit('fires selectInvert event', () => {
    const handleSelectInvert = jest.fn();
    const rowSelection = {
      onSelectInvert: handleSelectInvert,
      selections: true,
    };
    const wrapper = mount(Table, getTableOptions({ rowSelection }));
    const checkboxes = wrapper.findAll('input');
    checkboxes[1].element.checked = true;
    checkboxes[1].trigger('change');
    const dropdownWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    const div = dropdownWrapper.findAll('.ant-dropdown-menu-item > div');
    div.at(div.length - 1).trigger('click');

    expect(handleSelectInvert).toBeCalledWith([1, 2, 3]);
  });

  xit('fires selection event', () => {
    const handleSelectOdd = jest.fn();
    const handleSelectEven = jest.fn();
    const rowSelection = {
      selections: [
        {
          key: 'odd',
          text: '奇数项',
          onSelect: handleSelectOdd,
        },
        {
          key: 'even',
          text: '偶数项',
          onSelect: handleSelectEven,
        },
      ],
    };
    const wrapper = mount(Table, getTableOptions({ rowSelection }));

    const dropdownWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    expect(dropdownWrapper.findAll('.ant-dropdown-menu-item').length).toBe(4);

    dropdownWrapper.findAll('.ant-dropdown-menu-item > div').at(2).trigger('click');
    expect(handleSelectOdd).toBeCalledWith([0, 1, 2, 3]);

    dropdownWrapper.findAll('.ant-dropdown-menu-item > div').at(3).trigger('click');
    expect(handleSelectEven).toBeCalledWith([0, 1, 2, 3]);
  });

  xit('could hide default selection options', () => {
    const rowSelection = {
      hideDefaultSelections: true,
      selections: [
        {
          key: 'odd',
          text: '奇数项',
        },
        {
          key: 'even',
          text: '偶数项',
        },
      ],
    };
    const wrapper = mount(Table, getTableOptions({ rowSelection }));
    const dropdownWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    expect(dropdownWrapper.findAll('.ant-dropdown-menu-item').length).toBe(2);
  });

  xit('handle custom selection onSelect correctly when hide default selection options', () => {
    const handleSelectOdd = jest.fn();
    const handleSelectEven = jest.fn();
    const rowSelection = {
      hideDefaultSelections: true,
      selections: [
        {
          key: 'odd',
          text: '奇数项',
          onSelect: handleSelectOdd,
        },
        {
          key: 'even',
          text: '偶数项',
          onSelect: handleSelectEven,
        },
      ],
    };
    const wrapper = mount(Table, getTableOptions({ rowSelection }));

    const dropdownWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );
    expect(dropdownWrapper.findAll('.ant-dropdown-menu-item').length).toBe(2);

    dropdownWrapper.findAll('.ant-dropdown-menu-item > div')[0].trigger('click');
    expect(handleSelectOdd).toBeCalledWith([0, 1, 2, 3]);

    dropdownWrapper.findAll('.ant-dropdown-menu-item > div')[1].trigger('click');
    expect(handleSelectEven).toBeCalledWith([0, 1, 2, 3]);
  });

  // https:// github.com/ant-design/ant-design/issues/4245
  xit('handles disabled checkbox correctly when dataSource changes', async () => {
    const rowSelection = {
      getCheckboxProps: record => {
        return { props: { disabled: record.disabled } };
      },
    };
    const wrapper = mount(Table, getTableOptions({ rowSelection }));
    const newData = [
      { key: 7, name: 'Jack', disabled: true },
      { key: 8, name: 'Lucy', disabled: true },
    ];
    await asyncExpect(() => {
      wrapper.setProps({ dataSource: newData });
    });
    await asyncExpect(() => {
      wrapper.findAll('input').wrappers.forEach(checkbox => {
        expect(checkbox.vnode.data.attrs.disabled).toBe(true);
      });
    });
  });

  // https://github.com/ant-design/ant-design/issues/4779
  xit('should not switch pagination when select record', async () => {
    const newData = [];
    for (let i = 0; i < 20; i += 1) {
      newData.push({
        key: i.toString(),
        name: i.toString(),
      });
    }
    const wrapper = mount(
      Table,
      getTableOptions({
        rowSelection: {},
        dataSource: newData,
      }),
    );
    const pager = wrapper.findAll({ name: 'Pager' });
    pager.at(pager.length - 1).trigger('click'); // switch to second page
    wrapper.findAll('input')[0].element.checked = true;
    wrapper.findAll('input')[0].trigger('change');
    await asyncExpect(() => {
      expect(renderedNames(wrapper)).toEqual([
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
      ]);
    });
  });

  it('highlight selected row', async () => {
    const wrapper = mount(Table, getTableOptions());
    wrapper.findAll('input')[1].element.checked = true;
    wrapper.findAll('input')[1].trigger('change');
    await asyncExpect(() => {
      expect(wrapper.findAll('tbody tr')[0].classes()).toContain('ant-table-row-selected');
    });
  });

  it('fix selection column on the left', async () => {
    const wrapper = mount(
      Table,
      getTableOptions({
        rowSelection: { fixed: true },
      }),
    );
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  // https://github.com/ant-design/ant-design/issues/10629
  xit('should keep all checked state when remove item from dataSource', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        rowSelection: {
          selectedRowKeys: [0, 1, 2, 3],
        },
      },
      sync: false,
    });
    await asyncExpect(() => {
      expect(wrapper.findAllComponents({ name: 'ACheckbox' }).length).toBe(5);
      const allCheckbox = wrapper.findAllComponents({ name: 'ACheckbox' });
      Array(allCheckbox.length).forEach((_, index) => {
        const checkbox = allCheckbox.at(index);
        expect(checkbox.vm.checked).toBe(true);
        expect(checkbox.vm.indeterminate).toBe(false);
      });
      wrapper.setProps({
        dataSource: data.slice(1),
        rowSelection: {
          selectedRowKeys: [1, 2, 3],
        },
      });
    });
    await asyncExpect(() => {
      expect(wrapper.findAllComponents({ name: 'ACheckbox' }).length).toBe(4);
      const allCheckbox = wrapper.findAllComponents({ name: 'ACheckbox' });
      Array(allCheckbox.length).forEach((_, index) => {
        const checkbox = allCheckbox.at(index);
        expect(checkbox.vm.checked).toBe(true);
        expect(checkbox.vm.indeterminate).toBe(false);
      });
    });
  });

  // https://github.com/ant-design/ant-design/issues/11042
  it('add columnTitle for rowSelection', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        rowSelection: {
          columnTitle: '多选',
        },
      },
      sync: false,
    });
    await asyncExpect(() => {
      expect(wrapper.findAll('thead tr div')[0].text()).toBe('多选');
    });
    await asyncExpect(() => {
      wrapper.setProps({
        rowSelection: {
          type: 'radio',
          columnTitle: '单选',
        },
      });
    });
    await asyncExpect(() => {
      expect(wrapper.findAll('thead tr div')[0].text()).toBe('单选');
    });
  });

  // https://github.com/ant-design/ant-design/issues/11384
  xit('should keep item even if in filter', async () => {
    const filterColumns = [
      {
        title: 'Name',
        dataIndex: 'name',
        filters: [
          {
            text: 'Jack',
            value: 'Jack',
          },
          {
            text: 'Lucy',
            value: 'Lucy',
          },
        ],
        filterDropdownVisible: true,
        onFilter: (value, record) => record.name.indexOf(value) === 0,
      },
    ];

    const onChange = jest.fn();
    const rowSelection = {
      onChange,
    };

    const wrapper = mount(Table, {
      props: {
        columns: filterColumns,
        dataSource: data,
        rowSelection,
      },
      sync: false,
    });

    const dropdownWrapper = mount(
      {
        render() {
          return wrapper.find({ name: 'Trigger' }).vm.getComponent();
        },
      },
      { sync: false },
    );

    function clickItem() {
      wrapper.findAll(
        'tbody .ant-table-selection-column .ant-checkbox-input',
      )[0].element.checked = true;
      wrapper.findAll('tbody .ant-table-selection-column .ant-checkbox-input')[0].trigger('change');
    }

    // Check Jack
    dropdownWrapper.findAll('.ant-dropdown-menu-item .ant-checkbox-wrapper')[0].trigger('click');
    dropdownWrapper
      .find('.ant-table-filter-dropdown-btns .ant-table-filter-dropdown-link.confirm')
      .trigger('click');
    await asyncExpect(() => {
      expect(wrapper.findAll('tbody tr').length).toBe(1);
    });
    await asyncExpect(() => {
      clickItem();
    });
    await asyncExpect(() => {
      expect(onChange.mock.calls[0][0].length).toBe(1);
      expect(onChange.mock.calls[0][1].length).toBe(1);
    });

    await asyncExpect(() => {
      dropdownWrapper.findAll('.ant-dropdown-menu-item .ant-checkbox-wrapper')[0].trigger('click');
    });

    await asyncExpect(() => {
      // Check Lucy
      dropdownWrapper.findAll('.ant-dropdown-menu-item .ant-checkbox-wrapper')[1].trigger('click');
    });
    await asyncExpect(() => {
      dropdownWrapper
        .find('.ant-table-filter-dropdown-btns .ant-table-filter-dropdown-link.confirm')
        .trigger('click');
    });
    await asyncExpect(() => {
      expect(wrapper.findAll('tbody tr').length).toBe(1);
    });
    await asyncExpect(() => {
      clickItem();
    });
    await asyncExpect(() => {
      expect(onChange.mock.calls[1][0].length).toBe(2);
      expect(onChange.mock.calls[1][1].length).toBe(2);
    });
  });

  xit('render correctly when set childrenColumnName', async () => {
    const newDatas = [
      {
        key: 1,
        name: 'Jack',
        children: [
          {
            key: 11,
            name: 'John Brown',
          },
        ],
      },
      {
        key: 2,
        name: 'Lucy',
        children: [
          {
            key: 21,
            name: 'Lucy Brown',
          },
        ],
      },
    ];

    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: newDatas,
        rowSelection: {},
        childrenColumnName: 'test',
      },
      sync: false,
    });

    const checkboxes = wrapper.findAll('input');
    const checkboxAll = wrapper.findAllComponents({ name: 'SelectionCheckboxAll' });

    checkboxes[1].element.checked = true;
    checkboxes[1].trigger('change');
    expect(checkboxAll.$data).toEqual({ indeterminate: true, checked: false });

    checkboxes[2].element.checked = true;
    checkboxes[2].trigger('change');
    await asyncExpect(() => {
      expect(checkboxAll.vm.$data).toEqual({ indeterminate: false, checked: true });
    });
  });
});
