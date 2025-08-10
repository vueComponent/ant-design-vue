import { describe, expect, it, vi } from 'vitest'
import { Affix, Button } from '@ant-design-vue/ui'
import { mount } from '@vue/test-utils'

describe('Affix', () => {
  it('should render correctly', () => {
    const wrapper = mount(Affix)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
