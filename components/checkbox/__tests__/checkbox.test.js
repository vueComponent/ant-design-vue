import { mount } from '@vue/test-utils';
import Checkbox from '..';
import focusTest from '../../../tests/shared/focusTest';
import { resetWarned } from '../../_util/warning';
import mountTest from '../../../tests/shared/mountTest';

describe('Checkbox', () => {
  focusTest(Checkbox);
  mountTest(Checkbox);
  it('responses hover events', () => {
    const onMouseEnter = jest.fn();
    const onMouseLeave = jest.fn();

    const wrapper = mount(Checkbox, {
      props: {
        onMouseenter: onMouseEnter,
        onMouseleave: onMouseLeave,
      },
    });

    wrapper.trigger('mouseenter');
    expect(onMouseEnter).toHaveBeenCalled();

    wrapper.trigger('mouseleave');
    expect(onMouseLeave).toHaveBeenCalled();
  });
  it('warning if set `value`', () => {
    resetWarned();

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mount(Checkbox, {
      props: {
        value: 'xxx',
      },
    });
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: [antdv: Checkbox] `value` is not validate prop, do you mean `checked`?',
    );
    errorSpy.mockRestore();
  });
});
