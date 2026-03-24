import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Badge from '../Badge.vue'
import Ribbon from '../Ribbon.vue'

describe('Badge', () => {
  it('should render correctly', () => {
    const wrapper = mount(Badge, {
      props: { count: 5 },
      slots: { default: '<div class="target">child</div>' },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders count badge', () => {
    const wrapper = mount(Badge, {
      props: { count: 5 },
      slots: { default: '<div>child</div>' },
    })
    expect(wrapper.find('.ant-badge').exists()).toBe(true)
    expect(wrapper.find('.ant-badge-count').exists()).toBe(true)
    expect(wrapper.find('.ant-badge-count').text()).toBe('5')
  })

  it('hides badge when count is zero by default', () => {
    const wrapper = mount(Badge, {
      props: { count: 0 },
      slots: { default: '<div>child</div>' },
    })
    expect(wrapper.find('.ant-badge-count').exists()).toBe(false)
  })

  it('shows badge when count is zero and showZero is true', () => {
    const wrapper = mount(Badge, {
      props: { count: 0, showZero: true },
      slots: { default: '<div>child</div>' },
    })
    expect(wrapper.find('.ant-badge-count').exists()).toBe(true)
    expect(wrapper.find('.ant-badge-count').text()).toBe('0')
  })

  it('displays overflow count', () => {
    const wrapper = mount(Badge, {
      props: { count: 100 },
      slots: { default: '<div>child</div>' },
    })
    expect(wrapper.find('.ant-badge-count').text()).toBe('99+')
  })

  it('supports custom overflowCount', () => {
    const wrapper = mount(Badge, {
      props: { count: 1000, overflowCount: 999 },
      slots: { default: '<div>child</div>' },
    })
    expect(wrapper.find('.ant-badge-count').text()).toBe('999+')
  })

  it('displays exact count when equal to overflowCount', () => {
    const wrapper = mount(Badge, {
      props: { count: 99 },
      slots: { default: '<div>child</div>' },
    })
    expect(wrapper.find('.ant-badge-count').text()).toBe('99')
  })

  it('renders dot mode', () => {
    const wrapper = mount(Badge, {
      props: { dot: true },
      slots: { default: '<div>child</div>' },
    })
    expect(wrapper.find('.ant-badge-dot').exists()).toBe(true)
    expect(wrapper.find('.ant-badge-count').exists()).toBe(false)
  })

  it('renders status badge with text', () => {
    const wrapper = mount(Badge, {
      props: { status: 'success', text: 'Done' },
    })
    expect(wrapper.find('.ant-badge-status').exists()).toBe(true)
    expect(wrapper.find('.ant-badge-status-dot').exists()).toBe(true)
    expect(wrapper.find('.ant-badge-status-dot').classes('ant-badge-status-success')).toBe(true)
    expect(wrapper.find('.ant-badge-status-text').text()).toBe('Done')
  })

  it('renders all status types', () => {
    const statuses = ['success', 'processing', 'error', 'default', 'warning'] as const
    statuses.forEach(status => {
      const wrapper = mount(Badge, { props: { status } })
      expect(wrapper.find(`.ant-badge-status-${status}`).exists()).toBe(true)
    })
  })

  it('supports custom color', () => {
    const wrapper = mount(Badge, {
      props: { count: 5, color: '#f50' },
      slots: { default: '<div>child</div>' },
    })
    const sup = wrapper.find('sup')
    expect(sup.element.style.backgroundColor).toBe('rgb(255, 85, 0)')
  })

  it('supports preset color', () => {
    const wrapper = mount(Badge, {
      props: { count: 5, color: 'blue' },
      slots: { default: '<div>child</div>' },
    })
    expect(wrapper.find('.ant-badge-color-blue').exists()).toBe(true)
  })

  it('supports offset', () => {
    const wrapper = mount(Badge, {
      props: { count: 5, offset: [10, 10] },
      slots: { default: '<div>child</div>' },
    })
    const sup = wrapper.find('sup')
    expect(sup.element.style.right).toBe('-10px')
    expect(sup.element.style.marginTop).toBe('10px')
  })

  it('renders small size', () => {
    const wrapper = mount(Badge, {
      props: { count: 5, size: 'small' },
      slots: { default: '<div>child</div>' },
    })
    expect(wrapper.find('.ant-badge-count-sm').exists()).toBe(true)
  })

  it('supports title attribute', () => {
    const wrapper = mount(Badge, {
      props: { count: 5, title: 'custom title' },
      slots: { default: '<div>child</div>' },
    })
    expect(wrapper.find('sup').attributes('title')).toBe('custom title')
  })

  it('uses count as default title', () => {
    const wrapper = mount(Badge, {
      props: { count: 5 },
      slots: { default: '<div>child</div>' },
    })
    expect(wrapper.find('sup').attributes('title')).toBe('5')
  })

  it('supports string count', () => {
    const wrapper = mount(Badge, {
      props: { count: 'new' },
      slots: { default: '<div>child</div>' },
    })
    expect(wrapper.find('.ant-badge-count').text()).toBe('new')
  })

  it('supports count slot', () => {
    const wrapper = mount(Badge, {
      slots: {
        default: '<div>child</div>',
        count: '<span class="custom-count">!</span>',
      },
    })
    expect(wrapper.find('.custom-count').exists()).toBe(true)
  })

  it('adds not-a-wrapper class when no children', () => {
    const wrapper = mount(Badge, {
      props: { count: 5 },
    })
    expect(wrapper.find('.ant-badge-not-a-wrapper').exists()).toBe(true)
  })

  it('adds multiple-words class for multi-digit counts', () => {
    const wrapper = mount(Badge, {
      props: { count: 10 },
      slots: { default: '<div>child</div>' },
    })
    expect(wrapper.find('.ant-badge-multiple-words').exists()).toBe(true)
  })

  it('supports numberStyle', () => {
    const wrapper = mount(Badge, {
      props: { count: 5, numberStyle: { fontSize: '16px' } },
      slots: { default: '<div>child</div>' },
    })
    expect(wrapper.find('sup').element.style.fontSize).toBe('16px')
  })

  it('renders status badge with text slot', () => {
    const wrapper = mount(Badge, {
      props: { status: 'success' },
      slots: { text: '<strong>Custom</strong>' },
    })
    expect(wrapper.find('.ant-badge-status-text strong').exists()).toBe(true)
  })

  it('renders status with custom color on dot', () => {
    const wrapper = mount(Badge, {
      props: { status: 'success', color: '#f50' },
    })
    const dot = wrapper.find('.ant-badge-status-dot')
    expect((dot.element as HTMLElement).style.backgroundColor).toBe('rgb(255, 85, 0)')
  })
})

describe('Ribbon', () => {
  it('should render correctly', () => {
    const wrapper = mount(Ribbon, {
      props: { text: 'Hello' },
      slots: { default: '<div class="content">Content</div>' },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders ribbon with text', () => {
    const wrapper = mount(Ribbon, {
      props: { text: 'Hot' },
      slots: { default: '<div>Content</div>' },
    })
    expect(wrapper.find('.ant-ribbon-wrapper').exists()).toBe(true)
    expect(wrapper.find('.ant-ribbon').exists()).toBe(true)
    expect(wrapper.find('.ant-ribbon-text').text()).toBe('Hot')
    expect(wrapper.find('.ant-ribbon-corner').exists()).toBe(true)
  })

  it('supports end placement by default', () => {
    const wrapper = mount(Ribbon, {
      props: { text: 'Hot' },
      slots: { default: '<div>Content</div>' },
    })
    expect(wrapper.find('.ant-ribbon-placement-end').exists()).toBe(true)
  })

  it('supports start placement', () => {
    const wrapper = mount(Ribbon, {
      props: { text: 'Hot', placement: 'start' },
      slots: { default: '<div>Content</div>' },
    })
    expect(wrapper.find('.ant-ribbon-placement-start').exists()).toBe(true)
  })

  it('supports preset color', () => {
    const wrapper = mount(Ribbon, {
      props: { text: 'Hot', color: 'green' },
      slots: { default: '<div>Content</div>' },
    })
    expect(wrapper.find('.ant-ribbon-color-green').exists()).toBe(true)
  })

  it('supports custom color', () => {
    const wrapper = mount(Ribbon, {
      props: { text: 'Hot', color: '#f50' },
      slots: { default: '<div>Content</div>' },
    })
    const ribbon = wrapper.find('.ant-ribbon')
    expect((ribbon.element as HTMLElement).style.backgroundColor).toBe('rgb(255, 85, 0)')
  })

  it('applies custom color to corner', () => {
    const wrapper = mount(Ribbon, {
      props: { text: 'Hot', color: '#f50' },
      slots: { default: '<div>Content</div>' },
    })
    const corner = wrapper.find('.ant-ribbon-corner')
    expect((corner.element as HTMLElement).style.color).toBe('rgb(255, 85, 0)')
  })

  it('supports text slot', () => {
    const wrapper = mount(Ribbon, {
      slots: {
        default: '<div>Content</div>',
        text: '<strong>Bold Text</strong>',
      },
    })
    expect(wrapper.find('.ant-ribbon-text strong').exists()).toBe(true)
  })
})
