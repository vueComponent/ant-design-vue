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

    it('focus() and onFocus', async () => {
      const handleFocus = jest.fn();
      const wrapper = mount(
        {
          render() {
            return <Component ref="component" onFocus={handleFocus} />;
          },
        },
        { attachTo: 'body', sync: false },
      );
      wrapper.vm.$refs.component.focus();
      jest.runAllTimers();
      expect(handleFocus).toBeCalled();
    });

    it('blur() and onBlur', async () => {
      const handleBlur = jest.fn();
      const wrapper = mount(
        {
          render() {
            return <Component ref="component" onBlur={handleBlur} />;
          },
        },
        { attachTo: 'body', sync: false },
      );
      wrapper.vm.$refs.component.focus();
      wrapper.vm.$refs.component.blur();
      jest.runAllTimers();
      await asyncExpect(() => {
        expect(handleBlur).toBeCalled();
      });
    });

    it('autofocus', done => {
      jest.useRealTimers();
      const handleFocus = jest.fn();
      mount(
        {
          render() {
            return <Component autofocus={true} onFocus={handleFocus} />;
          },
        },
        { attachTo: 'body', sync: false },
      );
      setTimeout(() => {
        expect(handleFocus).toBeCalled();
        done();
      }, 1000);
    });
  });
}
