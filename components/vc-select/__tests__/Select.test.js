import { mount } from '@vue/test-utils';
import Select from '../Select';
import { asyncExpect } from '../../../tests/utils';

describe('Select Basic', () => {
  it('all other options are disabled when the select option reaches max count', async () => {
    const wrapper = mount(Select, {
      props: {
        open: true,
        maxCount: 1,
        mode: 'multiple',
        options: [{ value: 'light' }, { value: 'dark' }],
        value: ['light'],
      },
      sync: false,
    });

    await asyncExpect(() => {
      const selectList = document.body.querySelectorAll('.vc-select-item');

      expect(selectList[0].classList.contains('vc-select-item-option-disabled')).toBe(false);
      expect(selectList[1].classList.contains('vc-select-item-option-disabled')).toBe(true);
      wrapper.unmount();
    });
  });
});
