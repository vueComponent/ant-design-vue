import { describe, expect, it, vi } from 'vitest'
import { Button } from '@ant-design-vue/ui'
import { mount } from '@vue/test-utils'

describe('Button', () => {
  it('should render correctly', () => {
    const wrapper = mount(Button)
    expect(wrapper.html()).toMatchSnapshot()
  })

  describe('Props', () => {
    it('should render different variants', () => {
      const variants = ['solid', 'outlined', 'text', 'link', 'dashed', 'filled'] as const

      variants.forEach(variant => {
        const wrapper = mount(Button, {
          props: { variant },
        })
        expect(wrapper.classes()).toContain(`ant-btn-${variant}`)
      })
    })

    it('should render different sizes', () => {
      const sizes = ['sm', 'md', 'lg'] as const

      sizes.forEach(size => {
        const wrapper = mount(Button, {
          props: { size },
        })
        expect(wrapper.classes()).toContain(`ant-btn-${size}`)
      })
    })

    it('should render loading state', () => {
      const wrapper = mount(Button, {
        props: { loading: true },
      })
      expect(wrapper.classes()).toContain('ant-btn-loading')
      expect(wrapper.findComponent({ name: 'LoadingOutlined' }).exists()).toBe(true)
    })

    it('should render disabled state', () => {
      const wrapper = mount(Button, {
        props: { disabled: true },
      })
      expect(wrapper.classes()).toContain('ant-btn-disabled')
      expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('should render danger state', () => {
      const wrapper = mount(Button, {
        props: { danger: true },
      })
      expect(wrapper.classes()).toContain('ant-btn-danger')
      expect(wrapper.classes()).toContain('ant-btn-custom-color')
    })

    it('should render with custom color', () => {
      const wrapper = mount(Button, {
        props: { color: '#ff0000' },
      })
      expect(wrapper.classes()).toContain('ant-btn-custom-color')
      expect(wrapper.attributes('style')).toBeDefined()
    })

    it('should handle href and target props', () => {
      const wrapper = mount(Button, {
        props: { href: 'https://example.com', target: '_blank' },
      })

      // Mock window.open
      const mockOpen = vi.fn()
      vi.stubGlobal('open', mockOpen)

      wrapper.trigger('click')
      expect(mockOpen).toHaveBeenCalledWith('https://example.com', '_blank')

      vi.unstubAllGlobals()
    })
  })

  describe('Events', () => {
    it('should emit click event', async () => {
      const wrapper = mount(Button)

      await wrapper.trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')?.[0]).toHaveLength(1)
      expect(wrapper.emitted('click')?.[0][0]).toBeInstanceOf(MouseEvent)
    })

    it('should not emit click when disabled', async () => {
      const wrapper = mount(Button, {
        props: { disabled: true },
      })

      await wrapper.trigger('click')

      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('should open link when href is provided', () => {
      const mockOpen = vi.fn()
      vi.stubGlobal('open', mockOpen)

      const wrapper = mount(Button, {
        props: { href: 'https://example.com' },
      })

      wrapper.trigger('click')
      expect(mockOpen).toHaveBeenCalledWith('https://example.com', undefined)

      vi.unstubAllGlobals()
    })
  })

  describe('Slots', () => {
    it('should render default slot content', () => {
      const wrapper = mount(Button, {
        slots: {
          default: 'Click Me',
        },
      })

      expect(wrapper.text()).toContain('Click Me')
    })

    it('should render icon slot', () => {
      const wrapper = mount(Button, {
        slots: {
          icon: '<i class="custom-icon"></i>',
        },
      })

      expect(wrapper.find('.custom-icon').exists()).toBe(true)
    })

    it('should render custom loading slot', () => {
      const wrapper = mount(Button, {
        props: { loading: true },
        slots: {
          loading: '<span class="custom-loading">Loading...</span>',
        },
      })

      expect(wrapper.find('.custom-loading').exists()).toBe(true)
      expect(wrapper.text()).toContain('Loading...')
    })
  })

  describe('Styles and Classes', () => {
    it('should apply base classes', () => {
      const wrapper = mount(Button)

      expect(wrapper.classes()).toContain('ant-btn')
      expect(wrapper.classes()).toContain('ant-btn-solid') // default variant
      expect(wrapper.classes()).toContain('ant-btn-md') // default size
    })

    it('should apply multiple state classes', () => {
      const wrapper = mount(Button, {
        props: {
          loading: true,
          danger: true,
          disabled: true,
        },
      })

      expect(wrapper.classes()).toContain('ant-btn-loading')
      expect(wrapper.classes()).toContain('ant-btn-danger')
      expect(wrapper.classes()).toContain('ant-btn-disabled')
      expect(wrapper.classes()).toContain('ant-btn-custom-color')
    })

    it('should apply custom color CSS variables', () => {
      const wrapper = mount(Button, {
        props: { color: '#1890ff' },
      })

      const style = wrapper.attributes('style')
      expect(style).toBeDefined()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty href', () => {
      const mockOpen = vi.fn()
      vi.stubGlobal('open', mockOpen)

      const wrapper = mount(Button, {
        props: { href: '' },
      })

      wrapper.trigger('click')
      expect(mockOpen).toHaveBeenCalledWith('', undefined)

      vi.unstubAllGlobals()
    })

    it('should handle loading and disabled states together', () => {
      const wrapper = mount(Button, {
        props: {
          loading: true,
          disabled: true,
        },
      })

      expect(wrapper.classes()).toContain('ant-btn-loading')
      expect(wrapper.classes()).toContain('ant-btn-disabled')
      expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('should render with all props combined', () => {
      const wrapper = mount(Button, {
        props: {
          variant: 'outlined',
          size: 'lg',
          loading: true,
          danger: true,
          color: '#ff4d4f',
          href: 'https://example.com',
          target: '_blank',
        },
        slots: {
          default: 'Complex Button',
          icon: '<i class="icon"></i>',
        },
      })

      expect(wrapper.classes()).toContain('ant-btn')
      expect(wrapper.classes()).toContain('ant-btn-outlined')
      expect(wrapper.classes()).toContain('ant-btn-lg')
      expect(wrapper.classes()).toContain('ant-btn-loading')
      expect(wrapper.classes()).toContain('ant-btn-danger')
      expect(wrapper.classes()).toContain('ant-btn-custom-color')
      expect(wrapper.text()).toContain('Complex Button')
      expect(wrapper.find('.icon').exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('should have correct button element', () => {
      const wrapper = mount(Button)
      expect(wrapper.element.tagName).toBe('BUTTON')
    })

    it('should handle disabled attribute correctly', () => {
      const enabledWrapper = mount(Button, {
        props: { disabled: false },
      })
      expect(enabledWrapper.attributes('disabled')).toBeUndefined()

      const disabledWrapper = mount(Button, {
        props: { disabled: true },
      })
      expect(disabledWrapper.attributes('disabled')).toBeDefined()
    })
  })
})
