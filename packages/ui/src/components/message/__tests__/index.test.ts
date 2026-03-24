import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { message } from '../index'

describe('message', () => {
  beforeEach(() => {
    message.config({
      top: 8,
      duration: 3,
      maxCount: undefined,
      getContainer: () => document.body,
      rtl: false,
    })
    message.destroy()
  })

  afterEach(() => {
    vi.useRealTimers()
    message.config({
      top: 8,
      duration: 3,
      maxCount: undefined,
      getContainer: () => document.body,
      rtl: false,
    })
    message.destroy()
  })

  it('has info method', () => {
    expect(typeof message.info).toBe('function')
  })

  it('has success method', () => {
    expect(typeof message.success).toBe('function')
  })

  it('has error method', () => {
    expect(typeof message.error).toBe('function')
  })

  it('has warning method', () => {
    expect(typeof message.warning).toBe('function')
  })

  it('has warn method', () => {
    expect(typeof message.warn).toBe('function')
  })

  it('has loading method', () => {
    expect(typeof message.loading).toBe('function')
  })

  it('has open method', () => {
    expect(typeof message.open).toBe('function')
  })

  it('has destroy method', () => {
    expect(typeof message.destroy).toBe('function')
  })

  it('has config method', () => {
    expect(typeof message.config).toBe('function')
  })

  it('has useMessage method', () => {
    expect(typeof message.useMessage).toBe('function')
  })

  it('returns a destroy function', () => {
    const destroy = message.info('Test')
    expect(typeof destroy).toBe('function')
  })

  it('returns a thenable', () => {
    const result = message.info('Test')
    expect(typeof result.then).toBe('function')
  })

  it('supports object overload on type methods', () => {
    const destroy = message.success({
      content: 'Object params',
      duration: 0,
      key: 'object-overload',
    })
    expect(typeof destroy).toBe('function')
    message.destroy('object-overload')
  })

  it('applies getContainer config', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)

    message.config({ getContainer: () => host })
    message.info('Container test', 0)

    await Promise.resolve()
    expect(host.querySelector('.ant-message')).not.toBeNull()

    host.remove()
  })

  it('calls onClose when destroy all', () => {
    const onClose = vi.fn()
    message.open({ content: 'Close me', duration: 0, onClose })

    message.destroy()
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClick when message is clicked', async () => {
    const onClick = vi.fn()
    message.open({ content: 'Clickable', duration: 0, onClick })

    await Promise.resolve()
    const textNode = Array.from(document.querySelectorAll('.ant-message-text')).find(
      (node) => node.textContent?.trim() === 'Clickable',
    )
    const notice = textNode?.closest('.ant-message-notice') as HTMLElement | null
    expect(notice).not.toBeNull()

    notice?.click()
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('resolves then after actual close', async () => {
    const onResolved = vi.fn()
    const close = message.open({ content: 'Thenable', duration: 0 })

    close.then(onResolved)
    expect(onResolved).not.toHaveBeenCalled()

    close()
    await Promise.resolve()
    expect(onResolved).toHaveBeenCalledTimes(1)
  })

  it('resets auto-close timer when updating same key', async () => {
    vi.useFakeTimers()

    message.open({ key: 'same-key', content: 'Loading', type: 'loading', duration: 10 })
    const updated = message.open({ key: 'same-key', content: 'Done', type: 'success', duration: 1 })
    const onResolved = vi.fn()
    updated.then(onResolved)

    await Promise.resolve()
    vi.advanceTimersByTime(999)
    expect(onResolved).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    vi.advanceTimersByTime(1000)
    await Promise.resolve()

    expect(onResolved).toHaveBeenCalledTimes(1)
  })

  it('supports chained then calls', async () => {
    const close = message.open({ content: 'Chain', duration: 0 })

    const chained = close.then(() => 'step1').then((val) => `${val}-step2`)
    close()

    await expect(chained).resolves.toBe('step1-step2')
  })
})
