import { describe, expect, it, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Modal from '..'
import ConfirmDialog from '../ConfirmDialog.vue'

// Stub teleport to render content inline for testing
const globalStubs = {
  global: {
    stubs: {
      teleport: true,
    },
  },
}

async function flushModalTicks() {
  await nextTick()
  await nextTick()
  await nextTick()
  await nextTick()
}

afterEach(() => {
  Modal.destroyAll()
  document.body.innerHTML = ''
})

describe('Modal', () => {
  it('should render correctly when open', () => {
    const wrapper = mount(Modal, {
      props: { open: true, title: 'Test Modal' },
      slots: { default: 'Modal content' },
      ...globalStubs,
    })
    expect(wrapper.find('.ant-modal').exists()).toBe(true)
    expect(wrapper.find('.ant-modal-title').text()).toBe('Test Modal')
    expect(wrapper.find('.ant-modal-body').text()).toBe('Modal content')
  })

  it('should not render when not open', () => {
    const wrapper = mount(Modal, {
      props: { open: false, title: 'Hidden' },
      ...globalStubs,
    })
    expect(wrapper.find('.ant-modal').exists()).toBe(false)
  })

  it('renders close button when closable', () => {
    const wrapper = mount(Modal, {
      props: { open: true, closable: true },
      ...globalStubs,
    })
    expect(wrapper.find('.ant-modal-close').exists()).toBe(true)
  })

  it('hides close button when closable is false', () => {
    const wrapper = mount(Modal, {
      props: { open: true, closable: false },
      ...globalStubs,
    })
    expect(wrapper.find('.ant-modal-close').exists()).toBe(false)
  })

  it('renders default footer with OK and Cancel buttons', () => {
    const wrapper = mount(Modal, {
      props: { open: true },
      ...globalStubs,
    })
    const footer = wrapper.find('.ant-modal-footer')
    expect(footer.exists()).toBe(true)
    const buttons = footer.findAll('button')
    expect(buttons).toHaveLength(2)
    expect(buttons[0].text()).toBe('Cancel')
    expect(buttons[1].text()).toBe('OK')
  })

  it('hides footer when footer is false', () => {
    const wrapper = mount(Modal, {
      props: { open: true, footer: false },
      ...globalStubs,
    })
    expect(wrapper.find('.ant-modal-footer').exists()).toBe(false)
  })

  it('renders custom footer slot', () => {
    const wrapper = mount(Modal, {
      props: { open: true },
      slots: { footer: '<button class="custom-btn">Custom</button>' },
      ...globalStubs,
    })
    expect(wrapper.find('.custom-btn').exists()).toBe(true)
  })

  it('emits cancel when close button clicked', async () => {
    const wrapper = mount(Modal, {
      props: { open: true, closable: true },
      ...globalStubs,
    })
    await wrapper.find('.ant-modal-close').trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })

  it('emits ok when OK button clicked', async () => {
    const wrapper = mount(Modal, {
      props: { open: true },
      ...globalStubs,
    })
    const buttons = wrapper.findAll('.ant-modal-footer button')
    await buttons[1].trigger('click')
    expect(wrapper.emitted('ok')).toHaveLength(1)
  })

  it('emits cancel when Cancel button clicked', async () => {
    const wrapper = mount(Modal, {
      props: { open: true },
      ...globalStubs,
    })
    const buttons = wrapper.findAll('.ant-modal-footer button')
    await buttons[0].trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })

  it('applies centered class', () => {
    const wrapper = mount(Modal, {
      props: { open: true, centered: true },
      ...globalStubs,
    })
    expect(wrapper.find('.ant-modal-centered').exists()).toBe(true)
  })

  it('applies custom width', () => {
    const wrapper = mount(Modal, {
      props: { open: true, width: 800 },
      ...globalStubs,
    })
    expect(wrapper.find('.ant-modal').attributes('style')).toContain('width: 800px')
  })

  it('applies string width', () => {
    const wrapper = mount(Modal, {
      props: { open: true, width: '50%' },
      ...globalStubs,
    })
    expect(wrapper.find('.ant-modal').attributes('style')).toContain('width: 50%')
  })

  it('renders mask', () => {
    const wrapper = mount(Modal, {
      props: { open: true },
      ...globalStubs,
    })
    expect(wrapper.find('.ant-modal-mask').exists()).toBe(true)
  })

  it('hides mask when mask is false', () => {
    const wrapper = mount(Modal, {
      props: { open: true, mask: false },
      ...globalStubs,
    })
    expect(wrapper.find('.ant-modal-mask').exists()).toBe(false)
  })

  it('shows loading state on OK button', () => {
    const wrapper = mount(Modal, {
      props: { open: true, confirmLoading: true },
      ...globalStubs,
    })
    const buttons = wrapper.findAll('.ant-modal-footer button')
    expect(buttons[1].attributes('aria-busy')).toBe('true')
    expect(wrapper.find('.ant-btn-loading-icon').exists()).toBe(true)
  })

  it('renders custom okText and cancelText', () => {
    const wrapper = mount(Modal, {
      props: { open: true, okText: 'Submit', cancelText: 'Abort' },
      ...globalStubs,
    })
    const buttons = wrapper.findAll('.ant-modal-footer button')
    expect(buttons[0].text()).toBe('Abort')
    expect(buttons[1].text()).toBe('Submit')
  })

  it('renders title slot', () => {
    const wrapper = mount(Modal, {
      props: { open: true },
      slots: { title: '<span class="custom-title">Custom Title</span>' },
      ...globalStubs,
    })
    expect(wrapper.find('.custom-title').exists()).toBe(true)
  })

  it('forwards class and style attrs to the dialog container', () => {
    const wrapper = mount(Modal, {
      props: { open: true },
      attrs: {
        class: 'custom-modal-class',
        style: 'max-width: 640px;',
      },
      ...globalStubs,
    })
    const dialog = wrapper.find('.ant-modal')
    expect(dialog.classes()).toContain('custom-modal-class')
    expect(dialog.attributes('style')).toContain('max-width: 640px')
  })

  it('applies button props to the default footer buttons', () => {
    const wrapper = mount(Modal, {
      props: {
        open: true,
        okType: 'danger',
        cancelButtonProps: { danger: true },
      },
      ...globalStubs,
    })
    const buttons = wrapper.findAll('.ant-modal-footer .ant-btn')
    expect(buttons[0].classes()).toContain('ant-btn-danger')
    expect(buttons[1].classes()).toContain('ant-btn-danger')
  })

  it('has proper aria attributes', () => {
    const wrapper = mount(Modal, {
      props: { open: true, title: 'Accessible Modal' },
      ...globalStubs,
    })
    const dialog = wrapper.find('[role="dialog"]')
    expect(dialog.exists()).toBe(true)
    expect(dialog.attributes('aria-modal')).toBe('true')
  })

  it('applies wrapClassName', () => {
    const wrapper = mount(Modal, {
      props: { open: true, wrapClassName: 'my-custom-wrap' },
      ...globalStubs,
    })
    expect(wrapper.find('.my-custom-wrap').exists()).toBe(true)
  })

  it('applies bodyStyle', () => {
    const wrapper = mount(Modal, {
      props: { open: true, bodyStyle: { padding: '48px' } },
      ...globalStubs,
    })
    expect(wrapper.find('.ant-modal-body').attributes('style')).toContain('padding: 48px')
  })
})

describe('Modal static methods', () => {
  it('has confirm method', () => {
    expect(typeof Modal.confirm).toBe('function')
  })

  it('has info method', () => {
    expect(typeof Modal.info).toBe('function')
  })

  it('has success method', () => {
    expect(typeof Modal.success).toBe('function')
  })

  it('has error method', () => {
    expect(typeof Modal.error).toBe('function')
  })

  it('has warning method', () => {
    expect(typeof Modal.warning).toBe('function')
  })

  it('has destroyAll method', () => {
    expect(typeof Modal.destroyAll).toBe('function')
  })

  it('renders static confirm vnode content', async () => {
    Modal.confirm({
      title: h('span', { class: 'confirm-title-node' }, 'VNode title'),
      content: h('div', { class: 'confirm-content-node' }, 'VNode content'),
    })

    await flushModalTicks()

    expect(document.body.querySelector('.confirm-title-node')?.textContent).toBe('VNode title')
    expect(document.body.querySelector('.confirm-content-node')?.textContent).toBe('VNode content')
  })

  it('passes getContainer, wrapClassName and mask to ConfirmDialog', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const wrapper = mount(ConfirmDialog, {
      props: {
        config: {
          title: h('span', { class: 'confirm-title-node' }, 'VNode title'),
          content: h('div', { class: 'confirm-content-node' }, 'VNode content'),
          getContainer: () => container,
          wrapClassName: 'custom-confirm-wrap',
          mask: false,
        },
      },
    })

    await flushModalTicks()

    expect(container.querySelector('.confirm-title-node')?.textContent).toBe('VNode title')
    expect(container.querySelector('.confirm-content-node')?.textContent).toBe('VNode content')
    expect(container.querySelector('.custom-confirm-wrap')).not.toBeNull()
    expect(container.querySelector('.ant-modal-mask')).toBeNull()

    wrapper.unmount()
  })

  it('supports icon null and danger okType for static confirm', async () => {
    Modal.confirm({
      title: 'Delete this task?',
      icon: null,
      okType: 'danger',
    })

    await flushModalTicks()

    const dialog = document.body.querySelector('.ant-modal-confirm')
    expect(dialog?.querySelector('.ant-modal-confirm-icon')).toBeNull()

    const buttons = dialog?.querySelectorAll('.ant-modal-confirm-btns .ant-btn')
    expect(buttons).toHaveLength(2)
    expect(buttons?.[1].className).toContain('ant-btn-danger')
  })

  it('hides title and content wrappers when set to null', async () => {
    Modal.confirm({
      title: null,
      content: null,
      icon: null,
    })

    await flushModalTicks()

    const dialog = document.body.querySelector('.ant-modal-confirm')
    expect(dialog?.querySelector('.ant-modal-confirm-title')).toBeNull()
    expect(dialog?.querySelector('.ant-modal-confirm-content')).toBeNull()
  })

  it('does not warn when closeIcon or footer is null', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const wrapper = mount(ConfirmDialog, {
      props: {
        config: {
          title: 'No warnings',
          closeIcon: null,
          footer: null,
        },
      },
    })

    await flushModalTicks()

    expect(
      warnSpy.mock.calls.some(([message]) => String(message).includes('Invalid prop')),
    ).toBe(false)

    wrapper.unmount()
    warnSpy.mockRestore()
  })

  it('supports function updater for static confirm', async () => {
    const modal = Modal.success({
      title: 'Before update',
      content: 'old content',
    })

    modal.update((prev) => ({
      ...prev,
      content: 'new content',
    }))

    await flushModalTicks()

    expect(document.body.querySelector('.ant-modal-confirm-content')?.textContent).toContain(
      'new content',
    )
  })

  it('closes static confirm when sync onOk returns truthy', async () => {
    Modal.confirm({
      title: 'Truthy ok',
      onOk: () => true,
    })

    await flushModalTicks()

    const okButton = document.body.querySelectorAll('.ant-modal-confirm-btns .ant-btn')[1] as
      | HTMLButtonElement
      | undefined
    okButton?.click()
    await flushModalTicks()

    expect(document.body.querySelector('.ant-modal-confirm')?.getAttribute('style')).toContain(
      'display: none',
    )
  })

  it('keeps static confirm open when sync onOk returns false', async () => {
    Modal.confirm({
      title: 'False ok',
      onOk: () => false,
    })

    await flushModalTicks()

    const okButton = document.body.querySelectorAll('.ant-modal-confirm-btns .ant-btn')[1] as
      | HTMLButtonElement
      | undefined
    okButton?.click()
    await flushModalTicks()

    expect(document.body.querySelector('.ant-modal-confirm')).not.toBeNull()
  })

  it('closes static confirm when sync onCancel returns truthy', async () => {
    Modal.confirm({
      title: 'Truthy cancel',
      onCancel: () => true,
    })

    await flushModalTicks()

    const cancelButton = document.body.querySelector('.ant-modal-confirm-btns .ant-btn') as
      | HTMLButtonElement
      | null
    cancelButton?.click()
    await flushModalTicks()

    expect(document.body.querySelector('.ant-modal-confirm')?.getAttribute('style')).toContain(
      'display: none',
    )
  })

  it('keeps static confirm open when sync onCancel returns false', async () => {
    Modal.confirm({
      title: 'False cancel',
      onCancel: () => false,
    })

    await flushModalTicks()

    const cancelButton = document.body.querySelector('.ant-modal-confirm-btns .ant-btn') as
      | HTMLButtonElement
      | null
    cancelButton?.click()
    await flushModalTicks()

    expect(document.body.querySelector('.ant-modal-confirm')).not.toBeNull()
  })

  it('shows loading on async cancel', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        config: {
          type: 'confirm',
          title: 'Async cancel',
          onCancel: () => new Promise(() => {}),
        },
      },
    })

    await flushModalTicks()

    const cancelButton = document.body.querySelector('.ant-modal-confirm-btns .ant-btn') as
      | HTMLButtonElement
      | null
    expect(cancelButton).not.toBeNull()

    cancelButton?.click()
    await flushModalTicks()

    expect(cancelButton?.getAttribute('aria-busy')).toBe('true')
    expect(document.body.querySelector('.ant-btn-loading-icon')).not.toBeNull()
    expect(document.body.querySelectorAll('.ant-modal-confirm-btns .ant-btn')[1]?.getAttribute('disabled')).toBe('')

    wrapper.unmount()
  })

  it('keeps confirmLoading as the source of truth for modal ok button loading', () => {
    const wrapper = mount(Modal, {
      props: {
        open: true,
        confirmLoading: true,
        okButtonProps: { loading: false },
      },
      ...globalStubs,
    })

    const buttons = wrapper.findAll('.ant-modal-footer button')
    expect(buttons[1].attributes('aria-busy')).toBe('true')
    expect(wrapper.find('.ant-btn-loading-icon').exists()).toBe(true)
  })

  it('keeps dialog open when close button cancel promise rejects', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        config: {
          type: 'confirm',
          title: 'Reject close',
          closable: true,
          onCancel: () => Promise.reject(new Error('reject close')),
        },
      },
    })

    await flushModalTicks()

    const closeButton = document.body.querySelector('.ant-modal-close') as HTMLButtonElement | null
    expect(closeButton).not.toBeNull()

    closeButton?.click()
    await flushModalTicks()

    expect(document.body.querySelector('.ant-modal-confirm')).not.toBeNull()

    wrapper.unmount()
  })

  it('blocks cancel while async ok is pending', async () => {
    const onCancel = vi.fn()
    const wrapper = mount(ConfirmDialog, {
      props: {
        config: {
          type: 'confirm',
          title: 'Async ok',
          onOk: () => new Promise(() => {}),
          onCancel,
        },
      },
    })

    await flushModalTicks()

    const buttons = document.body.querySelectorAll('.ant-modal-confirm-btns .ant-btn')
    const okButton = buttons[1] as HTMLButtonElement | undefined
    const cancelButtonNode = buttons[0] as HTMLButtonElement | undefined

    okButton?.click()
    await flushModalTicks()

    expect(okButton?.getAttribute('aria-busy')).toBe('true')
    expect(cancelButtonNode?.getAttribute('disabled')).toBe('')

    cancelButtonNode?.click()
    await flushModalTicks()

    expect(onCancel).not.toHaveBeenCalled()

    wrapper.unmount()
  })
})
