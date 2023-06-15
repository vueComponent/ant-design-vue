import FloatButton from '../index';
import { mount } from '@vue/test-utils';
import { asyncExpect, sleep } from '../../../tests/utils';

describe('click wave effect', () => {
  async function clickFloatButton(wrapper) {
    await asyncExpect(() => {
      wrapper.find('.ant-float-btn').trigger('click');
    });
    wrapper.find('.ant-float-btn').element.dispatchEvent(new Event('transitionstart'));
    await sleep(20);
    wrapper.find('.ant-float-btn').element.dispatchEvent(new Event('animationend'));
    await sleep(20);
  }

  it('should have click wave effect for primary button', async () => {
    const wrapper = mount({
      render() {
        return <FloatButton type="primary"></FloatButton>;
      },
    });
    await clickFloatButton(wrapper);
    expect(
      wrapper.find('.ant-float-btn').attributes('ant-click-animating-without-extra-node'),
    ).toBe('true');
  });

  it('should have click wave effect for default button', async () => {
    const wrapper = mount({
      render() {
        return <FloatButton>button</FloatButton>;
      },
    });
    await clickFloatButton(wrapper);
    expect(
      wrapper.find('.ant-float-btn').attributes('ant-click-animating-without-extra-node'),
    ).toBe('true');
  });

  it('should not have click wave effect for link type button', async () => {
    const wrapper = mount({
      render() {
        return <FloatButton type="link">button</FloatButton>;
      },
    });
    await clickFloatButton(wrapper);
    expect(
      wrapper.find('.ant-float-btn').attributes('ant-click-animating-without-extra-node'),
    ).toBe(undefined);
  });

  it('should not have click wave effect for text type button', async () => {
    const wrapper = mount({
      render() {
        return <FloatButton type="text">button</FloatButton>;
      },
    });
    await clickFloatButton(wrapper);
    expect(
      wrapper.find('.ant-float-btn').attributes('ant-click-animating-without-extra-node'),
    ).toBe(undefined);
  });

  it('should handle transitionstart', async () => {
    const wrapper = mount({
      render() {
        return <FloatButton type="primary">button</FloatButton>;
      },
    });
    await clickFloatButton(wrapper);
    const buttonNode = wrapper.find('.ant-float-btn').element;
    buttonNode.dispatchEvent(new Event('transitionstart'));
    expect(
      wrapper.find('.ant-float-btn').attributes('ant-click-animating-without-extra-node'),
    ).toBe('true');
    wrapper.unmount();
    buttonNode.dispatchEvent(new Event('transitionstart'));
  });
});
