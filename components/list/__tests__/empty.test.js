import { mount } from '@vue/test-utils';
import List from '..';

describe('List', () => {
  it('renders empty list', () => {
    const wrapper = mount({
      render() {
        return <List dataSource={[]} renderItem={() => <List.Item />} />;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
