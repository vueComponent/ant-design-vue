import { ref } from 'vue';
import { mount } from '@vue/test-utils';
import QRCode from '..';

describe('QRCode test', () => {
  it('should correct render', () => {
    const wrapper = mount({
      render() {
        return <QRCode value="test" />;
      },
    });
    expect(wrapper.find('.ant-qrcode')).toBeTruthy();
    expect(wrapper.find('canvas')).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it('support custom icon', () => {
    const wrapper = mount({
      render() {
        return <QRCode value="test" icon="test" />;
      },
    });
    expect(wrapper.find('.ant-qrcode')).toBeTruthy();
    expect(wrapper.find('image')).toBeTruthy();
  });

  it('support custom size', () => {
    const wrapper = mount({
      render() {
        return <QRCode value="test" size={100} />;
      },
    });
    expect(wrapper.vm.$el.style.width).toBe('100px');
    expect(wrapper.vm.$el.style.height).toBe('100px');
  });

  it('support refresh', async () => {
    const refresh = jest.fn();
    const wrapper = mount({
      render() {
        return <QRCode value="test" status="expired" onRefresh={refresh} />;
      },
    });
    await wrapper.find('.ant-btn-link').trigger('click');
    expect(refresh).toHaveBeenCalled();
  });

  it('support loading', async () => {
    const Demo = () => {
      const status = ref('active');
      const setStatus = val => (status.value = val);
      return (
        <>
          <QRCode value="test" status={status.value} />
          <button type="button" onClick={() => setStatus('loading')}>
            set loading
          </button>
        </>
      );
    };
    const wrapper = mount({
      render() {
        return <Demo />;
      },
    });
    await wrapper.find('button').trigger('click');
    expect(wrapper.find('.ant-spin-spinning')).toBeTruthy();
  });

  it('support bordered', () => {
    const wrapper = mount({
      render() {
        return <QRCode value="test" bordered={false} />;
      },
    });
    expect(wrapper.vm.$el.__vnode.el.className).toContain('-borderless');
  });

  it('should console Error when icon exist && errorLevel is `L`', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mount({
      render() {
        return <QRCode value="test" icon="test" errorLevel="L" />;
      },
    });
    expect(errSpy).toHaveBeenCalledWith(
      'Warning: [ant-design-vue: QRCode] ErrorLevel `L` is not recommended to be used with `icon`, for scanning result would be affected by low level.',
    );
    errSpy.mockRestore();
  });
});
