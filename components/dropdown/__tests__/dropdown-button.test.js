import { mount } from '@vue/test-utils';
import Dropdown from '..';
import Menu from '../../menu';

describe('DropdownButton', () => {
  it('pass appropriate props to Dropdown', () => {
    const props = {
      align: {
        offset: [10, 20],
      },
      disabled: false,
      trigger: ['hover'],
      visible: true,
    };

    const wrapper = mount(Dropdown.Button, {
      propsData: props,
      listeners: {
        visibleChange: () => {},
      },
    });
    const dropdownProps = wrapper.find({ name: 'ADropdown' }).props();

    Object.keys(props).forEach(key => {
      expect(dropdownProps[key]).toBe(props[key]);
    });
  });

  it("don't pass visible to Dropdown if it's not exits", () => {
    const wrapper = mount({
      render() {
        return (
          <Dropdown.Button
            overlay={
              <Menu>
                <Menu.Item>foo</Menu.Item>
              </Menu>
            }
          />
        );
      },
    });
    const dropdownProps = wrapper.find({ name: 'ADropdown' }).props();

    expect('visible' in dropdownProps).toBe(false);
  });

  it('should support href like Button', () => {
    const wrapper = mount({
      render() {
        return (
          <Dropdown.Button
            href="https://ant.design"
            overlay={
              <Menu>
                <Menu.Item>foo</Menu.Item>
              </Menu>
            }
          />
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
