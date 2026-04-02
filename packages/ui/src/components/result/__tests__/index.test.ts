import { describe, expect, it } from 'vitest'
import Result from '..'
import UnauthorizedIcon from '../icons/UnauthorizedIcon.vue'
import NotFoundIcon from '../icons/NotFoundIcon.vue'
import ServerErrorIcon from '../icons/ServerErrorIcon.vue'
import { mount } from '@vue/test-utils'
import { h } from 'vue'

describe('Result', () => {
  it('should render correctly with default props', () => {
    const wrapper = mount(Result)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders with ant-result class', () => {
    const wrapper = mount(Result)
    expect(wrapper.classes('ant-result')).toBe(true)
  })

  it('exposes the expected component name', () => {
    expect(Result.name).toBe('AResult')
  })

  it('renders info status by default', () => {
    const wrapper = mount(Result)
    expect(wrapper.classes('ant-result-info')).toBe(true)
  })

  it('renders success status class', () => {
    const wrapper = mount(Result, {
      props: { status: 'success' },
    })
    expect(wrapper.classes('ant-result')).toBe(true)
    expect(wrapper.classes('ant-result-success')).toBe(true)
  })

  it('renders error status class', () => {
    const wrapper = mount(Result, {
      props: { status: 'error' },
    })
    expect(wrapper.classes('ant-result-error')).toBe(true)
  })

  it('renders warning status class', () => {
    const wrapper = mount(Result, {
      props: { status: 'warning' },
    })
    expect(wrapper.classes('ant-result-warning')).toBe(true)
  })

  it('renders 403 status class', () => {
    const wrapper = mount(Result, {
      props: { status: 403 },
    })
    expect(wrapper.classes('ant-result-403')).toBe(true)
  })

  it('renders 404 status class', () => {
    const wrapper = mount(Result, {
      props: { status: 404 },
    })
    expect(wrapper.classes('ant-result-404')).toBe(true)
  })

  it('renders 500 status class', () => {
    const wrapper = mount(Result, {
      props: { status: 500 },
    })
    expect(wrapper.classes('ant-result-500')).toBe(true)
  })

  it('renders string exception statuses', () => {
    const wrapper = mount(Result, {
      props: { status: '404' },
    })
    expect(wrapper.classes('ant-result-404')).toBe(true)
    expect(wrapper.find('.ant-result-image').exists()).toBe(true)
  })

  it('shows title prop', () => {
    const wrapper = mount(Result, {
      props: { title: 'Operation Successful' },
    })
    const title = wrapper.find('.ant-result-title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Operation Successful')
  })

  it('shows subTitle prop', () => {
    const wrapper = mount(Result, {
      props: { subTitle: 'Some additional info' },
    })
    const subTitle = wrapper.find('.ant-result-subtitle')
    expect(subTitle.exists()).toBe(true)
    expect(subTitle.text()).toBe('Some additional info')
  })

  it('hides title when no title prop or slot', () => {
    const wrapper = mount(Result)
    expect(wrapper.find('.ant-result-title').exists()).toBe(false)
  })

  it('hides subtitle when no subTitle prop or slot', () => {
    const wrapper = mount(Result)
    expect(wrapper.find('.ant-result-subtitle').exists()).toBe(false)
  })

  it('renders title slot', () => {
    const wrapper = mount(Result, {
      slots: {
        title: () => h('span', { class: 'custom-title' }, 'Custom Title'),
      },
    })
    const title = wrapper.find('.ant-result-title')
    expect(title.exists()).toBe(true)
    expect(title.find('.custom-title').exists()).toBe(true)
    expect(title.text()).toBe('Custom Title')
  })

  it('renders subTitle slot', () => {
    const wrapper = mount(Result, {
      slots: {
        subTitle: () => h('span', { class: 'custom-subtitle' }, 'Custom SubTitle'),
      },
    })
    const subTitle = wrapper.find('.ant-result-subtitle')
    expect(subTitle.exists()).toBe(true)
    expect(subTitle.find('.custom-subtitle').exists()).toBe(true)
  })

  it('renders icon for each status type', () => {
    const statuses = ['success', 'error', 'info', 'warning'] as const
    for (const status of statuses) {
      const wrapper = mount(Result, {
        props: { status },
      })
      const iconContainer = wrapper.find('.ant-result-icon')
      expect(iconContainer.exists()).toBe(true)
      expect(iconContainer.find('svg').exists()).toBe(true)
    }
  })

  it('renders SVG illustration for 403 status', () => {
    const wrapper = mount(Result, {
      props: { status: 403 },
    })
    const icon = wrapper.find('.ant-result-image')
    expect(icon.find('svg').exists()).toBe(true)
  })

  it('renders SVG illustration for 404 status', () => {
    const wrapper = mount(Result, {
      props: { status: 404 },
    })
    const icon = wrapper.find('.ant-result-image')
    expect(icon.find('svg').exists()).toBe(true)
  })

  it('renders SVG illustration for 500 status', () => {
    const wrapper = mount(Result, {
      props: { status: 500 },
    })
    const icon = wrapper.find('.ant-result-image')
    expect(icon.find('svg').exists()).toBe(true)
  })

  it('renders VNode title and subTitle props', () => {
    const wrapper = mount(Result, {
      props: {
        title: h('span', { class: 'title-node' }, 'VNode Title'),
        subTitle: h('span', { class: 'subtitle-node' }, 'VNode Subtitle'),
      },
    })
    expect(wrapper.find('.title-node').text()).toBe('VNode Title')
    expect(wrapper.find('.subtitle-node').text()).toBe('VNode Subtitle')
  })

  it('renders extra slot', () => {
    const wrapper = mount(Result, {
      props: { status: 'success', title: 'Done' },
      slots: {
        extra: () => h('button', { class: 'action-btn' }, 'Go Back'),
      },
    })
    const extra = wrapper.find('.ant-result-extra')
    expect(extra.exists()).toBe(true)
    expect(extra.find('.action-btn').exists()).toBe(true)
    expect(extra.text()).toBe('Go Back')
  })

  it('renders extra prop content', () => {
    const wrapper = mount(Result, {
      props: {
        extra: h('button', { class: 'extra-prop' }, 'From Prop'),
      },
    })
    expect(wrapper.find('.ant-result-extra .extra-prop').exists()).toBe(true)
  })

  it('hides extra section when no extra slot', () => {
    const wrapper = mount(Result, {
      props: { status: 'success', title: 'Done' },
    })
    expect(wrapper.find('.ant-result-extra').exists()).toBe(false)
  })

  it('renders default slot as content', () => {
    const wrapper = mount(Result, {
      props: { status: 'error', title: 'Error' },
      slots: {
        default: () => h('div', { class: 'error-details' }, 'Something went wrong'),
      },
    })
    const content = wrapper.find('.ant-result-content')
    expect(content.exists()).toBe(true)
    expect(content.find('.error-details').exists()).toBe(true)
    expect(content.text()).toBe('Something went wrong')
  })

  it('hides content section when no default slot', () => {
    const wrapper = mount(Result, {
      props: { status: 'success', title: 'Done' },
    })
    expect(wrapper.find('.ant-result-content').exists()).toBe(false)
  })

  it('custom icon slot overrides default icon', () => {
    const wrapper = mount(Result, {
      props: { status: 'success' },
      slots: {
        icon: () => h('span', { class: 'custom-icon' }, 'ICON'),
      },
    })
    const icon = wrapper.find('.ant-result-icon')
    expect(icon.find('.custom-icon').exists()).toBe(true)
    expect(icon.find('.custom-icon').text()).toBe('ICON')
  })

  it('renders custom icon prop', () => {
    const wrapper = mount(Result, {
      props: {
        icon: h('span', { class: 'icon-prop' }, 'ICON PROP'),
      },
    })
    expect(wrapper.find('.ant-result-icon .icon-prop').text()).toBe('ICON PROP')
  })

  it('preserves presented image convenience exports', () => {
    expect((Result as any).PRESENTED_IMAGE_403).toBe(UnauthorizedIcon)
    expect((Result as any).PRESENTED_IMAGE_404).toBe(NotFoundIcon)
    expect((Result as any).PRESENTED_IMAGE_500).toBe(ServerErrorIcon)
  })

  it('renders all sections together', () => {
    const wrapper = mount(Result, {
      props: {
        status: 'success',
        title: 'Payment Successful',
        subTitle: 'Order #12345',
      },
      slots: {
        extra: () => h('button', 'Go Home'),
        default: () => h('p', 'Transaction details here'),
      },
    })
    expect(wrapper.find('.ant-result-icon').exists()).toBe(true)
    expect(wrapper.find('.ant-result-title').text()).toBe('Payment Successful')
    expect(wrapper.find('.ant-result-subtitle').text()).toBe('Order #12345')
    expect(wrapper.find('.ant-result-extra').exists()).toBe(true)
    expect(wrapper.find('.ant-result-content').exists()).toBe(true)
  })
})
