import { mount } from '@vue/test-utils'
import Card from '../index'

const testMethod = typeof window !== 'undefined' ? it : xit

describe('Card', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  function fakeResizeWindowTo (wrapper, width) {
    Object.defineProperties(wrapper.vm.$refs.cardContainerRef, {
      offsetWidth: {
        get () { return width },
        configurable: true,
      },
    })
    window.resizeTo(width)
  }

  testMethod('resize card will trigger different padding', () => {
    const wrapper = mount(Card, {
      propsData: 'xxx',
      slots: {
        default: 'xxx',
      },
    })
    fakeResizeWindowTo(wrapper, 1000)
    jest.runAllTimers()
    wrapper.vm.$forceUpdate()
    expect(wrapper.findAll('.ant-card-wider-padding').length).toBe(1)
    fakeResizeWindowTo(wrapper, 800)
    jest.runAllTimers()
    wrapper.vm.$forceUpdate()
    expect(wrapper.findAll('.ant-card-wider-padding').length).toBe(0)
  })
})
