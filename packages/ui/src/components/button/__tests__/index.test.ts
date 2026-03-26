import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import Button from '../Button.vue'
import ButtonGroup from '../ButtonGroup.vue'
import ConfigProvider from '../../config-provider/ConfigProvider.vue'

describe('Button', () => {
  describe('rendering', () => {
    it('renders as <button> by default', () => {
      const wrapper = mount(Button, { slots: { default: 'Click' } })
      expect(wrapper.element.tagName).toBe('BUTTON')
      expect(wrapper.text()).toBe('Click')
    })

    it('renders as <a> when href is provided', () => {
      const wrapper = mount(Button, {
        props: { href: 'https://example.com' },
        slots: { default: 'Link' },
      })
      expect(wrapper.element.tagName).toBe('A')
      expect(wrapper.attributes('href')).toBe('https://example.com')
    })

    it('renders as <a> with target attribute', () => {
      const wrapper = mount(Button, {
        props: { href: 'https://example.com', target: '_blank' },
      })
      expect(wrapper.attributes('target')).toBe('_blank')
    })

    it('does not set target when no href', () => {
      const wrapper = mount(Button, {
        props: { target: '_blank' },
      })
      expect(wrapper.attributes('target')).toBeUndefined()
    })

    it('has default class ant-btn', () => {
      const wrapper = mount(Button)
      expect(wrapper.classes()).toContain('ant-btn')
    })

    it('wraps slot content in ant-btn-content span', () => {
      const wrapper = mount(Button, { slots: { default: 'Text' } })
      expect(wrapper.find('.ant-btn-content').text()).toBe('Text')
    })

    it('does not render content span when no default slot', () => {
      const wrapper = mount(Button)
      expect(wrapper.find('.ant-btn-content').exists()).toBe(false)
    })
  })

  describe('variant prop', () => {
    it.each([
      'solid', 'outlined', 'text', 'link', 'dashed', 'filled',
    ] as const)('applies ant-btn-%s class for variant=%s', (variant) => {
      const wrapper = mount(Button, { props: { variant } })
      expect(wrapper.classes()).toContain(`ant-btn-${variant}`)
    })

    it('defaults to outlined when no variant or type is set', () => {
      const wrapper = mount(Button)
      expect(wrapper.classes()).toContain('ant-btn-outlined')
    })
  })

  describe('type prop (legacy compat)', () => {
    it.each([
      ['primary', 'solid'],
      ['default', 'outlined'],
      ['dashed', 'dashed'],
      ['text', 'text'],
      ['link', 'link'],
    ] as const)('type=%s maps to ant-btn-%s', (type, expected) => {
      const wrapper = mount(Button, { props: { type } })
      expect(wrapper.classes()).toContain(`ant-btn-${expected}`)
    })

    it('variant takes precedence over type', () => {
      const wrapper = mount(Button, { props: { type: 'primary', variant: 'outlined' } })
      expect(wrapper.classes()).toContain('ant-btn-outlined')
      expect(wrapper.classes()).not.toContain('ant-btn-solid')
    })
  })

  describe('size prop', () => {
    it.each(['sm', 'md', 'lg'] as const)('applies ant-btn-%s for size=%s', (size) => {
      const wrapper = mount(Button, { props: { size } })
      expect(wrapper.classes()).toContain(`ant-btn-${size}`)
    })

    it('defaults to md', () => {
      const wrapper = mount(Button)
      expect(wrapper.classes()).toContain('ant-btn-md')
    })

    it.each([
      ['small', 'sm'],
      ['middle', 'md'],
      ['large', 'lg'],
    ] as const)('legacy size=%s maps to ant-btn-%s', (legacy, expected) => {
      const wrapper = mount(Button, { props: { size: legacy } })
      expect(wrapper.classes()).toContain(`ant-btn-${expected}`)
    })
  })

  describe('shape prop', () => {
    it('does not add shape class for default shape', () => {
      const wrapper = mount(Button)
      expect(wrapper.classes().some(c => c.startsWith('ant-btn-shape-'))).toBe(false)
    })

    it.each(['circle', 'round'] as const)('applies shape class for shape=%s', (shape) => {
      const wrapper = mount(Button, { props: { shape } })
      expect(wrapper.classes()).toContain(`ant-btn-shape-${shape}`)
    })
  })

  describe('loading prop', () => {
    it('shows loading icon when loading=true', () => {
      const wrapper = mount(Button, { props: { loading: true } })
      expect(wrapper.find('.ant-btn-loading-icon').exists()).toBe(true)
      expect(wrapper.classes()).toContain('ant-btn-loading')
    })

    it('hides loading icon when loading=false', () => {
      const wrapper = mount(Button, { props: { loading: false } })
      expect(wrapper.find('.ant-btn-loading-icon').exists()).toBe(false)
    })

    it('supports loading with delay', async () => {
      vi.useFakeTimers()
      const wrapper = mount(Button, { props: { loading: { delay: 100 } } })

      expect(wrapper.find('.ant-btn-loading-icon').exists()).toBe(false)

      vi.advanceTimersByTime(100)
      await nextTick()
      expect(wrapper.find('.ant-btn-loading-icon').exists()).toBe(true)

      vi.useRealTimers()
    })

    it('cancels delayed loading when prop changes', async () => {
      vi.useFakeTimers()
      const wrapper = mount(Button, { props: { loading: { delay: 200 } } })

      vi.advanceTimersByTime(100)
      await wrapper.setProps({ loading: false })
      vi.advanceTimersByTime(200)
      await nextTick()

      expect(wrapper.find('.ant-btn-loading-icon').exists()).toBe(false)
      vi.useRealTimers()
    })

    it('prevents click when loading', async () => {
      const onClick = vi.fn()
      const wrapper = mount(Button, {
        props: { loading: true },
        attrs: { onClick },
      })
      await wrapper.trigger('click')
      expect(onClick).not.toHaveBeenCalled()
    })

    it('shows default loading icon (no custom loading slot)', () => {
      const wrapper = mount(Button, {
        props: { loading: true },
      })
      expect(wrapper.find('.ant-btn-loading-icon').exists()).toBe(true)
    })
  })

  describe('disabled prop', () => {
    it('sets disabled attribute on button', () => {
      const wrapper = mount(Button, { props: { disabled: true } })
      expect(wrapper.attributes('disabled')).toBeDefined()
      expect(wrapper.classes()).toContain('ant-btn-disabled')
    })

    it('prevents click when disabled', async () => {
      const wrapper = mount(Button, { props: { disabled: true } })
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeUndefined()
    })

    it('does not set disabled when false', () => {
      const wrapper = mount(Button, { props: { disabled: false } })
      expect(wrapper.attributes('disabled')).toBeUndefined()
    })
  })

  describe('danger prop', () => {
    it('applies danger class', () => {
      const wrapper = mount(Button, { props: { danger: true } })
      expect(wrapper.classes()).toContain('ant-btn-danger')
      expect(wrapper.classes()).toContain('ant-btn-custom-color')
    })
  })

  describe('ghost prop', () => {
    it('applies ghost class', () => {
      const wrapper = mount(Button, { props: { ghost: true } })
      expect(wrapper.classes()).toContain('ant-btn-ghost')
    })
  })

  describe('block prop', () => {
    it('applies block class', () => {
      const wrapper = mount(Button, { props: { block: true } })
      expect(wrapper.classes()).toContain('ant-btn-block')
    })

    it('does not apply block class by default', () => {
      const wrapper = mount(Button)
      expect(wrapper.classes()).not.toContain('ant-btn-block')
    })
  })

  describe('htmlType prop', () => {
    it('defaults to button', () => {
      const wrapper = mount(Button)
      expect(wrapper.attributes('type')).toBe('button')
    })

    it.each(['submit', 'reset', 'button'] as const)('sets type=%s', (htmlType) => {
      const wrapper = mount(Button, { props: { htmlType } })
      expect(wrapper.attributes('type')).toBe(htmlType)
    })

    it('does not set type on <a> tag', () => {
      const wrapper = mount(Button, { props: { href: '/foo', htmlType: 'submit' } })
      expect(wrapper.attributes('type')).toBeUndefined()
    })
  })

  describe('color prop', () => {
    it('applies custom-color class when color is set', () => {
      const wrapper = mount(Button, { props: { color: '#ff0000' } })
      expect(wrapper.classes()).toContain('ant-btn-custom-color')
    })

    it('generates CSS variables for non-default color', () => {
      const wrapper = mount(Button, { props: { color: '#ff0000' } })
      const style = wrapper.attributes('style') ?? ''
      expect(style).toContain('--color-accent')
    })

    it('does not generate CSS variables for default primary color', () => {
      const wrapper = mount(Button, { props: { color: '#1677FF' } })
      const style = wrapper.attributes('style')
      expect(style).toBeUndefined()
    })
  })

  describe('events', () => {
    it('emits click event', async () => {
      const wrapper = mount(Button)
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toHaveLength(1)
      expect(wrapper.emitted('click')![0][0]).toBeInstanceOf(MouseEvent)
    })

    it('does not emit click when disabled', async () => {
      const wrapper = mount(Button, { props: { disabled: true } })
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeUndefined()
    })

    it('does not emit click when loading', async () => {
      const wrapper = mount(Button, { props: { loading: true } })
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeUndefined()
    })
  })

  describe('slots', () => {
    it('renders icon slot', () => {
      const wrapper = mount(Button, {
        slots: { icon: '<span class="my-icon" />' },
      })
      expect(wrapper.find('.my-icon').exists()).toBe(true)
    })

    it('renders both icon and default slot', () => {
      const wrapper = mount(Button, {
        slots: {
          icon: '<span class="my-icon" />',
          default: 'Text',
        },
      })
      expect(wrapper.find('.my-icon').exists()).toBe(true)
      expect(wrapper.find('.ant-btn-content').text()).toBe('Text')
    })
  })

  describe('exposed methods', () => {
    it('exposes focus method', () => {
      const wrapper = mount(Button)
      expect(typeof wrapper.vm.focus).toBe('function')
    })

    it('exposes blur method', () => {
      const wrapper = mount(Button)
      expect(typeof wrapper.vm.blur).toBe('function')
    })
  })

  describe('ConfigProvider integration', () => {
    it('inherits size from ConfigProvider', () => {
      const wrapper = mount(ConfigProvider, {
        props: { size: 'lg' },
        slots: { default: () => h(Button, null, { default: () => 'Btn' }) },
      })
      const btn = wrapper.findComponent(Button)
      expect(btn.classes()).toContain('ant-btn-lg')
    })

    it('local size overrides ConfigProvider size', () => {
      const wrapper = mount(ConfigProvider, {
        props: { size: 'lg' },
        slots: { default: () => h(Button, { size: 'sm' }, { default: () => 'Btn' }) },
      })
      const btn = wrapper.findComponent(Button)
      expect(btn.classes()).toContain('ant-btn-sm')
    })

    it('inherits disabled from ConfigProvider', () => {
      const wrapper = mount(ConfigProvider, {
        props: { disabled: true },
        slots: { default: () => h(Button, null, { default: () => 'Btn' }) },
      })
      const btn = wrapper.findComponent(Button)
      expect(btn.classes()).toContain('ant-btn-disabled')
      expect(btn.attributes('disabled')).toBeDefined()
    })
  })

  describe('href + disabled', () => {
    it('does not render href when disabled', () => {
      const wrapper = mount(Button, {
        props: { href: 'https://example.com', disabled: true },
      })
      expect(wrapper.element.tagName).toBe('A')
      expect(wrapper.attributes('href')).toBeUndefined()
      expect(wrapper.attributes('aria-disabled')).toBe('true')
    })

    it('does not render target when disabled', () => {
      const wrapper = mount(Button, {
        props: { href: 'https://example.com', target: '_blank', disabled: true },
      })
      expect(wrapper.attributes('target')).toBeUndefined()
    })

    it('sets tabindex=-1 when href is disabled', () => {
      const wrapper = mount(Button, {
        props: { href: 'https://example.com', disabled: true },
      })
      expect(wrapper.attributes('tabindex')).toBe('-1')
    })

    it('sets role=link when href is disabled', () => {
      const wrapper = mount(Button, {
        props: { href: 'https://example.com', disabled: true },
      })
      expect(wrapper.attributes('role')).toBe('link')
    })

    it('prevents click when href is disabled', async () => {
      const wrapper = mount(Button, {
        props: { href: 'https://example.com', disabled: true },
      })
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeUndefined()
    })
  })

  describe('loading state edge case', () => {
    it('does not show loading icon when loading=false', () => {
      const wrapper = mount(Button, {
        props: { loading: false },
      })
      expect(wrapper.find('.ant-btn-loading-icon').exists()).toBe(false)
    })
  })

  describe('type prop deprecation warning', () => {
    it('warns when using deprecated type prop', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      mount(Button, { props: { type: 'primary' } })
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[antdv] Button'),
      )
      warnSpy.mockRestore()
    })

    it('warns for unknown type value', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      mount(Button, { props: { type: 'ghost' as any } })
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('unknown type "ghost"'),
      )
      warnSpy.mockRestore()
    })
  })

  describe('icon-only', () => {
    it('applies icon-only class when only icon slot is provided', () => {
      const wrapper = mount(Button, {
        slots: { icon: '<span class="my-icon" />' },
      })
      expect(wrapper.classes()).toContain('ant-btn-icon-only')
    })

    it('does not apply icon-only class when default slot is provided', () => {
      const wrapper = mount(Button, {
        slots: {
          icon: '<span class="my-icon" />',
          default: 'Text',
        },
      })
      expect(wrapper.classes()).not.toContain('ant-btn-icon-only')
    })
  })

  describe('ghost + text/link warning', () => {
    it('warns when ghost is used with text variant', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      mount(Button, { props: { variant: 'text', ghost: true } })
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('`text` variant cannot be used with `ghost`'),
      )
      warnSpy.mockRestore()
    })

    it('warns when ghost is used with link variant', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      mount(Button, { props: { variant: 'link', ghost: true } })
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('`link` variant cannot be used with `ghost`'),
      )
      warnSpy.mockRestore()
    })
  })

  describe('component name', () => {
    it('has correct name', () => {
      expect(Button.name).toBe('AButton')
    })
  })
})

describe('ButtonGroup', () => {
  it('renders with ant-btn-group class', () => {
    const wrapper = mount(ButtonGroup, {
      slots: { default: () => [h(Button, null, { default: () => 'A' }), h(Button, null, { default: () => 'B' })] },
    })
    expect(wrapper.classes()).toContain('ant-btn-group')
  })

  it('renders children buttons', () => {
    const wrapper = mount(ButtonGroup, {
      slots: { default: () => [h(Button, null, { default: () => 'A' }), h(Button, null, { default: () => 'B' })] },
    })
    expect(wrapper.findAllComponents(Button)).toHaveLength(2)
  })

  it.each(['sm', 'md', 'lg'] as const)('applies size class for size=%s', (size) => {
    const wrapper = mount(ButtonGroup, { props: { size } })
    expect(wrapper.classes()).toContain(`ant-btn-group-${size}`)
  })

  it.each([
    ['small', 'sm'],
    ['middle', 'md'],
    ['large', 'lg'],
  ] as const)('legacy size=%s maps to ant-btn-group-%s', (legacy, expected) => {
    const wrapper = mount(ButtonGroup, { props: { size: legacy } })
    expect(wrapper.classes()).toContain(`ant-btn-group-${expected}`)
  })

  it('has correct component name', () => {
    expect(ButtonGroup.name).toBe('AButtonGroup')
  })

  it('passes size to child buttons via provide/inject', () => {
    const wrapper = mount(ButtonGroup, {
      props: { size: 'lg' },
      slots: { default: () => [h(Button, null, { default: () => 'A' })] },
    })
    const btn = wrapper.findComponent(Button)
    expect(btn.classes()).toContain('ant-btn-lg')
  })

  it('child button local size overrides group size', () => {
    const wrapper = mount(ButtonGroup, {
      props: { size: 'lg' },
      slots: { default: () => [h(Button, { size: 'sm' }, { default: () => 'A' })] },
    })
    const btn = wrapper.findComponent(Button)
    expect(btn.classes()).toContain('ant-btn-sm')
  })
})
