import { mount } from '@vue/test-utils'
import { asyncExpect } from '@/tests/utils'
import Tag from '..'

describe('Tag', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should be closable', () => {
    const onClose = jest.fn()
    const wrapper = mount({
      render () {
        return <Tag closable onClose={onClose} />
      },
    })
    expect(wrapper.findAll('.anticon-cross').length).toBe(1)
    expect(wrapper.findAll('.ant-tag').length).toBe(1)
    wrapper.find('.anticon-cross').trigger('click')
    expect(onClose).toBeCalled()
    jest.runAllTimers()
    expect(wrapper.findAll('.ant-tag').length).toBe(0)
  })

  it('should not be closed when prevent default', () => {
    const onClose = (e) => {
      e.preventDefault()
    }
    const wrapper = mount({
      render () {
        return <Tag closable onClose={onClose} />
      },
    })
    expect(wrapper.findAll('.anticon-cross').length).toBe(1)
    expect(wrapper.findAll('.ant-tag').length).toBe(1)
    wrapper.find('.anticon-cross').trigger('click')
    jest.runAllTimers()
    expect(wrapper.findAll('.ant-tag').length).toBe(1)
  })
})
