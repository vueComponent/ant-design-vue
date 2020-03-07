import { mount } from '@vue/test-utils';
import Empty from '..';
import mountTest from '../../../tests/shared/mountTest';

describe('Empty', () => {
  mountTest(Empty);

  it('image size should change', () => {
    const wrapper = mount({
      render() {
        return <Empty imageStyle={{ height: '20px' }} />;
      },
    });
    expect(wrapper.find('.ant-empty-image').element.style.height).toBe('20px');
  });

  it('description can be false', () => {
    const wrapper = mount({
      render() {
        return <Empty description={false} />;
      },
    });
    expect(wrapper.findAll('.ant-empty-description').length).toBe(0);
  });
});
