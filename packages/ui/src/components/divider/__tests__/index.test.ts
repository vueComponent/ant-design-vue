import { describe, expect, it, vi } from 'vitest'
import { Divider } from '@ant-design-vue/ui'
import { mount } from '@vue/test-utils'

describe('Divider', () => {
  it('should render correctly', () => {
    const wrapper = mount(Divider, {
      slots: {
        default: `test`
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  });

  it('not show children when vertical', () => {
    const wrapper = mount(Divider, {
      props: {
        orientation: 'right',
        orientationMargin: '10px',
      },
      slots: {
        default: `test`,
      },
    })

    expect(wrapper.find('.ant-divider-inner-text').exists()).toBe(true)
    const innerTextElement = wrapper.find('.ant-divider-inner-text')
    expect(innerTextElement.attributes('style')).toContain('margin-inline-end: 10px')
  })

  it('support bool dashed', () => { 
    const wrapper = mount(Divider, {
      props: {
        dashed: true,
      },
      slots: {
        default: `test`,
      },
    })
    expect(wrapper.find('.ant-divider-dashed').exists()).toBe(true)
  })

  it('support string variant', () => {
    const wrapper = mount(Divider, {
      props: {
        variant: 'dotted',
      },
      slots: {
        default: `test`,
      },
    })
    expect(wrapper.find('.ant-divider-dotted').exists()).toBe(true)
  })

  it('support vertical size', () => {
    const wrapper1= mount(Divider, {
      props: {
        size: 'small',
      },
      slots: {
        default: `test`,
      },
    })
    expect(wrapper1.find('.ant-divider-sm')).toBeTruthy();

    const wrapper2 = mount(Divider, {
      props: {
        size: 'middle',
      },
      slots: {
        default: `test`,
      },
    })
    expect(wrapper2.find('.ant-divider-md')).toBeTruthy()
  })
})
