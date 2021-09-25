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
      props,
    });
    const dropdownProps = wrapper.findComponent({ name: 'ADropdown' }).props();
    Object.keys(props).forEach(key => {
      expect(dropdownProps[key]).toStrictEqual(props[key]);
    });
  });

  it("don't pass visible to Dropdown if it's not exits", () => {
    const wrapper = mount(Dropdown.Button, {
      slots: {
        overlay: () => (
          <Menu>
            <Menu.Item>foo</Menu.Item>
          </Menu>
        ),
      },
    });
    const dropdownProps = wrapper.findComponent({ name: 'ADropdown' }).props();

    expect(dropdownProps.visible).toBe(undefined);
  });

  it('should support href like Button', () => {
    const wrapper = mount({
      render() {
        return (
          <Dropdown.Button
            href="https://ant.design"
            v-slots={{
              overlay: () => (
                <Menu>
                  <Menu.Item>foo</Menu.Item>
                </Menu>
              ),
            }}
          />
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
