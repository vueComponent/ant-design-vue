import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Steps from '../Steps.vue'
import Step from '../Step.vue'
import type { StepStatus } from '../types'

function createSteps(
  stepsProps: Record<string, any> = {},
  stepItems: { title: string; description?: string; subTitle?: string; status?: StepStatus; disabled?: boolean }[] = [],
) {
  const defaultItems: typeof stepItems = [
    { title: 'Step 1' },
    { title: 'Step 2' },
    { title: 'Step 3' },
  ]
  const items = stepItems.length > 0 ? stepItems : defaultItems

  return mount(Steps, {
    props: stepsProps,
    slots: {
      default: () =>
        items.map((item) =>
          h(Step, {
            title: item.title,
            description: item.description,
            subTitle: item.subTitle,
            status: item.status,
            disabled: item.disabled,
          }),
        ),
    },
  })
}

describe('Steps', () => {
  it('renders with base class', () => {
    const wrapper = createSteps()
    expect(wrapper.classes('ant-steps')).toBe(true)
  })

  it('renders correct number of steps', () => {
    const wrapper = createSteps()
    expect(wrapper.findAll('.ant-steps-item')).toHaveLength(3)
  })

  it('current step has process status', () => {
    const wrapper = createSteps({ current: 1 })
    const items = wrapper.findAll('.ant-steps-item')
    expect(items[1].classes('ant-steps-item-process')).toBe(true)
  })

  it('previous steps have finish status', () => {
    const wrapper = createSteps({ current: 2 })
    const items = wrapper.findAll('.ant-steps-item')
    expect(items[0].classes('ant-steps-item-finish')).toBe(true)
    expect(items[1].classes('ant-steps-item-finish')).toBe(true)
  })

  it('next steps have wait status', () => {
    const wrapper = createSteps({ current: 0 })
    const items = wrapper.findAll('.ant-steps-item')
    expect(items[1].classes('ant-steps-item-wait')).toBe(true)
    expect(items[2].classes('ant-steps-item-wait')).toBe(true)
  })

  it('custom status on individual step overrides automatic status', () => {
    const wrapper = createSteps({ current: 0 }, [
      { title: 'Step 1' },
      { title: 'Step 2', status: 'error' },
      { title: 'Step 3' },
    ])
    const items = wrapper.findAll('.ant-steps-item')
    expect(items[1].classes('ant-steps-item-error')).toBe(true)
  })

  it('applies small size class', () => {
    const wrapper = createSteps({ size: 'small' })
    expect(wrapper.classes('ant-steps-small')).toBe(true)
  })

  it('does not add size class for default', () => {
    const wrapper = createSteps({ size: 'default' })
    expect(wrapper.classes('ant-steps-default')).toBe(false)
  })

  it('applies horizontal direction class', () => {
    const wrapper = createSteps({ direction: 'horizontal' })
    expect(wrapper.classes('ant-steps-horizontal')).toBe(true)
  })

  it('applies vertical direction class', () => {
    const wrapper = createSteps({ direction: 'vertical' })
    expect(wrapper.classes('ant-steps-vertical')).toBe(true)
  })

  it('applies label-vertical class', () => {
    const wrapper = createSteps({ labelPlacement: 'vertical' })
    expect(wrapper.classes('ant-steps-label-vertical')).toBe(true)
  })

  it('applies navigation type class', () => {
    const wrapper = createSteps({ type: 'navigation' })
    expect(wrapper.classes('ant-steps-navigation')).toBe(true)
  })

  it('step click emits change and update:current', async () => {
    const wrapper = createSteps({ current: 0 })
    const items = wrapper.findAll('.ant-steps-item')
    await items[2].trigger('click')
    expect(wrapper.emitted('change')?.[0]).toEqual([2])
    expect(wrapper.emitted('update:current')?.[0]).toEqual([2])
  })

  it('disabled step does not emit events on click', async () => {
    const wrapper = createSteps({ current: 0 }, [
      { title: 'Step 1' },
      { title: 'Step 2', disabled: true },
      { title: 'Step 3' },
    ])
    const items = wrapper.findAll('.ant-steps-item')
    await items[1].trigger('click')
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('disabled step has disabled class', () => {
    const wrapper = createSteps({ current: 0 }, [
      { title: 'Step 1' },
      { title: 'Step 2', disabled: true },
      { title: 'Step 3' },
    ])
    const items = wrapper.findAll('.ant-steps-item')
    expect(items[1].classes('ant-steps-item-disabled')).toBe(true)
  })

  it('has correct ARIA navigation role', () => {
    const wrapper = createSteps()
    expect(wrapper.attributes('role')).toBe('navigation')
    expect(wrapper.attributes('aria-label')).toBe('Steps')
  })

  it('current step has aria-current="step"', () => {
    const wrapper = createSteps({ current: 1 })
    const items = wrapper.findAll('.ant-steps-item')
    expect(items[1].attributes('aria-current')).toBe('step')
    expect(items[0].attributes('aria-current')).toBeUndefined()
  })

  it('error status on current step', () => {
    const wrapper = createSteps({ current: 1, status: 'error' })
    const items = wrapper.findAll('.ant-steps-item')
    expect(items[0].classes('ant-steps-item-finish')).toBe(true)
    expect(items[1].classes('ant-steps-item-error')).toBe(true)
    expect(items[2].classes('ant-steps-item-wait')).toBe(true)
  })

  it('should render snapshot correctly', () => {
    const wrapper = createSteps({ current: 1 }, [
      { title: 'Done', description: 'First step' },
      { title: 'Current', subTitle: '00:00:08', description: 'Second step' },
      { title: 'Next', description: 'Third step' },
    ])
    expect(wrapper.html()).toMatchSnapshot()
  })
})

describe('Step', () => {
  it('renders title', () => {
    const wrapper = createSteps({ current: 0 }, [{ title: 'My Step' }])
    expect(wrapper.find('.ant-steps-item-title').text()).toContain('My Step')
  })

  it('renders description', () => {
    const wrapper = createSteps({ current: 0 }, [{ title: 'Step', description: 'A description' }])
    expect(wrapper.find('.ant-steps-item-description').text()).toBe('A description')
  })

  it('renders subtitle', () => {
    const wrapper = createSteps({ current: 0 }, [{ title: 'Step', subTitle: 'Extra info' }])
    expect(wrapper.find('.ant-steps-item-subtitle').text()).toBe('Extra info')
  })

  it('shows step number for wait/process', () => {
    const wrapper = createSteps({ current: 0 })
    const icons = wrapper.findAll('.ant-steps-icon')
    expect(icons[0].text()).toBe('1')
    expect(icons[1].text()).toBe('2')
  })

  it('shows checkmark icon for finish status', () => {
    const wrapper = createSteps({ current: 2 })
    const icons = wrapper.findAll('.ant-steps-icon')
    expect(icons[0].find('.anticon-check').exists()).toBe(true)
  })

  it('shows close icon for error status', () => {
    const wrapper = createSteps({ current: 1, status: 'error' })
    const icons = wrapper.findAll('.ant-steps-icon')
    expect(icons[1].find('.anticon-close').exists()).toBe(true)
  })

  it('supports icon slot', () => {
    const wrapper = mount(Steps, {
      props: { current: 0 },
      slots: {
        default: () => [
          h(Step, { title: 'Custom' }, {
            icon: () => h('span', { class: 'custom-icon' }, '★'),
          }),
        ],
      },
    })
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
    expect(wrapper.find('.custom-icon').text()).toBe('★')
  })

  it('supports title slot', () => {
    const wrapper = mount(Steps, {
      props: { current: 0 },
      slots: {
        default: () => [
          h(Step, null, {
            title: () => h('strong', 'Bold Title'),
          }),
        ],
      },
    })
    expect(wrapper.find('.ant-steps-item-title strong').exists()).toBe(true)
    expect(wrapper.find('.ant-steps-item-title strong').text()).toBe('Bold Title')
  })

  it('supports description slot', () => {
    const wrapper = mount(Steps, {
      props: { current: 0 },
      slots: {
        default: () => [
          h(Step, { title: 'Step' }, {
            description: () => h('em', 'Italic desc'),
          }),
        ],
      },
    })
    expect(wrapper.find('.ant-steps-item-description em').exists()).toBe(true)
    expect(wrapper.find('.ant-steps-item-description em').text()).toBe('Italic desc')
  })

  it('renders tail connector between steps', () => {
    const wrapper = createSteps()
    const tails = wrapper.findAll('.ant-steps-item-tail')
    expect(tails.length).toBe(3)
  })

  it('clickable step has clickable class', () => {
    const wrapper = createSteps({ current: 0 })
    const items = wrapper.findAll('.ant-steps-item')
    expect(items[0].classes('ant-steps-item-clickable')).toBe(true)
  })
})
