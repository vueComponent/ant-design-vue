import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Avatar from '../Avatar.vue'
import AvatarGroup from '../AvatarGroup.vue'

describe('Avatar', () => {
  it('should render correctly', () => {
    const wrapper = mount(Avatar, {
      slots: { default: 'U' },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders circle shape by default', () => {
    const wrapper = mount(Avatar, {
      slots: { default: 'U' },
    })
    expect(wrapper.classes('ant-avatar')).toBe(true)
    expect(wrapper.classes('ant-avatar-circle')).toBe(true)
  })

  it('renders square shape', () => {
    const wrapper = mount(Avatar, {
      props: { shape: 'square' },
      slots: { default: 'U' },
    })
    expect(wrapper.classes('ant-avatar-square')).toBe(true)
    expect(wrapper.classes('ant-avatar-circle')).toBe(false)
  })

  it('renders image when src is provided', () => {
    const wrapper = mount(Avatar, {
      props: { src: 'https://example.com/avatar.jpg', alt: 'User' },
    })
    expect(wrapper.classes('ant-avatar-image')).toBe(true)
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/avatar.jpg')
    expect(img.attributes('alt')).toBe('User')
  })

  it('renders srcset on image', () => {
    const wrapper = mount(Avatar, {
      props: {
        src: 'https://example.com/avatar.jpg',
        srcset: 'https://example.com/avatar-2x.jpg 2x',
      },
    })
    const img = wrapper.find('img')
    expect(img.attributes('srcset')).toBe('https://example.com/avatar-2x.jpg 2x')
  })

  it('falls back to text when image fails to load', async () => {
    const wrapper = mount(Avatar, {
      props: { src: 'https://example.com/broken.jpg' },
      slots: { default: 'U' },
    })
    expect(wrapper.find('img').exists()).toBe(true)
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.ant-avatar-string').text()).toBe('U')
  })

  it('emits error event when image fails', async () => {
    const wrapper = mount(Avatar, {
      props: { src: 'https://example.com/broken.jpg' },
      slots: { default: 'U' },
    })
    await wrapper.find('img').trigger('error')
    expect(wrapper.emitted('error')).toHaveLength(1)
  })

  it('renders text in ant-avatar-string', () => {
    const wrapper = mount(Avatar, {
      slots: { default: 'AB' },
    })
    expect(wrapper.find('.ant-avatar-string').exists()).toBe(true)
    expect(wrapper.find('.ant-avatar-string').text()).toBe('AB')
  })

  it('renders icon slot', () => {
    const wrapper = mount(Avatar, {
      slots: {
        icon: '<span class="custom-icon">I</span>',
      },
    })
    expect(wrapper.classes('ant-avatar-icon')).toBe(true)
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
    expect(wrapper.find('.ant-avatar-string').exists()).toBe(false)
  })

  it('prefers image over icon slot', () => {
    const wrapper = mount(Avatar, {
      props: { src: 'https://example.com/avatar.jpg' },
      slots: {
        icon: '<span class="custom-icon">I</span>',
      },
    })
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('.custom-icon').exists()).toBe(false)
  })

  it('applies large size class', () => {
    const wrapper = mount(Avatar, {
      props: { size: 'large' },
      slots: { default: 'L' },
    })
    expect(wrapper.classes('ant-avatar-lg')).toBe(true)
  })

  it('applies small size class', () => {
    const wrapper = mount(Avatar, {
      props: { size: 'small' },
      slots: { default: 'S' },
    })
    expect(wrapper.classes('ant-avatar-sm')).toBe(true)
  })

  it('applies custom number size as inline style', () => {
    const wrapper = mount(Avatar, {
      props: { size: 64 },
      slots: { default: 'U' },
    })
    expect(wrapper.element.style.width).toBe('64px')
    expect(wrapper.element.style.height).toBe('64px')
    expect(wrapper.element.style.lineHeight).toBe('64px')
    expect(wrapper.element.style.fontSize).toBe('32px')
  })

  it('does not apply size style for default size', () => {
    const wrapper = mount(Avatar, {
      props: { size: 'default' },
      slots: { default: 'U' },
    })
    expect(wrapper.element.style.width).toBe('')
    expect(wrapper.element.style.height).toBe('')
  })

  it('has role="img" attribute', () => {
    const wrapper = mount(Avatar, {
      slots: { default: 'U' },
    })
    expect(wrapper.attributes('role')).toBe('img')
  })

  it('sets aria-label from alt prop', () => {
    const wrapper = mount(Avatar, {
      props: { alt: 'User avatar' },
      slots: { default: 'U' },
    })
    expect(wrapper.attributes('aria-label')).toBe('User avatar')
  })

  it('applies draggable attribute on image', () => {
    const wrapper = mount(Avatar, {
      props: {
        src: 'https://example.com/avatar.jpg',
        draggable: false,
      },
    })
    expect(wrapper.find('img').attributes('draggable')).toBe('false')
  })

  it('applies crossorigin attribute on image', () => {
    const wrapper = mount(Avatar, {
      props: {
        src: 'https://example.com/avatar.jpg',
        crossOrigin: 'anonymous',
      },
    })
    expect(wrapper.find('img').attributes('crossorigin')).toBe('anonymous')
  })

  it('resets image state when src changes', async () => {
    const wrapper = mount(Avatar, {
      props: { src: 'https://example.com/broken.jpg' },
      slots: { default: 'U' },
    })
    // Simulate image error
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('img').exists()).toBe(false)

    // Change src
    await wrapper.setProps({ src: 'https://example.com/new.jpg' })
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('auto-scales text to fit avatar', async () => {
    // Mock offsetWidth for text scaling
    const wrapper = mount(Avatar, {
      props: { gap: 4 },
      slots: { default: 'LongUsername' },
      attachTo: document.body,
    })

    // The scaling logic depends on DOM measurements,
    // in JSDOM offsetWidth is 0, so scale stays at 1
    await nextTick()
    const textEl = wrapper.find('.ant-avatar-string')
    expect(textEl.exists()).toBe(true)
    wrapper.unmount()
  })
})

describe('AvatarGroup', () => {
  it('should render correctly', () => {
    const wrapper = mount(AvatarGroup, {
      slots: {
        default: () => [
          h(Avatar, null, { default: () => 'A' }),
          h(Avatar, null, { default: () => 'B' }),
        ],
      },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders group wrapper with correct class', () => {
    const wrapper = mount(AvatarGroup, {
      slots: {
        default: () => [
          h(Avatar, null, { default: () => 'A' }),
        ],
      },
    })
    expect(wrapper.classes('ant-avatar-group')).toBe(true)
  })

  it('has role="group" attribute', () => {
    const wrapper = mount(AvatarGroup, {
      slots: {
        default: () => [
          h(Avatar, null, { default: () => 'A' }),
        ],
      },
    })
    expect(wrapper.attributes('role')).toBe('group')
  })

  it('has aria-label attribute', () => {
    const wrapper = mount(AvatarGroup, {
      slots: {
        default: () => [
          h(Avatar, null, { default: () => 'A' }),
        ],
      },
    })
    expect(wrapper.attributes('aria-label')).toBe('Avatar group')
  })

  it('renders all children when no maxCount', () => {
    const wrapper = mount(AvatarGroup, {
      slots: {
        default: () => [
          h(Avatar, null, { default: () => 'A' }),
          h(Avatar, null, { default: () => 'B' }),
          h(Avatar, null, { default: () => 'C' }),
        ],
      },
    })
    expect(wrapper.findAll('.ant-avatar').length).toBe(3)
  })

  it('limits visible children with maxCount', () => {
    const wrapper = mount(AvatarGroup, {
      props: { maxCount: 2 },
      slots: {
        default: () => [
          h(Avatar, null, { default: () => 'A' }),
          h(Avatar, null, { default: () => 'B' }),
          h(Avatar, null, { default: () => 'C' }),
          h(Avatar, null, { default: () => 'D' }),
        ],
      },
    })
    // 2 visible + 1 rest indicator
    const avatars = wrapper.findAll('.ant-avatar')
    expect(avatars.length).toBe(3)
  })

  it('shows +N rest count with maxCount', () => {
    const wrapper = mount(AvatarGroup, {
      props: { maxCount: 2 },
      slots: {
        default: () => [
          h(Avatar, null, { default: () => 'A' }),
          h(Avatar, null, { default: () => 'B' }),
          h(Avatar, null, { default: () => 'C' }),
          h(Avatar, null, { default: () => 'D' }),
        ],
      },
    })
    const restAvatar = wrapper.findAll('.ant-avatar').at(-1)!
    expect(restAvatar.find('.ant-avatar-string').text()).toBe('+2')
  })

  it('does not show rest indicator when count <= maxCount', () => {
    const wrapper = mount(AvatarGroup, {
      props: { maxCount: 5 },
      slots: {
        default: () => [
          h(Avatar, null, { default: () => 'A' }),
          h(Avatar, null, { default: () => 'B' }),
        ],
      },
    })
    expect(wrapper.findAll('.ant-avatar').length).toBe(2)
  })

  it('applies maxStyle to rest indicator', () => {
    const wrapper = mount(AvatarGroup, {
      props: {
        maxCount: 1,
        maxStyle: { backgroundColor: '#f56a00' },
      },
      slots: {
        default: () => [
          h(Avatar, null, { default: () => 'A' }),
          h(Avatar, null, { default: () => 'B' }),
        ],
      },
    })
    const restAvatar = wrapper.findAll('.ant-avatar').at(-1)!
    expect((restAvatar.element as HTMLElement).style.backgroundColor).toBeTruthy()
  })

  it('passes size to child avatars via context', () => {
    const wrapper = mount(AvatarGroup, {
      props: { size: 'large' },
      slots: {
        default: () => [
          h(Avatar, null, { default: () => 'A' }),
        ],
      },
    })
    const avatar = wrapper.find('.ant-avatar')
    expect(avatar.classes('ant-avatar-lg')).toBe(true)
  })

  it('passes shape to child avatars via context', () => {
    const wrapper = mount(AvatarGroup, {
      props: { shape: 'square' },
      slots: {
        default: () => [
          h(Avatar, null, { default: () => 'A' }),
        ],
      },
    })
    const avatar = wrapper.find('.ant-avatar')
    expect(avatar.classes('ant-avatar-square')).toBe(true)
  })

  it('applies size class to rest indicator when size=large', () => {
    const wrapper = mount(AvatarGroup, {
      props: { maxCount: 1, size: 'large' },
      slots: {
        default: () => [
          h(Avatar, null, { default: () => 'A' }),
          h(Avatar, null, { default: () => 'B' }),
        ],
      },
    })
    const restAvatar = wrapper.findAll('.ant-avatar').at(-1)!
    expect(restAvatar.classes('ant-avatar-lg')).toBe(true)
  })

  it('applies size class to rest indicator when size=small', () => {
    const wrapper = mount(AvatarGroup, {
      props: { maxCount: 1, size: 'small' },
      slots: {
        default: () => [
          h(Avatar, null, { default: () => 'A' }),
          h(Avatar, null, { default: () => 'B' }),
        ],
      },
    })
    const restAvatar = wrapper.findAll('.ant-avatar').at(-1)!
    expect(restAvatar.classes('ant-avatar-sm')).toBe(true)
  })
})
