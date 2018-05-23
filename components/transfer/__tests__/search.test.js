import { mount } from '@vue/test-utils'
import Search from '../search'

describe('Search', () => {
  it('should show cross icon when input value exists', () => {
    const props = {
      propsData: {
        value: '',
      },
    }
    const wrapper = mount(Search, props)

    expect(wrapper.html()).toMatchSnapshot()

    wrapper.setProps({ value: 'a' })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
