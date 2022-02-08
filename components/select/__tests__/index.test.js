import { createApp, render, onErrorCaptured, h, nextTick } from 'vue';
import { mount, config } from '@vue/test-utils';
import { asyncExpect, sleep } from '../../../tests/utils';
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
      expect($$('.ant-empty-description')[0].innerHTML).toBe('No Data');
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

  describe('Select Event', () => {
    it('error thrown in [onSelect]', async () => {
      const ERROR_MSG = 'onSelect error';
      const onSelect = jest.fn().mockRejectedValue(ERROR_MSG);
      const onErrorCaptured = jest.fn();

      const wrapper = mount({
        errorCaptured(err) {
          onErrorCaptured(err);
          return false;
        },
        render() {
          return (
            <div>
              <Select getPopupContainer={n => n.parentNode} onSelect={onSelect}>
                <Select.Option value="1">option 1</Select.Option>
              </Select>
            </div>
          );
        },
      });

      // open dropdown
      wrapper.find('.ant-select-selector').trigger('mousedown');
      await sleep();
      expect(onErrorCaptured).not.toHaveBeenCalled();

      // select option
      wrapper.find('.ant-select-item-option').trigger('click');
      await sleep(0);
      expect(onErrorCaptured).toHaveBeenCalledTimes(1);
      expect(onErrorCaptured).toHaveBeenLastCalledWith(ERROR_MSG);
    });
  });
});
