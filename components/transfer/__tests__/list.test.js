import { mount } from '@vue/test-utils';
import List from '../list';

const listCommonProps = {
  prefixCls: 'ant-transfer-list',
  dataSource: [
    {
      key: 'a',
      title: 'a',
    },
    {
      key: 'b',
      title: 'b',
    },
    {
      key: 'c',
      title: 'c',
      disabled: true,
    },
  ],
  checkedKeys: ['a'],
  notFoundContent: 'Not Found',
  lazy: false,
};

describe('List', () => {
  it('should render correctly', () => {
    const props = {
      props: listCommonProps,
    };
    const wrapper = mount(List, props);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should check top Checkbox while all available items are checked', () => {
    const props = {
      props: {
        ...listCommonProps,
        checkedKeys: ['a', 'b'],
      },
    };
    const wrapper = mount(List, props);
    expect(
      wrapper
        .findComponent({
          name: 'ACheckbox',
        })
        .props().checked,
    ).toBeTruthy();
  });
});
