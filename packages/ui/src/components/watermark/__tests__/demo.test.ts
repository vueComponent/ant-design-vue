import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UI from '../../../index'

const demos = import.meta.glob('../demo/*.vue', { eager: true })

describe('Watermark demos', () => {
  Object.entries(demos).forEach(([path, module]) => {
    const name = path.match(/demo\/(.+)\.vue/)?.[1]
    it(`demo: ${name}`, () => {
      const Comp = (module as any).default
      const wrapper = mount(Comp, { global: { plugins: [UI] } })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
