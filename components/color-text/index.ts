import { defineComponent, h, computed, inject, PropType } from 'vue';
import { withInstall } from '../_util/type';

import { ConfigProviderProps } from '../config-provider/index';
import { isArray } from '../_util/util';

type Colors = string[];
type Options = Array<string[] | string | number | number[]>;

export interface ColorTextConfig {
  options?: Options;
  colors?: Colors;
}

const themeColors = ['primary', 'success', 'warning', 'error', 'default'];

const getOptionsIndex = (
  arr: Array<string[] | string | number | number[]>,
  target: string | number,
) => {
  let targetIndex = -1;

  for (const [index, value] of arr.entries()) {
    if (isArray(value)) {
      if (value.some(item => item === target)) {
        targetIndex = index;
        break;
      }
    } else {
      if (target === value) {
        targetIndex = index;
        break;
      }
    }
  }

  return targetIndex;
};

const ColorText = defineComponent({
  name: 'AColorText',
  props: {
    tag: {
      type: String,
      default: 'span',
    },
    type: {
      type: String,
      validator: (val: string) => themeColors.includes(val),
    },
    colors: {
      type: Array as PropType<Colors>,
    },
    options: {
      type: Array as PropType<Options>,
    },
    value: {
      type: [String, Number],
    },
  },
  setup(props, { slots }) {
    const typeClass = computed(() => `ant-color-text-${props.type || 'default'}`);

    const configProvider = inject<ConfigProviderProps>('configProvider', {});

    const targetColors = computed(() => {
      const isConfigProviderColors =
        configProvider?.colorText && isArray(configProvider?.colorText.colors);
      return (
        props.colors || (isConfigProviderColors ? configProvider.colorText.colors : themeColors)
      );
    });

    const targetOptions = computed(() => {
      const isConfigProviderOptions =
        configProvider?.colorText && isArray(configProvider?.colorText.options);
      return (
        props.options || (isConfigProviderOptions ? configProvider.colorText.options : themeColors)
      );
    });

    const colorValue = computed(() => {
      const colorsIndex = getOptionsIndex(targetOptions.value, props.value);

      const targetColor = targetColors.value[colorsIndex];

      if (!targetColor) {
        return {
          type: 'class',
          value: typeClass.value,
        };
      }

      if (targetColor.indexOf('#') !== -1 || targetColor.indexOf('rgb') !== -1) {
        return {
          type: 'style',
          value: targetColor,
        };
      }

      if (themeColors.includes(targetColor)) {
        return {
          type: 'class',
          value: `ant-color-text-${targetColor}`,
        };
      }

      return {
        type: 'class',
        value: typeClass.value,
      };
    });

    const defaultProps = computed(() => {
      const defaultProps = {
        class: ['ant-color-text'] as any[],
        style: {},
      };

      if (props.type) {
        defaultProps.class = [...defaultProps.class, typeClass.value];
      } else if (colorValue.value.type === 'class') {
        defaultProps.class = [...defaultProps.class, colorValue.value.value];
      } else {
        defaultProps.style = { color: colorValue.value.value };
      }

      return defaultProps;
    });

    return () => {
      return h(props.tag, defaultProps.value, slots?.default());
    };
  },
});

export default withInstall(ColorText);
