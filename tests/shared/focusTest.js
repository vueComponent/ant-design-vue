import { mount } from '@vue/test-utils'
import Vue from 'vue'
export default function focusTest (Component) {
  describe('focus and blur', () => {
    beforeAll(() => {
      jest.useFakeTimers()
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    it('focus() and onFocus', () => {
      const handleFocus = jest.fn()
      const wrapper = mount({
        render (h) {
          return <Component ref='component' onFocus={handleFocus} />
        },
      }, { attachToDocument: true, sync: false })
      wrapper.vm.$refs.component.focus()
      jest.runAllTimers()
      expect(handleFocus).toBeCalled()
    })

    it('blur() and onBlur', () => {
      const handleBlur = jest.fn()
      const wrapper = mount({
        render (h) {
          return <Component ref='component' onBlur={handleBlur} />
        },
      }, { attachToDocument: true, sync: false })
      wrapper.vm.$refs.component.focus()
      wrapper.vm.$refs.component.blur()
      jest.runAllTimers()
      expect(handleBlur).toBeCalled()
    })

    it('autoFocus', (done) => {
      jest.useRealTimers()
      const handleFocus = jest.fn()
      mount({
        render (h) {
          return <Component autoFocus onFocus={handleFocus} />
        },
      }, { attachToDocument: true, sync: false })
      setTimeout(() => {
        expect(handleFocus).toBeCalled()
        done()
      }, 1000)
    })
  })
}
