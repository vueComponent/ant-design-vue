import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
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
    const wrapper = mount(
      {
        render() {
          return <Select mode="multiple" />;
        },
      },
      {
        sync: false,
        attachTo: 'body',
      },
    );
    await asyncExpect(() => {
      wrapper.findAll('.ant-select-selector')[0].element.dispatchEvent(new MouseEvent('mousedown'));
    });

    await asyncExpect(() => {
      expect($$('.ant-select-item-option').length).toBe(0);
      expect($$('.ant-empty-description')[0].innerHTML).toBe('No data');
    }, 100);
  });

  it('should support set notFoundContent to null', async () => {
    const wrapper = mount(
      {
        render() {
          return <Select mode="multiple" notFoundContent={null} />;
        },
      },
      {
        sync: false,
        attachTo: 'body',
      },
    );
    await asyncExpect(() => {
      wrapper.findAll('.ant-select-selector')[0].element.dispatchEvent(new MouseEvent('mousedown'));
    });

    await asyncExpect(() => {
      expect($$('.ant-select-item-option').length).toBe(0);
    });
  });

  it('should not have default notFoundContent when mode is combobox', async () => {
    const wrapper = mount(
      {
        render() {
          return <Select mode={Select.SECRET_COMBOBOX_MODE_DO_NOT_USE} />;
        },
      },
      {
        sync: false,
        attachTo: 'body',
      },
    );
    await asyncExpect(() => {
      wrapper.findAll('.ant-select-selector')[0].element.dispatchEvent(new MouseEvent('mousedown'));
    });

    await asyncExpect(() => {
      expect($$('.ant-select-item-option').length).toBe(0);
    });
  });

  it('should not have notFoundContent when mode is combobox and notFoundContent is set', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <Select mode={Select.SECRET_COMBOBOX_MODE_DO_NOT_USE} notFoundContent="not at all" />
          );
        },
      },
      {
        sync: false,
      },
    );
    await asyncExpect(() => {
      wrapper.findAll('.ant-select-selector')[0].element.dispatchEvent(new MouseEvent('mousedown'));
    });

    await asyncExpect(() => {
      expect($$('.ant-select-item-option').length).toBe(0);
      expect($$('.ant-select-item-empty').length).toBe(1);
      // expect($$('.ant-select-item-option')[0].innerHTML).toMatchSnapshot();
    }, 100);
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
    }, 100);
    await asyncExpect(() => {
      wrapper.findAll('.ant-select-selector')[0].element.dispatchEvent(new MouseEvent('mousedown'));
    });
    await asyncExpect(() => {
      expect(onDropdownVisibleChange).toHaveBeenLastCalledWith(false);
    });
    await asyncExpect(() => {
      expect(getStyle($$('.ant-select-dropdown')[0], 'display')).toBe('block');
      wrapper.setProps({ open: false });
    });

    await asyncExpect(() => {
      expect(getStyle($$('.ant-select-dropdown')[0], 'display')).toBe('none');
      wrapper.findAll('.ant-select-selector')[0].element.dispatchEvent(new MouseEvent('mousedown'));
      expect(onDropdownVisibleChange).toHaveBeenLastCalledWith(true);
      expect(getStyle($$('.ant-select-dropdown')[0], 'display')).toBe('none');
    }, 500);
  });

  it('The select trigger should be blur when the panel is closed.', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <Select
              dropdownRender={() => {
                return <input id="dropdownRenderInput" />;
              }}
            />
          );
        },
      },
      {
        sync: false,
        attachTo: 'body',
      },
    );
    await asyncExpect(async () => {
      await wrapper.find('.ant-select-selector').trigger('mousedown');
      await wrapper.find('.ant-select-selection-search-input').trigger('focus');
    });

    await asyncExpect(async () => {
      const el = wrapper.find('.ant-select');

      expect(el.classes()).toContain('ant-select-focused');
      $$('#dropdownRenderInput')[0].focus();

      expect(el.classes()).toContain('ant-select-focused');

      document.body.dispatchEvent(
        new MouseEvent('mousedown', {
          bubbles: true,
          cancelable: true,
          view: window,
        }),
      );
    }, 100);

    await asyncExpect(async () => {
      const el = wrapper.find('.ant-select');
      expect(el.classes()).not.toContain('ant-select-focused');
    }, 200);
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
