
import { mount } from '@vue/test-utils'
import { asyncExpect } from '@/tests/utils'
import Table from '..'

describe('Table.rowSelection', () => {
  const columns = [{
    title: 'Name',
    dataIndex: 'name',
  }]

  const data = [
    { key: 0, name: 'Jack' },
    { key: 1, name: 'Lucy' },
    { key: 2, name: 'Tom' },
    { key: 3, name: 'Jerry' },
  ]
  function getTableOptions (props = {}, listeners = {}) {
    return {
      propsData: {
        columns,
        dataSource: data,
        rowSelection: {},
        ...props,
      },
      listeners: {
        ...listeners,
      },
      sync: false,
      attachedToDocument: true,
    }
  }
  function renderedNames (wrapper) {
    return wrapper.findAll({ name: 'TableRow' }).wrappers.map(row => {
      return row.props().record.name
    })
  }

  function getStore (wrapper) {
    return wrapper.vm._vnode.componentInstance.store
  }

  it('select by checkbox', async () => {
    const wrapper = mount(Table, getTableOptions())
    const checkboxes = wrapper.findAll('input')
    const checkboxAll = checkboxes.at(0)
    checkboxAll.element.checked = true
    checkboxAll.trigger('change')
    await asyncExpect(() => {
      expect(getStore(wrapper).getState()).toEqual({
        selectedRowKeys: [0, 1, 2, 3],
        selectionDirty: true,
      })
    })
    checkboxes.at(1).element.checked = false
    checkboxes.at(1).trigger('change')
    await asyncExpect(() => {
      expect(getStore(wrapper).getState()).toEqual({
        selectedRowKeys: [1, 2, 3],
        selectionDirty: true,
      })
    })
    checkboxes.at(1).element.checked = true
    checkboxes.at(1).trigger('change')
    await asyncExpect(() => {
      expect(getStore(wrapper).getState()).toEqual({
        selectedRowKeys: [1, 2, 3, 0],
        selectionDirty: true,
      })
    })
  })

  it('select by radio', async () => {
    const wrapper = mount(Table, getTableOptions({ rowSelection: { type: 'radio' }}))
    const radios = wrapper.findAll('input')

    expect(radios.length).toBe(4)
    radios.at(0).element.checked = true
    radios.at(0).trigger('change')
    await asyncExpect(() => {
      expect(getStore(wrapper).getState()).toEqual({
        selectedRowKeys: [0],
        selectionDirty: true,
      })
    })
    radios.at(radios.length - 1).element.checked = true
    radios.at(radios.length - 1).trigger('change')
    await asyncExpect(() => {
      expect(getStore(wrapper).getState()).toEqual({
        selectedRowKeys: [3],
        selectionDirty: true,
      })
    })
  })

  it('pass getCheckboxProps to checkbox', () => {
    const rowSelection = {
      getCheckboxProps: record => ({ props: {
        disabled: record.name === 'Lucy',
        name: record.name,
      }}),
    }

    const wrapper = mount(Table, getTableOptions({ rowSelection }))
    const checkboxes = wrapper.findAll('input').wrappers
    expect(checkboxes[1].vnode.data.attrs.disabled).toBe(false)
    expect(checkboxes[1].vnode.data.attrs.name).toEqual(data[0].name)
    expect(checkboxes[2].vnode.data.attrs.disabled).toBe(true)
    expect(checkboxes[2].vnode.data.attrs.name).toEqual(data[1].name)
  })

  it('works with pagination', async () => {
    const wrapper = mount(Table, getTableOptions({ pagination: { pageSize: 2 }}))

    const checkboxAll = wrapper.find({ name: 'SelectionCheckboxAll' })
    const pagers = wrapper.findAll({ name: 'Pager' })
    checkboxAll.find('input').element.checked = true
    checkboxAll.find('input').trigger('change')
    await asyncExpect(() => {
      expect(checkboxAll.vm.$data).toEqual({ checked: true, indeterminate: false })
    })
    pagers.at(1).trigger('click')
    await asyncExpect(() => {
      expect(checkboxAll.vm.$data).toEqual({ checked: false, indeterminate: false })
    })
    pagers.at(0).trigger('click')
    await asyncExpect(() => {
      expect(checkboxAll.vm.$data).toEqual({ checked: true, indeterminate: false })
    })
  })

  // https://github.com/ant-design/ant-design/issues/4020
  it('handles defaultChecked', async () => {
    const rowSelection = {
      getCheckboxProps: record => {
        return {
          props: {
            defaultChecked: record.key === 0,
          }}
      },
    }

    const wrapper = mount(Table, getTableOptions({ rowSelection }))

    await asyncExpect(() => {
      const checkboxs = wrapper.findAll('input')
      expect(checkboxs.at(1).vnode.data.domProps.checked).toBe(true)
      expect(checkboxs.at(2).vnode.data.domProps.checked).toBe(false)
      checkboxs.at(2).element.checked = true
      checkboxs.at(2).trigger('change')
    }, 0)

    await asyncExpect(() => {
      const checkboxs = wrapper.findAll('input')
      expect(checkboxs.at(1).vnode.data.domProps.checked).toBe(true)
      expect(checkboxs.at(2).vnode.data.domProps.checked).toBe(true)
    }, 1000)
  })

  it('can be controlled', async () => {
    const wrapper = mount(Table, getTableOptions({ rowSelection: { selectedRowKeys: [0] }}))

    expect(getStore(wrapper).getState()).toEqual({
      selectedRowKeys: [0],
      selectionDirty: false,
    })

    wrapper.setProps({ rowSelection: { selectedRowKeys: [1] }})
    await asyncExpect(() => {
      expect(getStore(wrapper).getState()).toEqual({
        selectedRowKeys: [1],
        selectionDirty: false,
      })
    })
  })

  it('fires change & select events', async () => {
    const handleChange = jest.fn()
    const handleSelect = jest.fn()
    const rowSelection = {
      onChange: handleChange,
      onSelect: handleSelect,
    }
    const wrapper = mount(Table, getTableOptions({ rowSelection }))
    const checkboxs = wrapper.findAll('input')
    checkboxs.at(checkboxs.length - 1).element.checked = true
    checkboxs.at(checkboxs.length - 1).trigger('change')
    await asyncExpect(() => {
      expect(handleChange).toBeCalledWith([3], [{ key: 3, name: 'Jerry' }])
      expect(handleSelect.mock.calls.length).toBe(1)
      expect(handleSelect.mock.calls[0][0]).toEqual({ key: 3, name: 'Jerry' })
      expect(handleSelect.mock.calls[0][1]).toEqual(true)
      expect(handleSelect.mock.calls[0][2]).toEqual([{ key: 3, name: 'Jerry' }])
    })
  })

  it('fires selectAll event', async () => {
    const handleSelectAll = jest.fn()
    const rowSelection = {
      onSelectAll: handleSelectAll,
    }
    const wrapper = mount(Table, getTableOptions({ rowSelection }))
    const checkboxs = wrapper.findAll('input')
    checkboxs.at(0).element.checked = true
    checkboxs.at(0).trigger('change')
    await asyncExpect(() => {
      expect(handleSelectAll).toBeCalledWith(true, data, data)
    })
    checkboxs.at(0).element.checked = false
    checkboxs.at(0).trigger('change')
    await asyncExpect(() => {
      expect(handleSelectAll).toBeCalledWith(false, [], data)
    })
  })

  it('render with default selection correctly', async () => {
    const rowSelection = {
      selections: true,
    }
    const wrapper = mount(Table, getTableOptions({ rowSelection }))
    const dropdownWrapper = mount({
      render () {
        return wrapper.find({ name: 'Trigger' }).vm.getComponent()
      },
    }, { sync: false })
    await asyncExpect(() => {
      expect(dropdownWrapper.html()).toMatchSnapshot()
    })

    await asyncExpect(() => {

    })
  })

  it('click select all selection', () => {
    const handleSelectAll = jest.fn()
    const rowSelection = {
      onSelectAll: handleSelectAll,
      selections: true,
    }
    const wrapper = mount(Table, getTableOptions({ rowSelection }))

    const dropdownWrapper = mount({
      render () {
        return wrapper.find({ name: 'Trigger' }).vm.getComponent()
      },
    }, { sync: false })
    dropdownWrapper.findAll('.ant-dropdown-menu-item > div').at(0).trigger('click')

    expect(handleSelectAll).toBeCalledWith(true, data, data)
  })

  it('fires selectInvert event', () => {
    const handleSelectInvert = jest.fn()
    const rowSelection = {
      onSelectInvert: handleSelectInvert,
      selections: true,
    }
    const wrapper = mount(Table, getTableOptions({ rowSelection }))
    const checkboxes = wrapper.findAll('input')
    checkboxes.at(1).element.checked = true
    checkboxes.at(1).trigger('change')
    const dropdownWrapper = mount({
      render () {
        return wrapper.find({ name: 'Trigger' }).vm.getComponent()
      },
    }, { sync: false })
    const div = dropdownWrapper.findAll('.ant-dropdown-menu-item > div')
    div.at(div.length - 1).trigger('click')

    expect(handleSelectInvert).toBeCalledWith([1, 2, 3])
  })

  it('fires selection event', () => {
    const handleSelectOdd = jest.fn()
    const handleSelectEven = jest.fn()
    const rowSelection = {
      selections: [{
        key: 'odd',
        text: '奇数项',
        onSelect: handleSelectOdd,
      }, {
        key: 'even',
        text: '偶数项',
        onSelect: handleSelectEven,
      }],
    }
    const wrapper = mount(Table, getTableOptions({ rowSelection }))

    const dropdownWrapper = mount({
      render () {
        return wrapper.find({ name: 'Trigger' }).vm.getComponent()
      },
    }, { sync: false })
    expect(dropdownWrapper.findAll('.ant-dropdown-menu-item').length).toBe(4)

    dropdownWrapper.findAll('.ant-dropdown-menu-item > div').at(2).trigger('click')
    expect(handleSelectOdd).toBeCalledWith([0, 1, 2, 3])

    dropdownWrapper.findAll('.ant-dropdown-menu-item > div').at(3).trigger('click')
    expect(handleSelectEven).toBeCalledWith([0, 1, 2, 3])
  })

  it('could hide default selection options', () => {
    const rowSelection = {
      hideDefaultSelections: true,
      selections: [{
        key: 'odd',
        text: '奇数项',
      }, {
        key: 'even',
        text: '偶数项',
      }],
    }
    const wrapper = mount(Table, getTableOptions({ rowSelection }))
    const dropdownWrapper = mount({
      render () {
        return wrapper.find({ name: 'Trigger' }).vm.getComponent()
      },
    }, { sync: false })
    expect(dropdownWrapper.findAll('.ant-dropdown-menu-item').length).toBe(2)
  })

  it('handle custom selection onSelect correctly when hide default selection options', () => {
    const handleSelectOdd = jest.fn()
    const handleSelectEven = jest.fn()
    const rowSelection = {
      hideDefaultSelections: true,
      selections: [{
        key: 'odd',
        text: '奇数项',
        onSelect: handleSelectOdd,
      }, {
        key: 'even',
        text: '偶数项',
        onSelect: handleSelectEven,
      }],
    }
    const wrapper = mount(Table, getTableOptions({ rowSelection }))

    const dropdownWrapper = mount({
      render () {
        return wrapper.find({ name: 'Trigger' }).vm.getComponent()
      },
    }, { sync: false })
    expect(dropdownWrapper.findAll('.ant-dropdown-menu-item').length).toBe(2)

    dropdownWrapper.findAll('.ant-dropdown-menu-item > div').at(0).trigger('click')
    expect(handleSelectOdd).toBeCalledWith([0, 1, 2, 3])

    dropdownWrapper.findAll('.ant-dropdown-menu-item > div').at(1).trigger('click')
    expect(handleSelectEven).toBeCalledWith([0, 1, 2, 3])
  })

  // https:// github.com/ant-design/ant-design/issues/4245
  it('handles disabled checkbox correctly when dataSource changes', async () => {
    const rowSelection = {
      getCheckboxProps: record => {
        return { props: { disabled: record.disabled }}
      },
    }
    const wrapper = mount(Table, getTableOptions({ rowSelection }))
    const newData = [
      { key: 7, name: 'Jack', disabled: true },
      { key: 8, name: 'Lucy', disabled: true },
    ]
    await asyncExpect(() => {
      wrapper.setProps({ dataSource: newData })
    })
    await asyncExpect(() => {
      wrapper.findAll('input').wrappers.forEach((checkbox) => {
        expect(checkbox.vnode.data.attrs.disabled).toBe(true)
      })
    })
  })

  // https://github.com/ant-design/ant-design/issues/4779
  it('should not switch pagination when select record', async () => {
    const newData = []
    for (let i = 0; i < 20; i += 1) {
      newData.push({
        key: i.toString(),
        name: i.toString(),
      })
    }
    const wrapper = mount(Table, getTableOptions({
      rowSelection: {},
      dataSource: newData,
    }))
    const pager = wrapper.findAll({ name: 'Pager' })
    pager.at(pager.length - 1).trigger('click') // switch to second page
    wrapper.findAll('input').at(0).element.checked = true
    wrapper.findAll('input').at(0).trigger('change')
    await asyncExpect(() => {
      expect(renderedNames(wrapper)).toEqual(['10', '11', '12', '13', '14', '15', '16', '17', '18', '19'])
    })
  })

  it('highlight selected row', async () => {
    const wrapper = mount(Table, getTableOptions())
    wrapper.findAll('input').at(1).element.checked = true
    wrapper.findAll('input').at(1).trigger('change')
    await asyncExpect(() => {
      expect(wrapper.findAll('tbody tr').at(0).classes()).toContain('ant-table-row-selected')
    })
  })

  it('fix selection column on the left', async () => {
    const wrapper = mount(Table, getTableOptions({
      rowSelection: { fixed: true },
    }))
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
