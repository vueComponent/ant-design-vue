import { flushPromises, mount } from '@vue/test-utils';
import { h } from 'vue';
import Dropdown from '..';

describe('Dropdown disabled', () => {
  it('makes an already open popup inert until re-enabled', async () => {
    const wrapper = mount(Dropdown, {
      attachTo: document.body,
      props: { open: true },
      slots: {
        default: () => h('button', 'Fruit'),
        overlay: () => h('div', { id: 'dropdown-option' }, 'Orange'),
      },
    });

    try {
      await flushPromises();
      const option = document.getElementById('dropdown-option');
      expect(option).not.toBeNull();
      expect(option.closest('[inert]')).toBeNull();

      await wrapper.setProps({ disabled: true });
      expect(option.closest('[inert]')).not.toBeNull();

      await wrapper.setProps({ disabled: false });
      expect(option.closest('[inert]')).toBeNull();
    } finally {
      wrapper.unmount();
    }
  });
});
