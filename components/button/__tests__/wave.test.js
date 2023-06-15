import Button from '../index';
import { mount } from '@vue/test-utils';
import { asyncExpect, sleep } from '../../../tests/utils';

describe('click wave effect', () => {
  async function clickButton(wrapper) {
    await asyncExpect(() => {
      wrapper.find('.ant-btn').trigger('click');
    });
    wrapper.find('.ant-btn').element.dispatchEvent(new Event('transitionstart'));
    await sleep(20);
    wrapper.find('.ant-btn').element.dispatchEvent(new Event('animationend'));
    await sleep(20);
  }

  it('should handle transitionstart', async () => {
    const wrapper = mount({
      render() {
        return <Button type="primary">button</Button>;
      },
    });
    await clickButton(wrapper);
    const buttonNode = wrapper.find('.ant-btn').element;
    buttonNode.dispatchEvent(new Event('transitionstart'));
    wrapper.unmount();
    buttonNode.dispatchEvent(new Event('transitionstart'));
  });
});
