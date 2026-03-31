import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { StepBackwardOutlined } from '@ant-design/icons-vue'
import { notification } from '@ant-design-vue/ui'
import NotificationItem from '../NotificationItem.vue'

async function flushNotifications() {
  await nextTick()
  await Promise.resolve()
}

async function flushExitTransitions() {
  await vi.runOnlyPendingTimersAsync()
  await flushNotifications()
}

function resetConfig() {
  notification.config({
    top: 24,
    bottom: 24,
    duration: 4.5,
    placement: 'topRight',
    getContainer: undefined,
    closeIcon: undefined,
    rtl: false,
    maxCount: undefined,
  })
}

describe('notification', () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: new Date('2025-03-25T08:00:00.000Z'), shouldAdvanceTime: true })
    document.body.innerHTML = ''
    resetConfig()
    notification.destroy()
  })

  afterEach(() => {
    notification.destroy()
    resetConfig()
    document.body.innerHTML = ''
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it('has success method', () => {
    expect(typeof notification.success).toBe('function')
  })

  it('has info method', () => {
    expect(typeof notification.info).toBe('function')
  })

  it('has warning method', () => {
    expect(typeof notification.warning).toBe('function')
  })

  it('has warn alias', () => {
    expect(typeof notification.warn).toBe('function')
  })

  it('has error method', () => {
    expect(typeof notification.error).toBe('function')
  })

  it('has open method', () => {
    expect(typeof notification.open).toBe('function')
  })

  it('has close method', () => {
    expect(typeof notification.close).toBe('function')
  })

  it('has destroy method', () => {
    expect(typeof notification.destroy).toBe('function')
  })

  it('has config method', () => {
    expect(typeof notification.config).toBe('function')
  })

  it('closes notification by key', async () => {
    notification.open({
      message: 'Notification 1',
      duration: 0,
      key: '1',
    })
    notification.open({
      message: 'Notification 2',
      duration: 0,
      key: '2',
    })

    await flushNotifications()

    expect(document.querySelectorAll('.ant-notification-notice')).toHaveLength(2)

    notification.close('1')
    await flushExitTransitions()

    expect(document.querySelectorAll('.ant-notification-notice')).toHaveLength(1)
    expect(document.body.textContent).toContain('Notification 2')
  })

  it('destroys mounted containers', async () => {
    notification.open({
      message: 'Notification',
      duration: 0,
    })

    await flushNotifications()
    expect(document.querySelectorAll('.ant-notification')).toHaveLength(1)

    notification.destroy()
    await flushNotifications()

    expect(document.querySelectorAll('.ant-notification')).toHaveLength(0)
    expect(document.querySelectorAll('.ant-notification-notice')).toHaveLength(0)
  })

  it('renders legacy type icon classes', async () => {
    notification.success({ message: 'Success', duration: 0 })
    notification.info({ message: 'Info', duration: 0 })
    notification.warning({ message: 'Warning', duration: 0 })
    notification.error({ message: 'Error', duration: 0 })

    await flushNotifications()

    expect(document.querySelectorAll('.ant-notification-notice-icon-success')).toHaveLength(1)
    expect(document.querySelectorAll('.ant-notification-notice-icon-info')).toHaveLength(1)
    expect(document.querySelectorAll('.ant-notification-notice-icon-warning')).toHaveLength(1)
    expect(document.querySelectorAll('.ant-notification-notice-icon-error')).toHaveLength(1)
  })

  it('applies notice type classes for static api variants', async () => {
    notification.success({ message: 'Success', duration: 0 })
    notification.info({ message: 'Info', duration: 0 })
    notification.warning({ message: 'Warning', duration: 0 })
    notification.error({ message: 'Error', duration: 0 })

    await flushNotifications()

    expect(document.querySelectorAll('.ant-notification-notice-success')).toHaveLength(1)
    expect(document.querySelectorAll('.ant-notification-notice-info')).toHaveLength(1)
    expect(document.querySelectorAll('.ant-notification-notice-warning')).toHaveLength(1)
    expect(document.querySelectorAll('.ant-notification-notice-error')).toHaveLength(1)
  })

  it('does not render an empty description block when description is absent', async () => {
    notification.open({
      message: 'Notification',
      duration: 0,
    })

    await flushNotifications()

    expect(document.querySelectorAll('.ant-notification-notice-description')).toHaveLength(0)
  })

  it('supports closeIcon per notice', async () => {
    notification.open({
      message: 'Notification',
      duration: 0,
      closeIcon: () => h(StepBackwardOutlined),
    })

    await flushNotifications()

    expect(document.querySelectorAll('.anticon-step-backward')).toHaveLength(1)
  })

  it('falls back to type icon when custom icon resolves to null', async () => {
    notification.success({
      message: 'Notification',
      duration: 0,
      icon: (() => null) as any,
    })

    await flushNotifications()

    expect(document.querySelectorAll('.ant-notification-notice-icon-success')).toHaveLength(1)
  })

  it('supports global closeIcon config', async () => {
    notification.config({
      closeIcon: () => h(StepBackwardOutlined),
    })

    notification.open({
      message: 'Notification',
      duration: 0,
    })

    await flushNotifications()

    expect(document.querySelectorAll('.anticon-step-backward')).toHaveLength(1)
  })

  it('falls back to default close icon when custom closeIcon resolves to null', async () => {
    notification.open({
      message: 'Notification',
      duration: 0,
      closeIcon: (() => null) as any,
    })

    await flushNotifications()

    expect(document.querySelectorAll('.ant-notification-close-icon')).toHaveLength(1)
  })

  it('renders close control as button', async () => {
    notification.open({
      message: 'Notification',
      duration: 0,
    })

    await flushNotifications()

    const closeButton = document.querySelector('.ant-notification-notice-close')

    expect(closeButton?.tagName).toBe('BUTTON')
    expect(closeButton?.getAttribute('type')).toBe('button')
  })

  it('applies rtl class to mounted container when configured', async () => {
    notification.config({
      rtl: true,
    })

    notification.open({
      message: 'Notification',
      duration: 0,
    })

    await flushNotifications()

    const container = document.querySelector('.ant-notification')

    expect(container?.classList.contains('ant-notification-rtl')).toBe(true)
  })

  it('reuses the same placement container when rtl changes', async () => {
    notification.open({
      message: 'Notification 1',
      duration: 0,
      placement: 'topRight',
    })

    await flushNotifications()

    notification.config({
      rtl: true,
    })
    await flushNotifications()

    notification.open({
      message: 'Notification 2',
      duration: 0,
      placement: 'topRight',
    })

    await flushNotifications()

    const containers = document.querySelectorAll('.ant-notification-topRight')

    expect(containers).toHaveLength(1)
    expect(containers[0]?.classList.contains('ant-notification-rtl')).toBe(true)
    expect(document.querySelectorAll('.ant-notification-notice')).toHaveLength(2)
  })

  it('mounts into custom container', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    notification.open({
      message: 'Notification',
      duration: 0,
      getContainer: () => container,
    })

    await flushNotifications()

    expect(container.querySelectorAll('.ant-notification')).toHaveLength(1)
  })

  it('applies per-notice top and bottom overrides to container style', async () => {
    notification.open({
      message: 'Top notification',
      duration: 0,
      placement: 'topRight',
      top: 48,
    })

    notification.open({
      message: 'Bottom notification',
      duration: 0,
      placement: 'bottomRight',
      bottom: 36,
    })

    await flushNotifications()

    const topContainer = document.querySelector('.ant-notification-topRight') as HTMLElement | null
    const bottomContainer = document.querySelector('.ant-notification-bottomRight') as HTMLElement | null

    expect(topContainer?.style.top).toBe('48px')
    expect(bottomContainer?.style.bottom).toBe('36px')
  })

  it('pauses auto close on mouseenter and resumes on mouseleave', async () => {
    const wrapper = mount(NotificationItem, {
      attachTo: document.body,
      props: {
        item: {
          id: 'hover',
          updateMark: 0,
          args: {
            message: 'Notification',
            duration: 1,
          },
        },
      },
    })

    await vi.advanceTimersByTimeAsync(500)
    await wrapper.trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(600)

    expect(wrapper.emitted('close')).toBeUndefined()

    await wrapper.trigger('mouseleave')
    await vi.advanceTimersByTimeAsync(1000)

    expect(wrapper.emitted('close')).toEqual([['hover']])

    wrapper.unmount()
  })

  it('restarts auto close timer when updating the same key', async () => {
    notification.open({
      message: 'Notification 1',
      duration: 1,
      key: 'update',
    })

    await flushNotifications()
    await vi.advanceTimersByTimeAsync(500)

    notification.open({
      message: 'Notification 2',
      duration: 1,
      key: 'update',
    })

    await flushNotifications()
    await vi.advanceTimersByTimeAsync(600)
    await flushNotifications()

    expect(document.querySelectorAll('.ant-notification-notice')).toHaveLength(1)
    expect(document.body.textContent).toContain('Notification 2')

    await vi.advanceTimersByTimeAsync(500)
    await flushExitTransitions()

    expect(document.querySelectorAll('.ant-notification-notice')).toHaveLength(0)
  })

  it('updates notifications when the key is an empty string', async () => {
    notification.open({
      message: 'Notification 1',
      duration: 1,
      key: '',
    })

    await flushNotifications()
    await vi.advanceTimersByTimeAsync(500)

    notification.open({
      message: 'Notification 2',
      duration: 1,
      key: '',
    })

    await flushNotifications()
    await vi.advanceTimersByTimeAsync(600)
    await flushNotifications()

    expect(document.querySelectorAll('.ant-notification-notice')).toHaveLength(1)
    expect(document.body.textContent).toContain('Notification 2')
    await vi.advanceTimersByTimeAsync(500)
    await flushExitTransitions()

    expect(document.querySelectorAll('.ant-notification-notice')).toHaveLength(0)
  })
})
