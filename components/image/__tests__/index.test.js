import Image from '..';
import mountTest from '../../../tests/shared/mountTest';
import { mount } from '@vue/test-utils';
describe('Image', () => {
  mountTest(Image);
  it('image size', () => {
    const wrapper = mount({
      render() {
        return (
          <Image
            width="200px"
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          />
        );
      },
    });
    expect(wrapper.find('.ant-image').element.style.width).toBe('200px');
  });
  it('image size number', () => {
    const wrapper = mount({
      render() {
        return (
          <Image
            width={200}
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          />
        );
      },
    });
    expect(wrapper.find('.ant-image').element.style.width).toBe('200px');
  });
});
