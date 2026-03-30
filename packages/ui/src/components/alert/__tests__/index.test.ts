import { describe, expect, it, vi } from 'vitest'
import { Alert } from '@ant-design-vue/ui'
import { mount } from '@vue/test-utils'
import { Comment, defineComponent, h, nextTick, onMounted, onUnmounted, ref } from 'vue'

const ImmediateTransition = defineComponent({
  name: 'ImmediateTransition',
  props: {
    onAfterLeave: Function,
  },
  setup(props, { slots }) {
    return () => {
      const children = slots.default?.()?.filter((child) => child.type !== Comment)
      if (!children?.length) {
        props.onAfterLeave?.()
        return null
      }
      return children
    }
  },
})

describe('Alert', () => {
  it('should render correctly', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Test message' },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders with default type (info)', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Info alert' },
    })
    expect(wrapper.find('.ant-alert').classes()).toContain('ant-alert-info')
    expect(wrapper.find('.ant-alert').attributes('role')).toBe('alert')
  })

  it('renders with success type', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Success', type: 'success' },
    })
    expect(wrapper.find('.ant-alert').classes()).toContain('ant-alert-success')
  })

  it('renders with warning type', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Warning', type: 'warning' },
    })
    expect(wrapper.find('.ant-alert').classes()).toContain('ant-alert-warning')
  })

  it('renders with error type', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Error', type: 'error' },
    })
    expect(wrapper.find('.ant-alert').classes()).toContain('ant-alert-error')
  })

  it('displays message text', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Hello World' },
    })
    expect(wrapper.find('.ant-alert-message').text()).toBe('Hello World')
  })

  it('displays description text', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Title', description: 'Some description' },
    })
    expect(wrapper.find('.ant-alert-description').text()).toBe('Some description')
    expect(wrapper.find('.ant-alert').classes()).toContain('ant-alert-with-description')
  })

  it('shows icon when showIcon is true', () => {
    const wrapper = mount(Alert, {
      props: { message: 'With icon', showIcon: true },
    })
    expect(wrapper.find('.ant-alert-icon').exists()).toBe(true)
  })

  it('does not show icon by default', () => {
    const wrapper = mount(Alert, {
      props: { message: 'No icon' },
    })
    expect(wrapper.find('.ant-alert-icon').exists()).toBe(false)
    expect(wrapper.find('.ant-alert').classes()).toContain('ant-alert-no-icon')
  })

  it('shows correct icon per type', () => {
    const types = ['success', 'info', 'warning', 'error'] as const
    const iconClasses = [
      'anticon-check-circle',
      'anticon-info-circle',
      'anticon-exclamation-circle',
      'anticon-close-circle',
    ]

    types.forEach((type, index) => {
      const wrapper = mount(Alert, {
        props: { message: 'Test', type, showIcon: true },
      })
      expect(wrapper.find(`.${iconClasses[index]}`).exists()).toBe(true)
    })
  })

  it('is closable when closable prop is true', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Closable', closable: true },
    })
    expect(wrapper.find('.ant-alert-close-icon').exists()).toBe(true)
    expect(wrapper.find('.ant-alert').classes()).toContain('ant-alert-closable')
  })

  it('is not closable by default', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Not closable' },
    })
    expect(wrapper.find('.ant-alert-close-icon').exists()).toBe(false)
  })

  it('emits close event and hides alert when close button is clicked', async () => {
    const wrapper = mount(Alert, {
      props: { message: 'Close me', closable: true },
    })

    await wrapper.find('.ant-alert-close-icon').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('close')![0][0]).toBeInstanceOf(MouseEvent)

    await nextTick()
    expect(wrapper.find('.ant-alert').exists()).toBe(false)
  })

  it('calls afterClose callback after closing', async () => {
    const afterClose = vi.fn()
    const wrapper = mount(Alert, {
      props: { message: 'Close me', closable: true, afterClose },
      global: {
        stubs: {
          transition: ImmediateTransition,
        },
      },
    })

    await wrapper.find('.ant-alert-close-icon').trigger('click')
    await nextTick()

    expect(afterClose).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.ant-alert').exists()).toBe(false)
  })

  it('renders banner mode with correct classes', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Banner', banner: true },
    })
    expect(wrapper.find('.ant-alert').classes()).toContain('ant-alert-banner')
  })

  it('banner mode defaults to warning type', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Banner', banner: true },
    })
    expect(wrapper.find('.ant-alert').classes()).toContain('ant-alert-warning')
  })

  it('banner mode respects explicitly set type', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Banner', banner: true, type: 'error' },
    })
    expect(wrapper.find('.ant-alert').classes()).toContain('ant-alert-error')
  })

  it('banner mode respects explicitly set info type', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Banner', banner: true, type: 'info' },
    })
    expect(wrapper.find('.ant-alert').classes()).toContain('ant-alert-info')
  })

  it('banner mode shows icon by default', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Banner', banner: true },
    })
    expect(wrapper.find('.ant-alert-icon').exists()).toBe(true)
  })

  it('banner mode still defaults icon when showIcon is explicitly undefined', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Banner', banner: true, showIcon: undefined },
    })
    expect(wrapper.find('.ant-alert-icon').exists()).toBe(true)
  })

  it('banner mode respects explicitly disabled icon', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Banner', banner: true, showIcon: false },
    })
    expect(wrapper.find('.ant-alert-icon').exists()).toBe(false)
  })

  it('renders message slot', () => {
    const wrapper = mount(Alert, {
      slots: {
        message: '<strong>Custom Message</strong>',
      },
    })
    expect(wrapper.find('.ant-alert-message strong').text()).toBe('Custom Message')
  })

  it('renders description slot', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Title' },
      slots: {
        description: '<em>Custom description</em>',
      },
    })
    expect(wrapper.find('.ant-alert-description em').text()).toBe('Custom description')
    expect(wrapper.find('.ant-alert').classes()).toContain('ant-alert-with-description')
  })

  it('renders icon slot', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Custom icon', showIcon: true },
      slots: {
        icon: '<span class="custom-icon">!</span>',
      },
    })
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
  })

  it('renders action slot', () => {
    const wrapper = mount(Alert, {
      props: { message: 'With action' },
      slots: {
        action: '<button class="custom-action">Act</button>',
      },
    })
    expect(wrapper.find('.ant-alert-action').exists()).toBe(true)
    expect(wrapper.find('.custom-action').text()).toBe('Act')
  })

  it('renders closeText slot', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Close text' },
      slots: {
        closeText: 'Close Now',
      },
    })
    const closeButton = wrapper.find('.ant-alert-close-icon')
    expect(closeButton.exists()).toBe(true)
    expect(closeButton.text()).toBe('Close Now')
    expect(closeButton.attributes('aria-label')).toBeUndefined()
  })

  it('keeps aria-label when closeText slot is icon-only', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Close icon text slot' },
      slots: {
        closeText: '<span class="slot-close-icon" aria-hidden="true">x</span>',
      },
    })
    const closeButton = wrapper.find('.ant-alert-close-icon')
    expect(closeButton.find('.slot-close-icon').exists()).toBe(true)
    expect(closeButton.attributes('aria-label')).toBe('Close')
  })

  it('falls back to closeIcon when closeText slot returns empty content', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Empty closeText slot' },
      slots: {
        closeText: () => [],
        closeIcon: '<span class="custom-close">X</span>',
      },
    })
    const closeButton = wrapper.find('.ant-alert-close-icon')
    expect(closeButton.find('.custom-close').exists()).toBe(true)
    expect(closeButton.attributes('aria-label')).toBe('Close')
  })

  it('renders closeIcon slot when closable', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Close icon', closable: true },
      slots: {
        closeIcon: '<span class="custom-close">X</span>',
      },
    })
    expect(wrapper.find('.ant-alert-close-icon').exists()).toBe(true)
    expect(wrapper.find('.custom-close').exists()).toBe(true)
  })

  it('does not become closable when only closeIcon slot is provided', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Close icon only' },
      slots: {
        closeIcon: '<span class="custom-close">X</span>',
      },
    })
    expect(wrapper.find('.ant-alert-close-icon').exists()).toBe(false)
    expect(wrapper.find('.custom-close').exists()).toBe(false)
  })

  it('closeText prop makes alert closable', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Close me', closeText: 'Close Now' },
    })
    const closeButton = wrapper.find('.ant-alert-close-icon')
    expect(closeButton.exists()).toBe(true)
    expect(wrapper.find('.ant-alert').classes()).toContain('ant-alert-closable')
    expect(closeButton.text()).toContain('Close Now')
    expect(closeButton.attributes('aria-label')).toBeUndefined()
  })

  it('closeText true falls back to close icon', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Close me', closeText: true },
      slots: {
        closeIcon: '<span class="custom-close">X</span>',
      },
    })

    const closeButton = wrapper.find('.ant-alert-close-icon')
    expect(closeButton.exists()).toBe(true)
    expect(closeButton.find('.custom-close').exists()).toBe(true)
    expect(closeButton.attributes('aria-label')).toBe('Close')
  })

  it('closeText empty string does not make alert closable', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Close me', closeText: '' },
    })
    const closeButton = wrapper.find('.ant-alert-close-icon')
    expect(closeButton.exists()).toBe(false)
    expect(wrapper.find('.ant-alert').classes()).not.toContain('ant-alert-closable')
  })

  it('falls back to closeIcon when closeText prop content is an empty array', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Close me', closeText: [] },
      slots: {
        closeIcon: '<span class="custom-close">X</span>',
      },
    })

    const closeButton = wrapper.find('.ant-alert-close-icon')
    expect(closeButton.exists()).toBe(true)
    expect(closeButton.find('.custom-close').exists()).toBe(true)
    expect(closeButton.attributes('aria-label')).toBe('Close')
  })

  it('falls back to closeIcon when closeText prop content is comment-only', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Close me', closeText: [h(Comment)] },
      slots: {
        closeIcon: '<span class="custom-close">X</span>',
      },
    })

    const closeButton = wrapper.find('.ant-alert-close-icon')
    expect(closeButton.exists()).toBe(true)
    expect(closeButton.find('.custom-close').exists()).toBe(true)
    expect(closeButton.attributes('aria-label')).toBe('Close')
  })

  it('closeText zero does not make alert closable', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Close me', closeText: 0 },
    })
    const closeButton = wrapper.find('.ant-alert-close-icon')
    expect(closeButton.exists()).toBe(false)
    expect(wrapper.find('.ant-alert').classes()).not.toContain('ant-alert-closable')
  })

  it('closeText prop overrides closeIcon when both exist', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Test', closeText: 'Close' },
      slots: {
        closeIcon: '<span class="custom-close">X</span>',
      },
    })
    expect(wrapper.find('.ant-alert-close-icon').text()).toContain('Close')
    // closeIcon slot should NOT be rendered when closeText is present
    expect(wrapper.find('.custom-close').exists()).toBe(false)
  })

  it('renders VNode closeText prop and omits aria-label', () => {
    const wrapper = mount(Alert, {
      props: {
        message: 'VNode closeText',
        closeText: h('span', { class: 'vnode-close-text' }, 'Dismiss'),
      },
    })
    const closeButton = wrapper.find('.ant-alert-close-icon')
    expect(closeButton.find('.vnode-close-text').exists()).toBe(true)
    expect(closeButton.attributes('aria-label')).toBeUndefined()
  })

  it('renders VNode[] closeText prop and omits aria-label', () => {
    const wrapper = mount(Alert, {
      props: {
        message: 'VNode[] closeText',
        closeText: [
          h('span', { class: 'vnode-close-text-part1' }, 'Dis'),
          h('span', { class: 'vnode-close-text-part2' }, 'miss'),
        ],
      },
    })
    const closeButton = wrapper.find('.ant-alert-close-icon')
    expect(closeButton.find('.vnode-close-text-part1').exists()).toBe(true)
    expect(closeButton.find('.vnode-close-text-part2').exists()).toBe(true)
    expect(closeButton.attributes('aria-label')).toBeUndefined()
  })

  it('keeps VNode closeText component mounted across alert updates', async () => {
    const mounted = vi.fn()
    const unmounted = vi.fn()

    const StatefulCloseText = defineComponent({
      name: 'StatefulCloseText',
      setup() {
        const clicks = ref(0)

        onMounted(mounted)
        onUnmounted(unmounted)

        return () =>
          h(
            'span',
            {
              class: 'stateful-close-text',
              onClick: (event: MouseEvent) => {
                event.stopPropagation()
                clicks.value += 1
              },
            },
            `Dismiss ${clicks.value}`,
          )
      },
    })

    const wrapper = mount(Alert, {
      props: {
        message: 'VNode closeText stateful',
        closeText: h(StatefulCloseText),
      },
    })

    await wrapper.find('.stateful-close-text').trigger('click')
    expect(wrapper.find('.stateful-close-text').text()).toBe('Dismiss 1')

    await wrapper.setProps({ description: 'Updated description' })

    expect(mounted).toHaveBeenCalledTimes(1)
    expect(unmounted).not.toHaveBeenCalled()
    expect(wrapper.find('.stateful-close-text').text()).toBe('Dismiss 1')
  })

  it('renders default slot as message content', () => {
    const wrapper = mount(Alert, {
      slots: {
        default: 'Default slot message',
      },
    })
    expect(wrapper.find('.ant-alert-message').text()).toBe('Default slot message')
  })

  it('passes data and aria attributes to the alert root', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Attrs alert' },
      attrs: {
        'data-test': 'test-id',
        'aria-describedby': 'some-label',
      },
    })

    const alert = wrapper.find('.ant-alert')
    expect(alert.attributes('data-test')).toBe('test-id')
    expect(alert.attributes('aria-describedby')).toBe('some-label')
  })

  it('allows overriding the root role', () => {
    const wrapper = mount(Alert, {
      props: { message: 'Status alert' },
      attrs: {
        role: 'status',
      },
    })

    expect(wrapper.find('.ant-alert').attributes('role')).toBe('status')
  })
})
