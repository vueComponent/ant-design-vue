import { mount } from '@vue/test-utils';
import ColorPicker from '..';
import type { ColorPickerProps } from '..';
import { sleep } from '../../../tests/utils';

describe('base ColorPickr', () => {
  const wrapper = mount(ColorPicker);
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  it('default dom', () => {
    expect(wrapper.html()).toMatchInlineSnapshot(`
      <div class="ant-color-picker-trigger">
        <div class="ant-color-picker-color-block">
          <div class="ant-color-picker-color-block-inner" style="background: rgb(22, 119, 255);"></div>
        </div>
        <!---->
      </div>
    `);
  });
  it('default color', () => {
    expect(wrapper.find('.ant-color-picker-color-block-inner').attributes()).toEqual({
      class: 'ant-color-picker-color-block-inner',
      style: 'background: rgb(22, 119, 255);',
    });
  });

  it('Should component disabled work', () => {
    const props: ColorPickerProps = {
      disabled: true,
    };
    const wrapper = mount(ColorPicker, {
      props,
    });

    expect(
      wrapper.find('.ant-color-picker-trigger').classes('ant-color-picker-trigger-disabled'),
    ).toBe(true);
  });

  it('Should component defaultValue work', () => {
    const props: ColorPickerProps = {
      defaultValue: '#000',
    };
    const wrapper = mount(ColorPicker, {
      props,
    });
    expect(wrapper.find('.ant-color-picker-color-block-inner').attributes('style')).toEqual(
      'background: rgb(0, 0, 0);',
    );
  });

  it('fire trigger to show panel', async () => {
    const wrapper = mount(ColorPicker, {
      sync: false,
      props: {
        value: '#1677FF',
      },
    });
    await wrapper.find('.ant-color-picker-trigger').trigger('click');
    expect(
      wrapper.find('.ant-color-picker-trigger').classes('ant-color-picker-trigger-active'),
    ).toBe(true);
    await sleep();
    const hexInput = document.querySelector(
      '.ant-color-picker-hex-input input',
    ) as HTMLInputElement;
    expect(hexInput?.value).toBe('1677FF');
    const handler = document.querySelector('.ant-color-picker-handler');
    expect(handler?.getAttribute('style')).toBe('background-color: rgb(22, 119, 255);');
  });

  it('Should Encoding formats, support HEX, HSB, RGB.', async () => {
    const wrapper = mount(ColorPicker, {
      props: {
        format: 'hsb',
        value: 'hsb(215, 91%, 100%)',
      },
    });
    await wrapper.find('.ant-color-picker-trigger').trigger('click');
    await sleep();
    expect(document.querySelector('.ant-select-selection-item')?.textContent).toBe('HSB');
  });
});
