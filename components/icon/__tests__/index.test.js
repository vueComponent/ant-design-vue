import { mount } from '@vue/test-utils'
import Icon from '..'

describe('Icon', () => {
  it('should render to a <i class="xxx"></i>', () => {
    const wrapper = mount({
      render (h) {
        return <Icon type='appstore' class='my-icon-classname' />
      },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
