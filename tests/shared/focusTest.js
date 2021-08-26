import { mount } from '@vue/test-utils';
import { sleep } from '../utils';

export default function focusTest(Component) {
  describe('focus and blur', () => {
    let focused = false;
    let blurred = false;
    const mockFocus = jest.spyOn(HTMLElement.prototype, 'focus');
    const mockBlur = jest.spyOn(HTMLElement.prototype, 'blur');

    beforeAll(() => {
      mockFocus.mockImplementation(() => {
        focused = true;
      });
      mockBlur.mockImplementation(() => {
        blurred = true;
      });
    });

    let container;
    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
      focused = false;
      blurred = false;
    });

    afterAll(() => {
      mockFocus.mockRestore();
      mockBlur.mockRestore();
    });

    afterEach(() => {
      document.body.removeChild(container);
    });

    const getElement = wrapper => {
      let ele = wrapper.findAll('input');
      if (ele.length === 0) {
        ele = wrapper.findAll('button');
      }
      if (ele.length === 0) {
        ele = wrapper.findAll('textarea');
      }
      if (ele.length === 0) {
        ele = wrapper.findAll('div[tabindex]');
      }
      return ele[0];
    };
    it('focus() and onFocus', async () => {
      const handleFocus = jest.fn();
      const wrapper = mount(
        {
          render() {
            return <Component ref="component" onFocus={handleFocus} />;
          },
        },
        { attachTo: container, sync: false },
      );
      wrapper.vm.$refs.component.focus();
      expect(focused).toBeTruthy();
      getElement(wrapper).trigger('focus');
      expect(handleFocus).toBeCalled();
    });

    it('blur() and onBlur', async () => {
      const handleBlur = jest.fn();
      const handleFocus = jest.fn();
      const wrapper = mount(
        {
          render() {
            return <Component ref="component" onFocus={handleFocus} onBlur={handleBlur} />;
          },
        },
        { attachTo: container, sync: false },
      );
      getElement(wrapper).trigger('focus');
      wrapper.vm.$refs.component.blur();
      expect(blurred).toBeTruthy();
      getElement(wrapper).trigger('blur');
      await sleep(300);
      expect(handleBlur).toBeCalled();
    });

    it('autofocus', async () => {
      const handleFocus = jest.fn();
      const wrapper = mount(
        {
          render() {
            return <Component autofocus={true} onFocus={handleFocus} />;
          },
        },
        { attachTo: container, sync: false },
      );
      getElement(wrapper).trigger('focus');
      expect(handleFocus).toBeCalled();
    });
  });
}
