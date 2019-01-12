import { mount } from '@vue/test-utils';
import Checkbox from '..';
import focusTest from '../../../tests/shared/focusTest';

describe('Checkbox', () => {
  focusTest(Checkbox);
  it('responses hover events', () => {
    const onMouseEnter = jest.fn();
    const onMouseLeave = jest.fn();

    const wrapper = mount(Checkbox, {
      listeners: {
        mouseenter: onMouseEnter,
        mouseleave: onMouseLeave,
      },
    });

    wrapper.trigger('mouseenter');
    expect(onMouseEnter).toHaveBeenCalled();

    wrapper.trigger('mouseleave');
    expect(onMouseLeave).toHaveBeenCalled();
  });
});
