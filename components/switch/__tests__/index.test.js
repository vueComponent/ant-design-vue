import Switch from '..';
import { mount } from '@vue/test-utils';
import focusTest from '../../../tests/shared/focusTest';
import { resetWarned } from '../../_util/warning';
import mountTest from '../../../tests/shared/mountTest';
import { ref } from 'vue';

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
});
