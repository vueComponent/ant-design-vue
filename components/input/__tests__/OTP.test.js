import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
import Input from '../index';

const { OTP } = Input;

const getInputAllText = inputAll => {
  let str = '';

  inputAll.forEach(input => {
    str += input.element.value;
  });
  return str;
};
describe('OTP', () => {
  it('paste to fill', async () => {
    const onChange = jest.fn();

    const wrapper = mount(OTP, { props: { onChange }, sync: false });
    await asyncExpect(async () => {
      const input = wrapper.find('input');

      await input.setValue('123456');

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('123456');

      wrapper.unmount();
    });
  });

  it('the input preceding the current one does not support paste-to-fill', async () => {
    const onChange = jest.fn();

    const wrapper = mount(OTP, { props: { onChange }, sync: false });
    await asyncExpect(async () => {
      const inputAll = wrapper.findAll('input');

      await inputAll[1].setValue('123456');
      expect(onChange).not.toHaveBeenCalled();

      await inputAll[0].setValue('0');

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('012345');

      wrapper.unmount();
    });
  });

  it('step to fill', async () => {
    const internalValue = 'holder'.split('');
    const onChange = jest.fn();

    const wrapper = mount(OTP, { props: { onChange }, sync: false });
    await asyncExpect(async () => {
      const inputAll = wrapper.findAll('input');

      for (let i = 0; i < internalValue.length; i++) {
        expect(onChange).not.toHaveBeenCalled();
        await inputAll[i].setValue(internalValue[i]);
      }

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(internalValue.join(''));

      wrapper.unmount();
    });
  });

  it('set value', async () => {
    const wrapper = mount(OTP, { props: { value: 'search' }, sync: false });

    await asyncExpect(async () => {
      const inputAll = wrapper.findAll('input');
      expect(getInputAllText(inputAll)).toBe('search');

      await wrapper.setProps({ value: '' });
      expect(getInputAllText(inputAll)).toBe('');

      await wrapper.setProps({ value: 'hello world' });
      expect(getInputAllText(inputAll)).toBe('hello ');

      await wrapper.setProps({ value: '' });
      // null is not valid value
      await wrapper.setProps({ value: null });
      expect(getInputAllText(inputAll)).toBe('');

      wrapper.unmount();
    });
  });

  it('backspace to step', async () => {
    const onChange = jest.fn();
    const wrapper = mount(OTP, { props: { value: 'search', onChange }, sync: false });

    await asyncExpect(async () => {
      const inputAll = wrapper.findAll('input');
      let str = getInputAllText(inputAll);
      expect(str).toBe('search');

      for (let i = inputAll.length - 1; i >= 0; i--) {
        inputAll[i].trigger('keydown', { key: 'Backspace' });
        inputAll[i].setValue('');
        inputAll[i].trigger('keyup', { key: 'Backspace' });
        await wrapper.vm.$nextTick();
      }

      str = getInputAllText(inputAll);
      expect(onChange).not.toHaveBeenCalled();
      expect(str).toBe('');

      wrapper.unmount();
    });
  });

  it('formatter', async () => {
    const onChange = jest.fn();
    const wrapper = mount(OTP, {
      props: { formatter: txt => txt.toUpperCase(), onChange },
      sync: false,
    });

    await asyncExpect(async () => {
      const inputAll = wrapper.findAll('input');
      const internalValue = 'search'.split('');
      for (let i = 0; i < inputAll.length; i++) {
        await inputAll[i].setValue(internalValue[i]);
      }

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('SEARCH');

      wrapper.unmount();
    });
  });

  it('support mask prop', async () => {
    const onChange = jest.fn();
    const internalValue = 'search'.split('');
    const wrapper = mount(OTP, { props: { mask: '🔒', onChange }, sync: false });

    await asyncExpect(async () => {
      const inputAll = wrapper.findAll('input');
      const internalValue = 'search'.split('');
      for (let i = 0; i < inputAll.length; i++) {
        await inputAll[i].setValue(internalValue[i]);
      }
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('search');
      expect(getInputAllText(inputAll)).toBe('🔒🔒🔒🔒🔒🔒');
    });
  });
});
