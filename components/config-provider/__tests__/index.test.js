import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import ConfigProvider from '..';
import Button from '../../button';
import theme from '../../theme';
import mountTest from '../../../tests/shared/mountTest';
import { sleep } from '../../../tests/utils';

const TokenProbe = defineComponent({
  props: {
    name: String,
  },
  setup(props) {
    const { token } = theme.useToken();
    return () => <span class={`token-probe-${props.name}`}>{token.value.colorPrimary}</span>;
  },
});

describe('ConfigProvider', () => {
  mountTest({
    render() {
      return (
        <>
          <ConfigProvider>
            <div />
          </ConfigProvider>
        </>
      );
    },
  });

  it('Content Security Policy', () => {
    const csp = { nonce: 'test-antd' };
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider csp={csp}>
            <Button ref="button" />
          </ConfigProvider>
        );
      },
    });
    expect(wrapper.findComponent({ ref: 'button' }).vm.$refs.wave.csp.nonce).toBe(csp.nonce);
  });

  it('autoInsertSpaceInButton', async () => {
    const wrapper = mount({
      data() {
        return {
          autoInsertSpaceInButton: false,
        };
      },
      render() {
        return (
          <ConfigProvider autoInsertSpaceInButton={this.autoInsertSpaceInButton}>
            <Button ref="button">确定</Button>
          </ConfigProvider>
        );
      },
    });

    expect(wrapper.find('.ant-btn').text()).toBe('确定');
    wrapper.vm.autoInsertSpaceInButton = true;
    await sleep();
    expect(wrapper.find('.ant-btn').text()).toBe('确 定');
  });

  it('should not leak nested theme token to sibling components', async () => {
    const customColor = '#ff0000';
    const wrapper = mount({
      render() {
        return (
          <>
            <TokenProbe name="outside-before" />
            <ConfigProvider theme={{ token: { colorPrimary: customColor } }}>
              <TokenProbe name="inside" />
            </ConfigProvider>
            <TokenProbe name="outside-after" />
          </>
        );
      },
    });

    await sleep();

    expect(wrapper.find('.token-probe-inside').text()).toBe(customColor);
    expect(wrapper.find('.token-probe-outside-before').text()).toBe(theme.defaultSeed.colorPrimary);
    expect(wrapper.find('.token-probe-outside-after').text()).toBe(theme.defaultSeed.colorPrimary);
  });
});
