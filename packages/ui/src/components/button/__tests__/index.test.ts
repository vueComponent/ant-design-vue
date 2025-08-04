import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Button } from '@ant-design-vue/ui'
import { mount } from '@vue/test-utils'

describe('Button', () => {
  it('should render correctly', () => {
    const wrapper = mount(Button)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
