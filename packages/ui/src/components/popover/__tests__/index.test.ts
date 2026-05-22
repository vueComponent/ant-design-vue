import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Popover from '../Popover.vue'

const mountedWrappers: Array<{ unmount: () => void }> = []

function trackMount<T extends { unmount: () => void }>(wrapper: T) {
  mountedWrappers.push(wrapper)
  return wrapper
}

async function flushPopup() {
  await nextTick()
  await nextTick()
}

function getPopup() {
  return document.body.querySelector('.ant-popover') as HTMLElement | null
}

afterEach(() => {
  mountedWrappers.splice(0).reverse().forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

describe('Popover', () => {
  it('should render correctly', () => {
    const wrapper = trackMount(mount(Popover, {
      props: { title: 'Title', content: 'Content' },
      slots: { default: () => h('span', 'Trigger') },
    }))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders the trigger element', () => {
    const wrapper = trackMount(mount(Popover, {
      props: { title: 'Title', content: 'Content' },
      slots: { default: () => h('span', 'Trigger') },
    }))
    expect(wrapper.text()).toContain('Trigger')
  })

  it('shows title and content when open', async () => {
    trackMount(mount(Popover, {
      attachTo: document.body,
      props: { title: 'My Title', content: 'My Content', open: true },
      slots: { default: () => h('span', 'Trigger') },
    }))

    await flushPopup()
    expect(getPopup()?.querySelector('.ant-popover-content')).not.toBeNull()
    expect(getPopup()?.querySelector('.ant-popover-title')?.textContent).toBe('My Title')
    expect(getPopup()?.querySelector('.ant-popover-inner-content')?.textContent).toBe('My Content')
  })

  it('supports title and content slots', async () => {
    trackMount(mount(Popover, {
      attachTo: document.body,
      props: { open: true },
      slots: {
        default: () => h('span', 'Trigger'),
        title: () => h('strong', 'Slot Title'),
        content: () => h('em', 'Slot Content'),
      },
    }))

    await flushPopup()
    expect(getPopup()?.querySelector('.ant-popover-title')?.innerHTML).toContain('<strong>Slot Title</strong>')
    expect(getPopup()?.querySelector('.ant-popover-inner-content')?.innerHTML).toContain('<em>Slot Content</em>')
  })

  it('does not show title div when no title', async () => {
    trackMount(mount(Popover, {
      attachTo: document.body,
      props: { content: 'Content', open: true },
      slots: { default: () => h('span', 'Trigger') },
    }))

    await flushPopup()
    expect(getPopup()?.querySelector('.ant-popover-title')).toBeNull()
  })

  it('is disabled when no title and no content', () => {
    const wrapper = trackMount(mount(Popover, {
      slots: { default: () => h('span', 'Trigger') },
    }))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('emits openChange on trigger', async () => {
    const wrapper = trackMount(mount(Popover, {
      props: { title: 'test', content: 'test', trigger: 'click' },
      slots: { default: () => h('span', 'Trigger') },
    }))
    await wrapper.find('.ant-trigger-wrapper').trigger('click')
    expect(wrapper.emitted('update:open')).toBeTruthy()
    expect(wrapper.emitted('openChange')).toBeTruthy()
  })

  it('supports overlayClassName', async () => {
    trackMount(mount(Popover, {
      attachTo: document.body,
      props: {
        title: 'test',
        content: 'test',
        open: true,
        overlayClassName: 'my-popover',
      },
      slots: { default: () => h('span', 'Trigger') },
    }))

    await flushPopup()
    expect(getPopup()?.classList.contains('my-popover')).toBe(true)
  })

  it('uses defaultOpen in uncontrolled mode', async () => {
    trackMount(mount(Popover, {
      attachTo: document.body,
      props: {
        title: 'Default Title',
        content: 'Default Content',
        defaultOpen: true,
      },
      slots: { default: () => h('span', 'Trigger') },
    }))

    await flushPopup()
    expect(getPopup()?.textContent).toContain('Default Title')
    expect(getPopup()?.textContent).toContain('Default Content')
  })

  it('treats open=null as uncontrolled and falls back to defaultOpen', async () => {
    trackMount(mount(Popover, {
      attachTo: document.body,
      props: {
        title: 'Fallback Title',
        content: 'Fallback Content',
        open: null,
        defaultOpen: true,
      },
      slots: { default: () => h('span', 'Trigger') },
    }))

    await flushPopup()
    expect(getPopup()?.textContent).toContain('Fallback Title')
    expect(getPopup()?.textContent).toContain('Fallback Content')
  })

  it('treats open=undefined as uncontrolled and falls back to defaultOpen', async () => {
    trackMount(mount(Popover, {
      attachTo: document.body,
      props: {
        title: 'Undefined Title',
        content: 'Undefined Content',
        open: undefined,
        defaultOpen: true,
      },
      slots: { default: () => h('span', 'Trigger') },
    }))

    await flushPopup()
    expect(getPopup()?.textContent).toContain('Undefined Title')
    expect(getPopup()?.textContent).toContain('Undefined Content')
  })

  it('shows the arrow by default', async () => {
    trackMount(mount(Popover, {
      attachTo: document.body,
      props: {
        title: 'test',
        content: 'test',
        open: true,
      },
      slots: { default: () => h('span', 'Trigger') },
    }))

    await flushPopup()
    expect(getPopup()?.querySelector('.ant-trigger-arrow-content')).not.toBeNull()
  })

  it('passes arrow pointAtCenter config objects to Trigger', () => {
    const wrapper = trackMount(mount(Popover, {
      props: {
        title: 'test',
        content: 'test',
        arrow: { pointAtCenter: true } as any,
      },
      slots: { default: () => h('span', 'Trigger') },
    }))

    expect(wrapper.findComponent({ name: 'Trigger' }).props('arrowPointAtCenter')).toBe(true)
  })

  it('keeps deprecated arrow-point-at-center attrs flowing to Trigger', () => {
    const wrapper = trackMount(mount(Popover, {
      attrs: {
        'arrow-point-at-center': '',
      },
      props: {
        title: 'test',
        content: 'test',
      },
      slots: { default: () => h('span', 'Trigger') },
    }))

    expect(wrapper.findComponent({ name: 'Trigger' }).props('arrowPointAtCenter')).toBe(true)
  })
})
