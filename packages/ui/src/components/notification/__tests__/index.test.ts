import { h, nextTick } from 'vue'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { StepBackwardOutlined } from '@ant-design/icons-vue'
import { notification } from '@ant-design-vue/ui'

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
    document.body.innerHTML = ''
    resetConfig()
    notification.destroy()
  })

  afterEach(() => {
    notification.destroy()
    resetConfig()
    document.body.innerHTML = ''
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

  it('supports closeIcon per notice', async () => {
    notification.open({
      message: 'Notification',
      duration: 0,
      closeIcon: () => h(StepBackwardOutlined),
    })

    await flushNotifications()

    expect(document.querySelectorAll('.anticon-step-backward')).toHaveLength(1)
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

  it('pauses auto close while hovered', async () => {
    const onClose = vi.fn()

    notification.open({
      message: 'Notification',
      duration: 1,
      key: 'hover',
      onClose,
    })

    await flushNotifications()

    const notice = document.querySelector('.ant-notification-notice') as HTMLElement | null
    expect(notice).not.toBeNull()

    await vi.advanceTimersByTimeAsync(500)
    notice?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    await vi.advanceTimersByTimeAsync(600)
    await flushNotifications()

    expect(document.querySelectorAll('.ant-notification-notice')).toHaveLength(1)
    expect(onClose).not.toHaveBeenCalled()
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
})
