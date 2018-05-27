import Vue from 'vue'
import { mount } from '@vue/test-utils'
import Table from '..'

describe('Table.sorter', () => {
  const sorterFn = (a, b) => a.name[0].charCodeAt() - b.name[0].charCodeAt()

  const column = {
    title: 'Name',
    dataIndex: 'name',
    sorter: sorterFn,
  }

  const data = [
    { key: 0, name: 'Jack' },
    { key: 1, name: 'Lucy' },
    { key: 2, name: 'Tom' },
    { key: 3, name: 'Jerry' },
  ]

  function getTableOptions (props = {}, columnProps = {}, listeners = {}) {
    return {
      propsData: {
        columns: [{
          ...column,
          ...columnProps,
        }],
        dataSource: data,
        pagination: false,
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

  it('renders sorter icon correctly', (done) => {
    const wrapper = mount(Table, getTableOptions())
    Vue.nextTick(() => {
      expect(wrapper.find('thead').html()).toMatchSnapshot()
      done()
    })
  })

  it('default sort order ascend', (done) => {
    const wrapper = mount(Table, getTableOptions({}, {
      defaultSortOrder: 'ascend',
    }))
    Vue.nextTick(() => {
      expect(renderedNames(wrapper)).toEqual(['Jack', 'Jerry', 'Lucy', 'Tom'])
      done()
    })
  })

  it('default sort order descend', (done) => {
    const wrapper = mount(Table, getTableOptions({}, {
      defaultSortOrder: 'descend',
    }))
    Vue.nextTick(() => {
      expect(renderedNames(wrapper)).toEqual(['Tom', 'Lucy', 'Jack', 'Jerry'])
      done()
    })
  })

  it('sort records', (done) => {
    const wrapper = mount(Table, getTableOptions())
    Vue.nextTick(() => {
      wrapper.find('.ant-table-column-sorter-up').trigger('click')
      Vue.nextTick(() => {
        // expect(renderedNames(wrapper)).toEqual(['Jack', 'Jerry', 'Lucy', 'Tom'])
        expect(wrapper.find('.ant-table-tbody').text()).toEqual(['Jack', 'Jerry', 'Lucy', 'Tom'].join(''))
        wrapper.find('.ant-table-column-sorter-down').trigger('click')
        Vue.nextTick(() => {
          expect(wrapper.find('.ant-table-tbody').text()).toEqual(['Tom', 'Lucy', 'Jack', 'Jerry'].join(''))
          done()
        })
      })
    })
  })

  it('can be controlled by sortOrder', (done) => {
    const wrapper = mount(Table, getTableOptions({
      columns: [{ ...column, sortOrder: 'ascend' }],
    }))
    Vue.nextTick(() => {
      expect(renderedNames(wrapper)).toEqual(['Jack', 'Jerry', 'Lucy', 'Tom'])
      done()
    })
  })

  it('fires change event', (done) => {
    const handleChange = jest.fn()
    const wrapper = mount(Table, getTableOptions({}, {}, { change: handleChange }))

    wrapper.find('.ant-table-column-sorter-up').trigger('click')
    Vue.nextTick(() => {
      const sorter = handleChange.mock.calls[0][2]
      expect(sorter.column.dataIndex).toBe('name')
      expect(sorter.order).toBe('ascend')
      expect(sorter.field).toBe('name')
      expect(sorter.columnKey).toBe('name')
      done()
    })
  })

  it('works with grouping columns in controlled mode', (done) => {
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
    ]
    const testData = [
      { key: 0, name: 'Jack', age: 11 },
      { key: 1, name: 'Lucy', age: 20 },
      { key: 2, name: 'Tom', age: 21 },
      { key: 3, name: 'Jerry', age: 22 },
    ]
    const wrapper = mount(Table, {
      propsData: {
        columns, dataSource: testData,
      },
      sync: false,
    })
    Vue.nextTick(() => {
      expect(renderedNames(wrapper)).toEqual(['Tom', 'Lucy', 'Jack', 'Jerry'])
      done()
    })
  })
})
