import { mount } from '@vue/test-utils';
import Space from '..';
import mountTest from '../../../tests/shared/mountTest';

describe('Space', () => {
  mountTest(Space);

  it('should render width empty children', () => {
    const wrapper = mount({
      render() {
        return <Space />;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should render width customize size', () => {
    const wrapper = mount({
      render() {
        return (
          <Space size={10}>
            <span>1</span>
            <span>2</span>
          </Space>
        );
      },
    });
    expect(wrapper.findAll('.ant-space-item')[0].element.style.marginRight).toBe('10px');
    expect(wrapper.findAll('.ant-space-item')[1].element.style.marginRight).toBe('');
  });

  it('should render vertical space width customize size', () => {
    const wrapper = mount({
      render() {
        return (
          <Space size={10} direction="vertical">
            <span>1</span>
            <span>2</span>
          </Space>
        );
      },
    });
    expect(wrapper.findAll('.ant-space-item')[0].element.style.marginBottom).toBe('10px');
    expect(wrapper.findAll('.ant-space-item')[1].element.style.marginBottom).toBe('');
  });

  it('should render correct with children', () => {
    const wrapper = mount({
      render() {
        return (
          <Space>
            text1<span>text1</span>
            text3
          </Space>
        );
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should render with invalidElement', () => {
    const wrapper = mount({
      render() {
        return (
          <Space>
            text1<span>text1</span>
            text1
          </Space>
        );
      },
    });

    expect(wrapper.findAll('.ant-space-item').length).toBe(3);
  });
});
