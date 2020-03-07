import { mount } from '@vue/test-utils';
import Alert from '..';

describe('Alert', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('could be closed', () => {
    const onClose = jest.fn();
    const afterClose = jest.fn();
    const wrapper = mount({
      render() {
        return (
          <Alert
            message="Warning Text Warning Text Warning TextW arning Text Warning Text Warning TextWarning Text"
            type="warning"
            closable
            onClose={onClose}
            afterClose={afterClose}
            ref="alert"
          />
        );
      },
    });
    wrapper.find('.ant-alert-close-icon').trigger('click');
    expect(onClose).toHaveBeenCalled();
    jest.runAllTimers();
    wrapper.vm.$refs.alert.animationEnd();
    expect(afterClose).toHaveBeenCalled();
  });

  describe('data and aria props', () => {
    it('sets data attributes on input', () => {
      const wrapper = mount({
        render() {
          return <Alert data-test="test-id" data-id="12345" />;
        },
      });
      const input = wrapper.find('.ant-alert').element;
      expect(input.getAttribute('data-test')).toBe('test-id');
      expect(input.getAttribute('data-id')).toBe('12345');
    });

    it('sets aria attributes on input', () => {
      const wrapper = mount({
        render() {
          return <Alert aria-describedby="some-label" />;
        },
      });

      const input = wrapper.find('.ant-alert').element;
      expect(input.getAttribute('aria-describedby')).toBe('some-label');
    });

    it('sets role attribute on input', () => {
      const wrapper = mount({
        render() {
          return <Alert role="status" />;
        },
      });

      const input = wrapper.find('.ant-alert').element;
      expect(input.getAttribute('role')).toBe('status');
    });
  });
});
