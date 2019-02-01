import { mount } from '@vue/test-utils';
import Vue from 'vue';
import AutoComplete from '..';
import focusTest from '../../../tests/shared/focusTest';

describe('AutoComplete with Custom Input Element Render', () => {
  focusTest(AutoComplete);
  function $$(className) {
    return document.body.querySelectorAll(className);
  }
  it('AutoComplete with custom Input render perfectly', done => {
    const wrapper = mount(
      {
        render() {
          return (
            <AutoComplete ref="component" dataSource={['12345', '23456', '34567']}>
              <input />
            </AutoComplete>
          );
        },
      },
      { attachToDocument: true, sync: false },
    );
    expect(wrapper.findAll('input').length).toBe(1);
    const input = wrapper.find('input');
    input.element.value = '123';
    input.trigger('input');
    Vue.nextTick(() => {
      mount(
        {
          render() {
            return wrapper.find({ name: 'Trigger' }).vm.getComponent();
          },
        },
        { sync: false },
      );
      Vue.nextTick(() => {
        expect($$('.ant-select-dropdown-menu-item').length).toBe(3);
        done();
      });
    });
  });
});
