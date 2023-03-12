import type { InputProps } from 'ant-design-vue';
import { ConfigProvider, Input, InputNumber, Select, theme } from 'ant-design-vue';
import classNames from 'ant-design-vue/es/_util/classNames';
import type { PropType } from 'vue';
import { defineComponent, watchEffect, watch, computed, toRefs, ref } from 'vue';
import { HexColorPicker, RgbaColorPicker } from '../vue-colorful';
import tinycolor from 'tinycolor2';
import makeStyle from './utils/makeStyle';

const { useToken } = theme;

const useStyle = makeStyle('ColorPanel', token => ({
  '.color-panel': {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    border: '1px solid rgba(0, 0, 0, 0.06)',
    boxShadow: token.boxShadow,
    width: 224,
    boxSizing: 'border-box',

    '.color-panel-mode': {
      display: 'flex',
      alignItems: 'center',
      marginBottom: 6,
    },
    '.color-panel-preview': {
      width: 24,
      height: 24,
      borderRadius: 4,
      boxShadow: '0 2px 3px -1px rgba(0,0,0,0.20), inset 0 0 0 1px rgba(0,0,0,0.09)',
      flex: 'none',
      overflow: 'hidden',
      background:
        'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAFpJREFUWAntljEKADAIA23p6v//qQ+wfUEcCu1yriEgp0FHRJSJcnehmmWm1Dv/lO4HIg1AAAKjTqm03ea88zMCCEDgO4HV5bS757f+7wRoAAIQ4B9gByAAgQ3pfiDmXmAeEwAAAABJRU5ErkJggg==) 0% 0% / 32px',
    },
    '.color-panel-preset-colors': {
      paddingTop: 12,
      display: 'flex',
      flexWrap: 'wrap',
      width: 200,
    },
    '.color-panel-preset-color-btn': {
      borderRadius: 4,
      width: 20,
      height: 20,
      border: 'none',
      outline: 'none',
      margin: 4,
      cursor: 'pointer',
      boxShadow: '0 2px 3px -1px rgba(0,0,0,0.20), inset 0 0 0 1px rgba(0,0,0,0.09)',
    },
    '.color-panel-mode-title': {
      color: token.colorTextPlaceholder,
      marginTop: 2,
      fontSize: 12,
      textAlign: 'center',
    },
    '.color-panel-rgba-input': {
      display: 'flex',
      alignItems: 'center',
      '&-part': {
        flex: 1,
        width: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

        '&-title': {
          color: token.colorTextPlaceholder,
          marginTop: 2,
          fontSize: 12,
        },

        '&:not(:last-child)': {
          marginRight: 4,
        },

        [`${token.rootCls}-input-number`]: {
          width: '100%',
          input: {
            fontSize: 12,
            padding: '0 4px',
          },
        },
      },
    },
  },
}));

export type HexColorInputProps = {
  value: string;
  onChange?: (value: string) => void;
  alpha?: boolean;
};

const getHexValue = (value: string, alpha: boolean = false) => {
  return alpha ? tinycolor(value).toHex8() : tinycolor(value).toHex();
};
const HexColorInput = defineComponent({
  name: 'HexColorInput',
  props: {
    value: { type: String },
    alpha: { type: Boolean },
    onChange: { type: Function as PropType<(value: string) => void> },
  },
  setup(props) {
    const { value, alpha } = toRefs(props);

    const hexValue = ref<string>(value.value);
    const focusRef = ref<boolean>(false);

    const handleChange: InputProps['onChange'] = e => {
      hexValue.value = e.target.value;
      props.onChange(getHexValue(e.target.value, alpha.value));
    };

    const handleBlur: InputProps['onBlur'] = (e: any) => {
      focusRef.value = false;
      hexValue.value = getHexValue(e.target.value, alpha.value);
    };

    const handleFocus = () => {
      focusRef.value = true;
    };

    watchEffect(() => {
      if (!focusRef.value) {
        hexValue.value = getHexValue(value.value, alpha.value);
      }
    });

    return () => {
      return (
        <div>
          <Input
            size="small"
            value={hexValue.value}
            onFocus={handleFocus}
            onChange={handleChange}
            onBlur={handleBlur}
            v-slots={{
              prefix: () => '#',
            }}
          />
          <div class="color-panel-mode-title">HEX{alpha.value ? '8' : ''}</div>
        </div>
      );
    };
  },
});

type RgbaColor = tinycolor.ColorFormats.RGBA;

export type RgbColorInputProps = {
  value?: RgbaColor;
  onChange?: (value: RgbaColor) => void;
  alpha?: boolean;
};

const RgbColorInput = defineComponent({
  name: 'RgbColorInput',
  props: {
    value: { type: Object as PropType<RgbaColor>, default: () => ({ r: 0, g: 0, b: 0, a: 1 }) },
    onChange: { type: Function as PropType<(value: RgbaColor) => void> },
    alpha: { type: Boolean },
  },
  setup(props) {
    const { value, alpha } = toRefs(props);

    watch(value, val => {
      props.onChange(val);
    });

    return () => {
      return (
        <div class="color-panel-rgba-input">
          <ConfigProvider theme={{ components: { InputNumber: { handleWidth: 12 } } }}>
            <div class="color-panel-rgba-input-part">
              <InputNumber min={0} max={255} size="small" v-model={[value.value.r, 'value']} />
              <div class="color-panel-mode-title">R</div>
            </div>
            <div class="color-panel-rgba-input-part">
              <InputNumber min={0} max={255} size="small" v-model={[value.value.g, 'value']} />
              <div class="color-panel-mode-title">G</div>
            </div>
            <div class="color-panel-rgba-input-part">
              <InputNumber min={0} max={255} size="small" v-model={[value.value.b, 'value']} />
              <div class="color-panel-mode-title">B</div>
            </div>
            {alpha.value && (
              <div class="color-panel-rgba-input-part">
                <InputNumber
                  min={0}
                  max={1}
                  step={0.01}
                  size="small"
                  v-model={[value.value.a, 'value']}
                />
                <div class="color-panel-mode-title">A</div>
              </div>
            )}
          </ConfigProvider>
        </div>
      );
    };
  },
});

export type ColorPanelProps = {
  color: string;
  onChange: (color: string) => void;
  alpha?: boolean;
};

const colorModes = ['HEX', 'HEX8', 'RGB', 'RGBA'] as const;

type ColorMode = (typeof colorModes)[number];

const getColorStr = (color: any, mode: ColorMode) => {
  switch (mode) {
    case 'HEX':
      return tinycolor(color).toHexString();
    case 'HEX8':
      return tinycolor(color).toHex8String();
    case 'RGBA':
    case 'RGB':
    default:
      return tinycolor(color).toRgbString();
  }
};
const ColorPanel = defineComponent({
  name: 'ColorPanel',
  props: {
    color: { type: String },
    onChange: { type: Function as PropType<(color: string) => void> },
    alpha: { type: Boolean },
  },
  inheritAttrs: false,
  setup(props, { attrs }) {
    const { color, alpha } = toRefs(props);

    const { token } = useToken();
    const [wrapSSR, hashId] = useStyle();
    const colorMode = ref<ColorMode>('HEX');

    const presetColors = computed(() => {
      return [
        token.value.blue,
        token.value.purple,
        token.value.cyan,
        token.value.green,
        token.value.magenta,
        token.value.pink,
        token.value.red,
        token.value.orange,
        token.value.yellow,
        token.value.volcano,
        token.value.geekblue,
        token.value.gold,
        token.value.lime,
        '#000',
      ];
    });

    const handleColorModeChange = (value: ColorMode) => {
      colorMode.value = value;
      props.onChange(getColorStr(color.value, value));
    };
    return () => {
      return wrapSSR(
        <div {...attrs} class={classNames(hashId.value, 'color-panel')}>
          {(colorMode.value === 'HEX' || colorMode.value === 'RGB') && (
            <HexColorPicker
              style={{ height: '160px' }}
              color={tinycolor(color.value).toHex()}
              onChange={value => {
                props.onChange(getColorStr(value, colorMode.value));
              }}
            />
          )}
          {(colorMode.value === 'RGBA' || colorMode.value === 'HEX8') && (
            <RgbaColorPicker
              style={{ height: '160px' }}
              color={tinycolor(color.value).toRgb()}
              onChange={value => {
                props.onChange(getColorStr(value, colorMode.value));
              }}
            />
          )}
          <div style={{ marginTop: '12px' }}>
            <div class="color-panel-mode">
              <div class="color-panel-preview">
                <div style={{ backgroundColor: color.value, width: '100%', height: '100%' }} />
              </div>
              <Select
                value={colorMode.value}
                onChange={handleColorModeChange}
                options={colorModes
                  .filter(item => alpha.value || item === 'HEX' || item === 'RGB')
                  .map(item => ({ value: item, key: item }))}
                size="small"
                bordered={false}
                dropdownMatchSelectWidth={false}
              />
            </div>
            {colorMode.value === 'HEX' && (
              <HexColorInput
                value={tinycolor(color.value).toHex()}
                onChange={v => props.onChange(tinycolor(v).toHexString())}
              />
            )}
            {colorMode.value === 'HEX8' && (
              <HexColorInput
                alpha
                value={tinycolor(color.value).toHex8()}
                onChange={v => props.onChange(tinycolor(v).toHex8String())}
              />
            )}
            {(colorMode.value === 'RGBA' || colorMode.value === 'RGB') && (
              <RgbColorInput
                alpha={colorMode.value === 'RGBA'}
                value={tinycolor(color.value).toRgb()}
                onChange={v => props.onChange(tinycolor(v).toRgbString())}
              />
            )}
          </div>
          <div class="color-panel-preset-colors">
            {presetColors.value.map(presetColor => (
              <button
                key={presetColor}
                class="color-panel-preset-color-btn"
                style={{ backgroundColor: presetColor }}
                onClick={() => props.onChange(presetColor)}
              />
            ))}
          </div>
        </div>,
      );
    };
  },
});

export default ColorPanel;
