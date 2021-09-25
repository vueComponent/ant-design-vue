import Switch from '..';
import { mount } from '@vue/test-utils';
import focusTest from '../../../tests/shared/focusTest';
import { resetWarned } from '../../_util/warning';
import mountTest from '../../../tests/shared/mountTest';
import { ref } from 'vue';
import { asyncExpect } from '../../../tests/utils';

describe('Switch', () => {
  focusTest(Switch);
  mountTest(Switch);

  it('should has click wave effect', async () => {
    const wrapper = mount({
      setup() {
        const checked = ref(false);
        return () => {
          return (
            <Switch
              checked={checked.value}
              onChange={() => (checked.value = !checked.value)}
            ></Switch>
          );
        };
      },
    });
    wrapper.find('.ant-switch').trigger('click');
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('warning if set `value`', () => {
    resetWarned();

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mount({
      render() {
        return <Switch value="" />;
      },
    });
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: [antdv: Switch] `value` is not validate prop, do you mean `checked`?',
    );
    errorSpy.mockRestore();
  });

  it('customize checked value should work', async () => {
    resetWarned();
    const checked = ref(1);
    const onUpdate = val => (checked.value = val);
    const wrapper = mount({
      render() {
        return (
          <Switch
            {...{ 'onUpdate:checked': onUpdate }}
            checked={checked.value}
            unCheckedValue={1}
            checkedValue={2}
          />
        );
      },
    });
    await asyncExpect(() => {
      wrapper.find('button').trigger('click');
    });
    expect(checked.value).toBe(2);

    await asyncExpect(() => {
      wrapper.find('button').trigger('click');
    });
    expect(checked.value).toBe(1);
  });

  it('customize checked value and children should work', async () => {
    resetWarned();
    const checked = ref(1);
    const onUpdate = val => (checked.value = val);
    const wrapper = mount({
      render() {
        return (
          <Switch
            {...{ 'onUpdate:checked': onUpdate }}
            checked={checked.value}
            unCheckedValue={1}
            checkedValue={2}
            checkedChildren="on"
            unCheckedChildren="off"
          />
        );
      },
    });
    await asyncExpect(() => {
      wrapper.find('button').trigger('click');
    });
    expect(checked.value).toBe(2);
    expect(wrapper.find('.ant-switch-inner').text()).toBe('on');

    await asyncExpect(() => {
      wrapper.find('button').trigger('click');
    });
    expect(checked.value).toBe(1);
    expect(wrapper.find('.ant-switch-inner').text()).toBe('off');
  });
});
