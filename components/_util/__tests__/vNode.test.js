import RenderSlot from '../__mocks__/RenderSlot';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';

describe('render slot content', () => {
  it('renders slot content', () => {
    const wrapper = mount(RenderSlot, {
      slots: {
        default: () => 'This is slot content',
      },
    });

    expect(wrapper.html()).toContain('This is slot content');
  });

  it('render default value when slot is fragment', async () => {
    const wrapper = mount(RenderSlot, {
      slots: {
        default: () => <></>,
      },
    });

    await nextTick();
    expect(wrapper.html()).toContain('default value');
  });
});
