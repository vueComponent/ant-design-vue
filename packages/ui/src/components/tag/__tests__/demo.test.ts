import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Basic from '../demo/basic.vue'
import Status from '../demo/status.vue'
import Checkable from '../demo/checkable.vue'
import BorderLess from '../demo/border-less.vue'
import Colorful from '../demo/colorful.vue'
import HotTags from '../demo/hot-tags.vue'
import Icon from '../demo/icon.vue'
import Control from '../demo/control.vue'

const demos = { Basic, Status, Checkable, BorderLess, Colorful, HotTags, Icon, Control }

describe('Tag demos', () => {
  Object.entries(demos).forEach(([name, component]) => {
    it(`demo: ${name}`, () => {
      const wrapper = mount(component)
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
