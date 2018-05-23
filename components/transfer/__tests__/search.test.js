import { mount } from '@vue/test-utils'
import { renderToString } from '@vue/server-test-utils'
import Search from '../search'

describe('Search', () => {
  it('should show cross icon when input value exists', () => {
    const wrapper = mount(Search)

    expect(wrapper).toMatchSnapshot()

    wrapper.setProps({ value: 'a' })

    expect(wrapper).toMatchSnapshot()
  })
})
