import { mount } from '@vue/test-utils';
import ConfigProvider from '..';
import Button from '../../button';
import mountTest from '../../../tests/shared/mountTest';

describe('ConfigProvider', () => {
  mountTest({
    render() {
      return (
        <ConfigProvider>
          <div />
        </ConfigProvider>
      );
    },
  });

  it('Content Security Policy', () => {
    const csp = { nonce: 'test-antd' };
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider csp={csp}>
            <Button />
          </ConfigProvider>
        );
      },
    });
    expect(wrapper.find({ name: 'Wave' }).vm.csp).toBe(csp);
  });

  it('autoInsertSpaceInButton', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider autoInsertSpaceInButton={false}>
            <Button>确定</Button>
          </ConfigProvider>
        );
      },
    });

    expect(wrapper.find({ name: 'AButton' }).text()).toBe('确定');
  });
});
