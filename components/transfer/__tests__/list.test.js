import { mount } from '@vue/test-utils';
import { renderToString } from '@vue/server-test-utils';
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
      propsData: listCommonProps,
    };
    const wrapper = renderToString(List, props);
    expect(wrapper).toMatchSnapshot();
  });

  it('should check top Checkbox while all available items are checked', () => {
    const props = {
      propsData: {
        ...listCommonProps,
        checkedKeys: ['a', 'b'],
      },
    };
    const wrapper = mount(List, props);
    expect(
      wrapper
        .find('.ant-transfer-list-header')
        .find({
          name: 'ACheckbox',
        })
        .props().checked,
    ).toBeTruthy();
  });
});
