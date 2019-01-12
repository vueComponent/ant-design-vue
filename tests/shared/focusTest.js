import { mount } from '@vue/test-utils';
import { asyncExpect } from '../utils';

export default function focusTest(Component) {
  describe('focus and blur', () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('focus() and onFocus', () => {
      const handleFocus = jest.fn();
      const wrapper = mount(
        {
          render(h) {
            return <Component ref="component" onFocus={handleFocus} />;
          },
        },
        { attachToDocument: true, sync: false },
      );
      wrapper.vm.$refs.component.focus();
      jest.runAllTimers();
      expect(handleFocus).toBeCalled();
    });

    it('blur() and onBlur', async () => {
      const handleBlur = jest.fn();
      const wrapper = mount(
        {
          render(h) {
            return <Component ref="component" onBlur={handleBlur} />;
          },
        },
        { attachToDocument: true, sync: false },
      );
      wrapper.vm.$refs.component.focus();
      wrapper.vm.$refs.component.blur();
      jest.runAllTimers();
      await asyncExpect(() => {
        expect(handleBlur).toBeCalled();
      });
    });

    it('autoFocus', done => {
      jest.useRealTimers();
      const handleFocus = jest.fn();
      mount(
        {
          render(h) {
            return <Component autoFocus onFocus={handleFocus} />;
          },
        },
        { attachToDocument: true, sync: false },
      );
      setTimeout(() => {
        expect(handleFocus).toBeCalled();
        done();
      }, 1000);
    });
  });
}
