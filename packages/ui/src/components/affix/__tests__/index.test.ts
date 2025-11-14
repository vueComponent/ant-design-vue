import { describe, expect, it } from 'vitest'
import { Affix } from '@ant-design-vue/ui'
import { mount } from '@vue/test-utils'

describe('Affix', () => {
  it('should render correctly', () => {
    const wrapper = mount(Affix)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
