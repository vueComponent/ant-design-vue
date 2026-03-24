import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Descriptions from '../Descriptions.vue'
import DescriptionsItem from '../DescriptionsItem.vue'

function createDescriptions(props: Record<string, any> = {}, items: { label: string; content: string; span?: number }[] = []) {
  const defaultItems: typeof items = [
    { label: 'Name', content: 'John' },
    { label: 'Phone', content: '123456' },
    { label: 'Address', content: 'Some Place' },
  ]
  const itemList = items.length > 0 ? items : defaultItems

  return mount(Descriptions, {
    props,
    slots: {
      default: () =>
        itemList.map((item) =>
          h(DescriptionsItem, { label: item.label, span: item.span }, { default: () => item.content }),
        ),
    },
  })
}

describe('Descriptions', () => {
  it('renders with base class', () => {
    const wrapper = createDescriptions()
    expect(wrapper.classes('ant-descriptions')).toBe(true)
  })

  it('renders title from prop', () => {
    const wrapper = createDescriptions({ title: 'User Info' })
    expect(wrapper.find('.ant-descriptions-title').exists()).toBe(true)
    expect(wrapper.find('.ant-descriptions-title').text()).toBe('User Info')
  })

  it('renders title from slot', () => {
    const wrapper = mount(Descriptions, {
      slots: {
        title: () => 'Slot Title',
        default: () => h(DescriptionsItem, { label: 'Name' }, { default: () => 'John' }),
      },
    })
    expect(wrapper.find('.ant-descriptions-title').text()).toBe('Slot Title')
  })

  it('renders extra slot', () => {
    const wrapper = mount(Descriptions, {
      slots: {
        title: () => 'Title',
        extra: () => h('button', 'Edit'),
        default: () => h(DescriptionsItem, { label: 'Name' }, { default: () => 'John' }),
      },
    })
    expect(wrapper.find('.ant-descriptions-extra').exists()).toBe(true)
    expect(wrapper.find('.ant-descriptions-extra button').text()).toBe('Edit')
  })

  it('hides header when no title or extra', () => {
    const wrapper = createDescriptions()
    expect(wrapper.find('.ant-descriptions-header').exists()).toBe(false)
  })

  it('applies bordered class', () => {
    const wrapper = createDescriptions({ bordered: true })
    expect(wrapper.classes('ant-descriptions-bordered')).toBe(true)
  })

  it('applies size classes', () => {
    const middle = createDescriptions({ size: 'middle' })
    expect(middle.classes('ant-descriptions-middle')).toBe(true)

    const small = createDescriptions({ size: 'small' })
    expect(small.classes('ant-descriptions-small')).toBe(true)
  })

  it('does not add size class for default', () => {
    const wrapper = createDescriptions({ size: 'default' })
    expect(wrapper.classes('ant-descriptions-default')).toBe(false)
  })

  it('renders items in a table', () => {
    const wrapper = createDescriptions()
    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.find('tbody').exists()).toBe(true)
  })

  it('renders labels with colon by default', () => {
    const wrapper = createDescriptions()
    const labels = wrapper.findAll('.ant-descriptions-item-label')
    expect(labels.length).toBeGreaterThan(0)
    expect(labels[0].classes('ant-descriptions-item-colon')).toBe(true)
  })

  it('removes colon when colon is false', () => {
    const wrapper = createDescriptions({ colon: false })
    const labels = wrapper.findAll('.ant-descriptions-item-label')
    expect(labels.length).toBeGreaterThan(0)
    expect(labels[0].classes('ant-descriptions-item-colon')).toBe(false)
  })

  it('renders correct number of columns', () => {
    const wrapper = createDescriptions({ column: 3 }, [
      { label: 'A', content: '1' },
      { label: 'B', content: '2' },
      { label: 'C', content: '3' },
      { label: 'D', content: '4' },
      { label: 'E', content: '5' },
      { label: 'F', content: '6' },
    ])
    const rows = wrapper.findAll('.ant-descriptions-row')
    expect(rows.length).toBe(2)
  })

  it('handles span prop on items', () => {
    const wrapper = createDescriptions({ column: 3 }, [
      { label: 'A', content: '1', span: 2 },
      { label: 'B', content: '2' },
      { label: 'C', content: '3', span: 3 },
    ])
    const rows = wrapper.findAll('.ant-descriptions-row')
    expect(rows.length).toBe(2)
  })

  it('renders vertical layout', () => {
    const wrapper = createDescriptions({ layout: 'vertical' }, [
      { label: 'A', content: '1' },
      { label: 'B', content: '2' },
      { label: 'C', content: '3' },
    ])
    // Vertical layout: label row + content row = 2 rows per logical row
    const rows = wrapper.findAll('.ant-descriptions-row')
    expect(rows.length).toBe(2)
  })

  it('renders content for each item', () => {
    const wrapper = createDescriptions({}, [
      { label: 'Name', content: 'Alice' },
      { label: 'Age', content: '25' },
      { label: 'City', content: 'NYC' },
    ])
    const contents = wrapper.findAll('.ant-descriptions-item-content')
    expect(contents.length).toBe(3)
  })

  it('should render snapshot correctly', () => {
    const wrapper = createDescriptions({ title: 'Info', bordered: true })
    expect(wrapper.html()).toMatchSnapshot()
  })
})

describe('DescriptionsItem', () => {
  it('renders standalone with content', () => {
    const wrapper = mount(DescriptionsItem, {
      props: { label: 'Name' },
      slots: { default: () => 'John' },
    })
    expect(wrapper.text()).toContain('John')
  })

  it('applies merged content style', () => {
    const wrapper = mount(DescriptionsItem, {
      props: { label: 'Name', contentStyle: { color: 'red' } },
      slots: { default: () => 'John' },
    })
    const inner = wrapper.find('.ant-descriptions-item-content-inner')
    expect(inner.attributes('style')).toContain('color: red')
  })
})
