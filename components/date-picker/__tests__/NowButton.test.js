import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
import DatePicker from '..';
import { nextTick } from 'vue';

describe('now button should work', () => {
  it('now button should work', async () => {
    const wrapper = mount(DatePicker, {
      props: {
        mode: 'date',
        showTime: true,
        open: true,
      },
      sync: false,
    });

    await asyncExpect(async () => {
      const modeList = ['week', 'month', 'quarter', 'year', 'decade', 'time', 'date'];
      const input = wrapper.find('.ant-picker-input > input');

      for (const mode of modeList) {
        input.element.value = '';

        await wrapper.setProps({
          mode,
        });
        await nextTick();
        const nowBtn = document.body.querySelector('.ant-picker-now-btn');
        if (mode === 'time' || mode === 'date') {
          expect(nowBtn).not.toBeNull();
          nowBtn.click();
          await nextTick();
          expect(input.element.value).not.toBe('');
          continue;
        }
        expect(nowBtn).toBeNull();
      }

      wrapper.unmount();
    });
  });
});
