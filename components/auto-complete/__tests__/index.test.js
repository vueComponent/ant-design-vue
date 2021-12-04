import { mount } from '@vue/test-utils';
import { sleep } from '../../../tests/utils';
import AutoComplete from '..';
import focusTest from '../../../tests/shared/focusTest';

describe('AutoComplete with Custom Input Element Render', () => {
  focusTest(AutoComplete);
  function $$(className) {
    return document.body.querySelectorAll(className);
  }
  it('AutoComplete with custom Input render perfectly', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <AutoComplete
              ref="component"
              options={[{ value: '12345' }, { value: '23456' }, { value: '34567' }]}
            >
              <input />
            </AutoComplete>
          );
        },
      },
      { attachTo: 'body', sync: false },
    );
    expect(wrapper.findAll('input').length).toBe(1);
    const input = wrapper.find('input');
    input.element.value = '123';
    input.trigger('input');
    await sleep(100);
    expect($$('.ant-select-item-option').length).toBe(3);
  });
});
