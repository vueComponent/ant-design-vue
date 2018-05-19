import { mount } from '@vue/test-utils'
import BackTop from '..'

describe('BackTop', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should scroll to top after click it', () => {
    const wrapper = mount(BackTop, {
      propsData: {
        visibilityHeight: -1,
      },
    })
    document.documentElement.scrollTop = 400
    // trigger scroll manually
    wrapper.vm.handleScroll()
    jest.runAllTimers()
    wrapper.find('.ant-back-top').trigger('click')
    jest.runAllTimers()
    expect(Math.abs(Math.round(document.documentElement.scrollTop))).toBe(0)
  })
})
