import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { Space, SpaceCompact, ConfigProvider } from '@ant-design-vue/ui'

describe('Space', () => {
  it('renders with ant-space class', () => {
    const wrapper = mount(Space, {
      slots: { default: '<span>a</span><span>b</span>' },
    })
    expect(wrapper.classes('ant-space')).toBe(true)
    expect(wrapper.classes('ant-space-horizontal')).toBe(true)
  })

  it('renders vertical direction', () => {
    const wrapper = mount(Space, {
      props: { direction: 'vertical' },
      slots: { default: '<span>a</span>' },
    })
    expect(wrapper.classes('ant-space-vertical')).toBe(true)
  })

  it('applies default gap (small = 8px)', () => {
    const wrapper = mount(Space, {
      slots: { default: '<span>a</span><span>b</span>' },
    })
    expect(wrapper.element.style.columnGap).toBe('8px')
    expect(wrapper.element.style.rowGap).toBe('8px')
  })

  it('supports middle size', () => {
    const wrapper = mount(Space, {
      props: { size: 'middle' },
      slots: { default: '<span>a</span>' },
    })
    expect(wrapper.element.style.columnGap).toBe('16px')
  })

  it('supports large size', () => {
    const wrapper = mount(Space, {
      props: { size: 'large' },
      slots: { default: '<span>a</span>' },
    })
    expect(wrapper.element.style.columnGap).toBe('24px')
  })

  it('supports custom number size', () => {
    const wrapper = mount(Space, {
      props: { size: 20 },
      slots: { default: '<span>a</span>' },
    })
    expect(wrapper.element.style.columnGap).toBe('20px')
  })

  it('supports array size [h, v]', () => {
    const wrapper = mount(Space, {
      props: { size: [8, 16] },
      slots: { default: '<span>a</span>' },
    })
    expect(wrapper.element.style.columnGap).toBe('8px')
    expect(wrapper.element.style.rowGap).toBe('16px')
  })

  it('supports size: 0 (no gap)', () => {
    const wrapper = mount(Space, {
      props: { size: 0 },
      slots: { default: '<span>a</span>' },
    })
    expect(wrapper.element.style.columnGap).toBe('0px')
    expect(wrapper.element.style.rowGap).toBe('0px')
  })

  it('supports wrap prop', () => {
    const wrapper = mount(Space, {
      props: { wrap: true },
      slots: { default: '<span>a</span>' },
    })
    expect(wrapper.element.style.flexWrap).toBe('wrap')
  })

  it('supports align prop', () => {
    const wrapper = mount(Space, {
      props: { align: 'end' },
      slots: { default: '<span>a</span>' },
    })
    expect(wrapper.classes('ant-space-align-end')).toBe(true)
  })

  it('defaults to align-center for horizontal', () => {
    const wrapper = mount(Space, {
      slots: { default: '<span>a</span>' },
    })
    expect(wrapper.classes('ant-space-align-center')).toBe(true)
  })

  it('supports split slot', () => {
    const wrapper = mount(Space, {
      slots: {
        default: '<span>a</span><span>b</span><span>c</span>',
        split: '<span class="split">|</span>',
      },
    })
    expect(wrapper.find('.ant-space-item-split').exists()).toBe(true)
    expect(wrapper.findAll('.ant-space-item-split')).toHaveLength(2)
  })

  it('applies RTL class when direction is rtl', () => {
    const wrapper = mount(ConfigProvider, {
      props: { direction: 'rtl' },
      slots: { default: () => h(Space, null, { default: () => [h('span', 'a')] }) },
    })
    const spaceEl = wrapper.find('.ant-space')
    expect(spaceEl.classes('ant-space-rtl')).toBe(true)
  })

  it('inherits global size from ConfigProvider', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'lg' },
      slots: { default: () => h(Space, null, { default: () => [h('span', 'a')] }) },
    })
    const spaceEl = wrapper.find<HTMLElement>('.ant-space')
    const gap = spaceEl.element.style.columnGap
    expect(gap).toBe('24px')
  })
})

describe('SpaceCompact', () => {
  it('renders with ant-space-compact class', () => {
    const wrapper = mount(SpaceCompact, {
      slots: { default: '<button>a</button><button>b</button>' },
    })
    expect(wrapper.classes('ant-space-compact')).toBe(true)
  })

  it('supports block prop', () => {
    const wrapper = mount(SpaceCompact, {
      props: { block: true },
      slots: { default: '<button>a</button>' },
    })
    expect(wrapper.classes('ant-space-compact-block')).toBe(true)
  })

  it('supports vertical direction', () => {
    const wrapper = mount(SpaceCompact, {
      props: { direction: 'vertical' },
      slots: { default: '<button>a</button>' },
    })
    expect(wrapper.classes('ant-space-compact-vertical')).toBe(true)
  })

  it('supports align prop', () => {
    const wrapper = mount(SpaceCompact, {
      props: { align: 'center' },
      slots: { default: '<button>a</button>' },
    })
    expect(wrapper.classes('ant-space-compact-align-center')).toBe(true)
  })

  it('has role="group" for accessibility', () => {
    const wrapper = mount(SpaceCompact, {
      slots: { default: '<button>a</button>' },
    })
    expect(wrapper.attributes('role')).toBe('group')
  })

  it('applies RTL class when direction is rtl', () => {
    const wrapper = mount(ConfigProvider, {
      props: { direction: 'rtl' },
      slots: { default: () => h(SpaceCompact, null, { default: () => [h('button', 'a')] }) },
    })
    const compactEl = wrapper.find('.ant-space-compact')
    expect(compactEl.classes('ant-space-compact-rtl')).toBe(true)
  })
})

describe('Space.Compact', () => {
  it('exposes Compact as static property', () => {
    expect(Space.Compact).toBe(SpaceCompact)
  })
})
