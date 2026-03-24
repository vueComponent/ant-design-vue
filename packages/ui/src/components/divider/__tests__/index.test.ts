import { describe, expect, it } from 'vitest'
import { Divider } from '@ant-design-vue/ui'
import { mount } from '@vue/test-utils'

describe('Divider', () => {
  it('should render correctly', () => {
    const wrapper = mount(Divider)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders horizontal divider by default', () => {
    const wrapper = mount(Divider)
    expect(wrapper.classes('ant-divider')).toBe(true)
    expect(wrapper.classes('ant-divider-horizontal')).toBe(true)
    expect(wrapper.attributes('role')).toBe('separator')
  })

  it('renders vertical divider', () => {
    const wrapper = mount(Divider, {
      props: { type: 'vertical' },
    })
    expect(wrapper.classes('ant-divider-vertical')).toBe(true)
  })

  it('renders dashed divider', () => {
    const wrapper = mount(Divider, {
      props: { dashed: true },
    })
    expect(wrapper.classes('ant-divider-dashed')).toBe(true)
  })

  it('renders with text content', () => {
    const wrapper = mount(Divider, {
      slots: { default: 'Section Title' },
    })
    expect(wrapper.classes('ant-divider-with-text')).toBe(true)
    expect(wrapper.classes('ant-divider-with-text-center')).toBe(true)
    expect(wrapper.find('.ant-divider-inner-text').text()).toBe('Section Title')
  })

  it('does not render inner-text span when no content', () => {
    const wrapper = mount(Divider)
    expect(wrapper.find('.ant-divider-inner-text').exists()).toBe(false)
  })

  it('supports left orientation', () => {
    const wrapper = mount(Divider, {
      props: { orientation: 'left' },
      slots: { default: 'Left' },
    })
    expect(wrapper.classes('ant-divider-with-text-left')).toBe(true)
  })

  it('supports right orientation', () => {
    const wrapper = mount(Divider, {
      props: { orientation: 'right' },
      slots: { default: 'Right' },
    })
    expect(wrapper.classes('ant-divider-with-text-right')).toBe(true)
  })

  it('applies orientationMargin for left orientation', () => {
    const wrapper = mount(Divider, {
      props: { orientation: 'left', orientationMargin: '20px' },
      slots: { default: 'Text' },
    })
    expect(wrapper.classes('ant-divider-no-default-orientation-margin-left')).toBe(true)
    const inner = wrapper.find('.ant-divider-inner-text')
    expect((inner.element as HTMLElement).style.marginLeft).toBe('20px')
  })

  it('applies orientationMargin for right orientation as number', () => {
    const wrapper = mount(Divider, {
      props: { orientation: 'right', orientationMargin: 30 },
      slots: { default: 'Text' },
    })
    expect(wrapper.classes('ant-divider-no-default-orientation-margin-right')).toBe(true)
    const inner = wrapper.find('.ant-divider-inner-text')
    expect((inner.element as HTMLElement).style.marginRight).toBe('30px')
  })

  it('does not apply orientationMargin for center orientation', () => {
    const wrapper = mount(Divider, {
      props: { orientation: 'center', orientationMargin: '20px' },
      slots: { default: 'Text' },
    })
    const inner = wrapper.find('.ant-divider-inner-text')
    expect(wrapper.classes('ant-divider-no-default-orientation-margin-left')).toBe(false)
    expect(wrapper.classes('ant-divider-no-default-orientation-margin-right')).toBe(false)
    expect((inner.element as HTMLElement).style.marginLeft).toBe('')
    expect((inner.element as HTMLElement).style.marginRight).toBe('')
  })

  it('does not apply orientationMargin classes without content', () => {
    const wrapper = mount(Divider, {
      props: { orientation: 'left', orientationMargin: '20px' },
    })
    expect(wrapper.classes('ant-divider-no-default-orientation-margin-left')).toBe(false)
    expect(wrapper.classes('ant-divider-no-default-orientation-margin-right')).toBe(false)
  })

  it('renders plain text style', () => {
    const wrapper = mount(Divider, {
      props: { plain: true },
      slots: { default: 'Plain Text' },
    })
    expect(wrapper.classes('ant-divider-plain')).toBe(true)
  })

  it('combines dashed and text', () => {
    const wrapper = mount(Divider, {
      props: { dashed: true },
      slots: { default: 'Dashed with text' },
    })
    expect(wrapper.classes('ant-divider-dashed')).toBe(true)
    expect(wrapper.classes('ant-divider-with-text')).toBe(true)
  })
})
