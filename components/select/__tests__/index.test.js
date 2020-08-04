import { mount } from '@vue/test-utils';
import { asyncExpect } from '@/tests/utils';
import Select from '..';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import focusTest from '../../../tests/shared/focusTest';
import mountTest from '../../../tests/shared/mountTest';
function $$(className) {
  return document.body.querySelectorAll(className);
}
function getStyle(el, prop) {
  const style = window.getComputedStyle ? window.getComputedStyle(el) : el.currentStyle;

  // If a css property's value is `auto`, it will return an empty string.
  return prop ? style[prop] : style;
}
describe('Select', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  focusTest(Select);
  mountTest({
    render() {
      return (
        <div>
          <Select />
        </div>
      );
    },
  });

  it('should have default notFoundContent', async () => {
    const wrapper = mount(Select, {
      props: {
        mode: 'multiple',
      },
      sync: false,
      attachTo: 'body',
    });
    await asyncExpect(() => {
      wrapper.find('.ant-select').trigger('click');
    });

    await asyncExpect(() => {
      expect($$('.ant-select-dropdown-menu-item').length).toBe(1);
      expect($$('.ant-select-dropdown-menu-item .ant-empty-description')[0].innerHTML).toBe(
        'No Data',
      );
    });
  });

  it('should support set notFoundContent to null', async () => {
    const wrapper = mount(Select, {
      props: {
        mode: 'multiple',
        notFoundContent: null,
      },
      sync: false,
      attachTo: 'body',
    });
    await asyncExpect(() => {
      wrapper.find('.ant-select').trigger('click');
    });

    await asyncExpect(() => {
      expect($$('.ant-select-dropdown-menu-item').length).toBe(0);
    });
  });

  it('should not have default notFoundContent when mode is combobox', async () => {
    const wrapper = mount(Select, {
      props: {
        mode: Select.SECRET_COMBOBOX_MODE_DO_NOT_USE,
      },
      sync: false,
      attachTo: 'body',
    });
    await asyncExpect(() => {
      wrapper.find('.ant-select').trigger('click');
    });

    await asyncExpect(() => {
      expect($$('.ant-select-dropdown-menu-item').length).toBe(0);
    });
  });

  it('should not have notFoundContent when mode is combobox and notFoundContent is set', async () => {
    const wrapper = mount(Select, {
      props: {
        mode: Select.SECRET_COMBOBOX_MODE_DO_NOT_USE,
        notFoundContent: 'not at all',
      },
      sync: false,
    });
    await asyncExpect(() => {
      wrapper.find('.ant-select').trigger('click');
    });

    await asyncExpect(() => {
      expect($$('.ant-select-dropdown-menu-item').length).toBe(1);
      expect($$('.ant-select-dropdown-menu-item')[0].innerHTML).toMatchSnapshot();
    });
  });

  it('should be controlled by open prop', async () => {
    const onDropdownVisibleChange = jest.fn();
    const wrapper = mount(
      {
        props: {
          open: {
            type: Boolean,
            default: true,
          },
        },
        render() {
          return (
            <Select open={this.open} onDropdownVisibleChange={onDropdownVisibleChange}>
              <Select.Option value="1">1</Select.Option>
            </Select>
          );
        },
      },
      { sync: false, attachTo: 'body' },
    );

    await asyncExpect(() => {
      expect(getStyle($$('.ant-select-dropdown')[0], 'display')).toBe('block');
    });
    await asyncExpect(() => {
      wrapper.find('.ant-select').trigger('click');
      expect(onDropdownVisibleChange).toHaveBeenLastCalledWith(false);
    });
    await asyncExpect(() => {
      expect(getStyle($$('.ant-select-dropdown')[0], 'display')).toBe('block');
      wrapper.setProps({ open: false });
    });

    await asyncExpect(() => {
      expect(getStyle($$('.ant-select-dropdown')[0], 'display')).toBe('none');
      wrapper.find('.ant-select').trigger('click');
      expect(onDropdownVisibleChange).toHaveBeenLastCalledWith(true);
      expect(getStyle($$('.ant-select-dropdown')[0], 'display')).toBe('none');
    }, 500);
  });

  describe('Select Custom Icons', () => {
    it('should support customized icons', () => {
      const wrapper = mount({
        render() {
          return (
            <Select
              removeIcon={<CloseOutlined />}
              clearIcon={<CloseOutlined />}
              menuItemSelectedIcon={<CloseOutlined />}
            >
              <Select.Option value="1">1</Select.Option>
            </Select>
          );
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
