import { mount } from '@vue/test-utils'
import Avatar from '..'

describe('Avatar Render', () => {
  it('Render long string correctly', () => {
    const wrapper = mount(Avatar, {
      slots: {
        default: 'TestString',
      },
    })
    const children = wrapper.findAll('.ant-avatar-string')
    expect(children.length).toBe(1)
  })
})
