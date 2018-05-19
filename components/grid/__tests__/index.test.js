import { mount } from '@vue/test-utils'
import { Col, Row } from '..'

describe('Grid', () => {
  it('should render Col', () => {
    const wrapper = mount(Col, {
      propsData: {
        span: 2,
      },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
  it('should render Row', () => {
    const wrapper = mount(Row)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
