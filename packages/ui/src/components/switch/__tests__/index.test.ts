import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Switch from '../Switch.vue'

describe('Switch', () => {
  describe('rendering', () => {
    it('renders a button element', () => {
      const wrapper = mount(Switch)
      expect(wrapper.element.tagName).toBe('BUTTON')
    })

    it('has ant-switch class', () => {
      const wrapper = mount(Switch)
      expect(wrapper.classes()).toContain('ant-switch')
    })

    it('renders handle element', () => {
      const wrapper = mount(Switch)
      expect(wrapper.find('.ant-switch-handle').exists()).toBe(true)
    })

    it('renders inner element', () => {
      const wrapper = mount(Switch)
      expect(wrapper.find('.ant-switch-inner').exists()).toBe(true)
    })

    it('has type="button"', () => {
      const wrapper = mount(Switch)
      expect(wrapper.attributes('type')).toBe('button')
    })

    it('renders wave effect hook when interactive', () => {
      const wrapper = mount(Switch, { global: { stubs: { Wave: true } } })
      expect(wrapper.find('wave-stub').exists()).toBe(true)
      expect(wrapper.find('wave-stub').attributes('disabled')).toBe('false')
    })
  })

  describe('checked prop', () => {
    it('applies checked class when checked', () => {
      const wrapper = mount(Switch, { props: { checked: true } })
      expect(wrapper.classes()).toContain('ant-switch-checked')
    })

    it('does not apply checked class when unchecked', () => {
      const wrapper = mount(Switch, { props: { checked: false } })
      expect(wrapper.classes()).not.toContain('ant-switch-checked')
    })

    it('does not change visual state in controlled mode until checked prop updates', async () => {
      const wrapper = mount(Switch, { props: { checked: false } })

      await wrapper.trigger('click')

      expect(wrapper.emitted('update:checked')![0]).toEqual([true])
      expect(wrapper.classes()).not.toContain('ant-switch-checked')
      expect(wrapper.attributes('aria-checked')).toBe('false')
    })
  })

  describe('custom values', () => {
    it('supports custom checkedValue and unCheckedValue', async () => {
      const wrapper = mount(Switch, {
        props: {
          checked: 'yes',
          checkedValue: 'yes',
          unCheckedValue: 'no',
        },
      })
      expect(wrapper.classes()).toContain('ant-switch-checked')
    })

    it('emits custom unCheckedValue when toggling off', async () => {
      const wrapper = mount(Switch, {
        props: {
          checked: 'yes',
          checkedValue: 'yes',
          unCheckedValue: 'no',
        },
      })
      await wrapper.trigger('click')
      expect(wrapper.emitted('update:checked')![0]).toEqual(['no'])
    })

    it('emits custom checkedValue when toggling on', async () => {
      const wrapper = mount(Switch, {
        props: {
          checked: 'no',
          checkedValue: 'yes',
          unCheckedValue: 'no',
        },
      })
      await wrapper.trigger('click')
      expect(wrapper.emitted('update:checked')![0]).toEqual(['yes'])
    })
  })

  describe('disabled prop', () => {
    it('applies disabled class', () => {
      const wrapper = mount(Switch, { props: { disabled: true } })
      expect(wrapper.classes()).toContain('ant-switch-disabled')
    })

    it('sets disabled attribute on button', () => {
      const wrapper = mount(Switch, { props: { disabled: true } })
      expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('does not emit events when disabled', async () => {
      const wrapper = mount(Switch, { props: { disabled: true } })
      await wrapper.trigger('click')
      expect(wrapper.emitted('update:checked')).toBeUndefined()
      expect(wrapper.emitted('change')).toBeUndefined()
      expect(wrapper.emitted('click')).toBeUndefined()
    })
  })

  describe('loading prop', () => {
    it('applies loading class', () => {
      const wrapper = mount(Switch, { props: { loading: true } })
      expect(wrapper.classes()).toContain('ant-switch-loading')
    })

    it('renders loading icon', () => {
      const wrapper = mount(Switch, { props: { loading: true } })
      expect(wrapper.find('.ant-switch-loading-icon').exists()).toBe(true)
    })

    it('does not render loading icon when not loading', () => {
      const wrapper = mount(Switch, { props: { loading: false } })
      expect(wrapper.find('.ant-switch-loading-icon').exists()).toBe(false)
    })

    it('does not emit events when loading', async () => {
      const wrapper = mount(Switch, { props: { loading: true } })
      await wrapper.trigger('click')
      expect(wrapper.emitted('update:checked')).toBeUndefined()
    })
  })

  describe('size prop', () => {
    it('applies small class for size="small"', () => {
      const wrapper = mount(Switch, { props: { size: 'small' } })
      expect(wrapper.classes()).toContain('ant-switch-small')
    })

    it('does not apply small class for size="default"', () => {
      const wrapper = mount(Switch, { props: { size: 'default' } })
      expect(wrapper.classes()).not.toContain('ant-switch-small')
    })

    it('defaults to no small class', () => {
      const wrapper = mount(Switch)
      expect(wrapper.classes()).not.toContain('ant-switch-small')
    })
  })

  describe('events', () => {
    it('emits update:checked on click', async () => {
      const wrapper = mount(Switch, { props: { checked: false } })
      await wrapper.trigger('click')
      expect(wrapper.emitted('update:checked')).toBeTruthy()
      expect(wrapper.emitted('update:checked')![0]).toEqual([true])
    })

    it('emits change on click', async () => {
      const wrapper = mount(Switch, { props: { checked: false } })
      await wrapper.trigger('click')
      expect(wrapper.emitted('change')).toBeTruthy()
      expect(wrapper.emitted('change')![0][0]).toBe(true)
    })

    it('emits click event', async () => {
      const wrapper = mount(Switch, { props: { checked: false } })
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')![0][0]).toBe(true)
    })

    it('toggles from checked to unchecked', async () => {
      const wrapper = mount(Switch, { props: { checked: true } })
      await wrapper.trigger('click')
      expect(wrapper.emitted('update:checked')![0]).toEqual([false])
    })
  })

  describe('slots', () => {
    it('renders checkedChildren slot when checked', () => {
      const wrapper = mount(Switch, {
        props: { checked: true },
        slots: { checkedChildren: 'ON' },
      })
      expect(wrapper.find('.ant-switch-inner-checked').text()).toBe('ON')
    })

    it('renders unCheckedChildren slot when unchecked', () => {
      const wrapper = mount(Switch, {
        props: { checked: false },
        slots: { unCheckedChildren: 'OFF' },
      })
      expect(wrapper.find('.ant-switch-inner-unchecked').text()).toBe('OFF')
    })
  })

  describe('accessibility', () => {
    it('has role="switch"', () => {
      const wrapper = mount(Switch)
      expect(wrapper.attributes('role')).toBe('switch')
    })

    it('has aria-checked reflecting checked state', () => {
      const wrapperOn = mount(Switch, { props: { checked: true } })
      expect(wrapperOn.attributes('aria-checked')).toBe('true')

      const wrapperOff = mount(Switch, { props: { checked: false } })
      expect(wrapperOff.attributes('aria-checked')).toBe('false')
    })
  })

  describe('id prop', () => {
    it('passes id to button element', () => {
      const wrapper = mount(Switch, { props: { id: 'sw1' } })
      expect(wrapper.attributes('id')).toBe('sw1')
    })
  })

  describe('exposed methods', () => {
    it('exposes focus method', () => {
      const wrapper = mount(Switch)
      expect(typeof wrapper.vm.focus).toBe('function')
    })

    it('exposes blur method', () => {
      const wrapper = mount(Switch)
      expect(typeof wrapper.vm.blur).toBe('function')
    })
  })

  describe('component name', () => {
    it('has correct name', () => {
      expect(Switch.name).toBe('ASwitch')
    })
  })

  describe('uncontrolled mode', () => {
    it('toggles state without checked prop', async () => {
      const wrapper = mount(Switch)
      expect(wrapper.classes()).not.toContain('ant-switch-checked')
      await wrapper.trigger('click')
      expect(wrapper.classes()).toContain('ant-switch-checked')
    })

    it('emits update:checked in uncontrolled mode', async () => {
      const wrapper = mount(Switch)
      await wrapper.trigger('click')
      expect(wrapper.emitted('update:checked')).toBeTruthy()
      expect(wrapper.emitted('update:checked')![0]).toEqual([true])
    })

    it('toggles back to unchecked in uncontrolled mode', async () => {
      const wrapper = mount(Switch)
      await wrapper.trigger('click')
      await wrapper.trigger('click')
      expect(wrapper.classes()).not.toContain('ant-switch-checked')
    })
  })

  describe('keyboard navigation', () => {
    it('checks with ArrowRight when unchecked', async () => {
      const wrapper = mount(Switch, { props: { checked: false } })
      await wrapper.trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('update:checked')).toBeTruthy()
      expect(wrapper.emitted('update:checked')![0]).toEqual([true])
    })

    it('unchecks with ArrowLeft when checked', async () => {
      const wrapper = mount(Switch, { props: { checked: true } })
      await wrapper.trigger('keydown', { key: 'ArrowLeft' })
      expect(wrapper.emitted('update:checked')).toBeTruthy()
      expect(wrapper.emitted('update:checked')![0]).toEqual([false])
    })

    it('does not toggle on ArrowRight when already checked', async () => {
      const wrapper = mount(Switch, { props: { checked: true } })
      await wrapper.trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('update:checked')).toBeUndefined()
    })

    it('does not toggle on ArrowLeft when already unchecked', async () => {
      const wrapper = mount(Switch, { props: { checked: false } })
      await wrapper.trigger('keydown', { key: 'ArrowLeft' })
      expect(wrapper.emitted('update:checked')).toBeUndefined()
    })

    it('does not respond to arrow keys when disabled', async () => {
      const wrapper = mount(Switch, { props: { checked: false, disabled: true } })
      await wrapper.trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('update:checked')).toBeUndefined()
    })

    it('does not respond to arrow keys when loading', async () => {
      const wrapper = mount(Switch, { props: { checked: false, loading: true } })
      await wrapper.trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('update:checked')).toBeUndefined()
    })
  })

  describe('tabindex prop', () => {
    it('passes numeric tabindex to button element', () => {
      const wrapper = mount(Switch, { props: { tabindex: 3 } })
      expect(wrapper.attributes('tabindex')).toBe('3')
    })

    it('passes string tabindex to button element', () => {
      const wrapper = mount(Switch, { props: { tabindex: '2' } })
      expect(wrapper.attributes('tabindex')).toBe('2')
    })

    it('passes tabindex=-1 to exclude from tab order', () => {
      const wrapper = mount(Switch, { props: { tabindex: -1 } })
      expect(wrapper.attributes('tabindex')).toBe('-1')
    })
  })

  describe('focus/blur/mouseup events', () => {
    it('emits focus event', async () => {
      const wrapper = mount(Switch)
      await wrapper.trigger('focus')
      expect(wrapper.emitted('focus')).toBeTruthy()
    })

    it('emits blur event', async () => {
      const wrapper = mount(Switch)
      await wrapper.trigger('blur')
      expect(wrapper.emitted('blur')).toBeTruthy()
    })

    it('emits mouseup event', async () => {
      const wrapper = mount(Switch)
      await wrapper.trigger('mouseup')
      expect(wrapper.emitted('mouseup')).toBeTruthy()
    })
  })

  describe('keydown event', () => {
    it('emits keydown event on ArrowRight', async () => {
      const wrapper = mount(Switch, { props: { checked: false } })
      await wrapper.trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('keydown')).toBeTruthy()
    })

    it('emits keydown event on other keys', async () => {
      const wrapper = mount(Switch)
      await wrapper.trigger('keydown', { key: 'Tab' })
      expect(wrapper.emitted('keydown')).toBeTruthy()
    })

    it('does not emit keydown when disabled', async () => {
      const wrapper = mount(Switch, { props: { disabled: true } })
      await wrapper.trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('keydown')).toBeUndefined()
    })
  })

  describe('aria-disabled', () => {
    it('has aria-disabled when disabled', () => {
      const wrapper = mount(Switch, { props: { disabled: true } })
      expect(wrapper.attributes('aria-disabled')).toBe('true')
    })

    it('has aria-disabled when loading', () => {
      const wrapper = mount(Switch, { props: { loading: true } })
      expect(wrapper.attributes('aria-disabled')).toBe('true')
    })

    it('does not have aria-disabled when enabled', () => {
      const wrapper = mount(Switch)
      expect(wrapper.attributes('aria-disabled')).toBeUndefined()
    })
  })
})
