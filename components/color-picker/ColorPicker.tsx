import { computed, defineComponent, shallowRef, watch } from 'vue';
import PropTypes from '../_util/vue-types';
import type { HsbaColorType } from '../vc-color-picker';
import type { PopoverProps } from '../popover';
import Popover from '../popover';
import theme from '../theme';
import ColorPickerPanel from './ColorPickerPanel';
import type { Color } from './color';
import ColorTrigger from './components/ColorTrigger';
import useColorState from './hooks/useColorState';
import type {
  ColorFormat,
  ColorPickerBaseProps,
  PresetsItem,
  TriggerPlacement,
  TriggerType,
} from './interface';
import useStyle from './style/index';
import { generateColor } from './util';
import type { CSSProperties, ComputedRef, ExtractPropTypes, PropType } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useMergedState from '../_util/hooks/useMergedState';
import classNames from '../_util/classNames';

const colorPickerProps = () => ({
  value: {
    type: [String, Object] as PropType<string | Color>,
    default: undefined,
  },
  defaultValue: {
    type: [String, Object] as PropType<string | Color>,
    default: undefined,
  },
  open: PropTypes.looseBool,
  disabled: PropTypes.looseBool,
  placement: {
    type: String as PropType<TriggerPlacement>,
    default: 'bottomLeft',
  },
  trigger: {
    type: String as PropType<TriggerType>,
    default: 'click',
  },
  format: {
    type: String as PropType<ColorFormat>,
    default: 'hex',
  },
  allowClear: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  presets: {
    type: Array as PropType<PresetsItem[]>,
    default: undefined,
  },
  arrow: {
    type: [Boolean, Object] as PropType<boolean | { pointAtCenter: boolean }>,
    default: true,
  },
  styles: {
    type: Object as PropType<{ popup?: CSSProperties }>,
    default: () => ({}),
  },
  rootClassName: PropTypes.string,
  onOpenChange: {
    type: Function as PropType<(open: boolean) => void>,
    default: () => {},
  },
  onFormatChange: {
    type: Function as PropType<(format: ColorFormat) => void>,
    default: () => {},
  },
  onChange: {
    type: Function as PropType<(value: Color, hex: string) => void>,
    default: () => {},
  },
  getPopupContainer: {
    type: Function as PropType<PopoverProps['getPopupContainer']>,
    default: undefined,
  },
  autoAdjustOverflow: {
    type: Boolean as PropType<PopoverProps['autoAdjustOverflow']>,
    default: true,
  },
});

export type ColorPickerProps = Partial<ExtractPropTypes<ReturnType<typeof colorPickerProps>>>;

const ColorPicker = defineComponent({
  name: 'AColorPicker',
  inheritAttrs: false,
  props: colorPickerProps(),
  setup(props, { slots, attrs, emit }) {
    const { prefixCls, getPopupContainer, direction } = useConfigInject('color-picker', props);
    const { token } = theme.useToken();
    const value = computed(() => props.value);
    const [colorValue, setColorValue] = useColorState(token.value.colorPrimary, {
      value,
      defaultValue: props.defaultValue,
    });
    const open = computed(() => props.open);
    const [popupOpen, setPopupOpen] = useMergedState(false, {
      value: open,
      postState: openData => !props.disabled && openData,
      onChange: props.onOpenChange,
    });

    const colorCleared = shallowRef(false);

    const [wrapSSR, hashId] = useStyle(prefixCls);
    const handleClear = (clear: boolean) => {
      colorCleared.value = clear;
    };
    const handleChange = (data: Color, type?: HsbaColorType) => {
      let color: Color = generateColor(data);
      if (colorCleared.value) {
        colorCleared.value = false;
        const hsba = color.toHsb();
        // ignore alpha slider
        if (colorValue.value.toHsb().a === 0 && type !== 'alpha') {
          hsba.a = 1;
          color = generateColor(hsba);
        }
      }
      if (!props.value) {
        setColorValue(color);
      }
      emit('update:value', color, color.toHexString());
      emit('change', color, color.toHexString());
    };

    const popoverProps: ComputedRef<PopoverProps> = computed(() => ({
      open: popupOpen.value,
      trigger: props.trigger,
      placement: props.placement,
      arrow: props.arrow,
      rootClassName: props.rootClassName,
      getPopupContainer: getPopupContainer.value,
      autoAdjustOverflow: props.autoAdjustOverflow,
    }));
    const colorBaseProps: ComputedRef<ColorPickerBaseProps> = computed(() => ({
      prefixCls: prefixCls.value,
      color: colorValue.value,
      allowClear: props.allowClear,
      colorCleared: colorCleared.value,
      disabled: props.disabled,
      presets: props.presets,
      format: props.format,
      onFormatChange: props.onFormatChange,
    }));
    watch(colorCleared, (val, oldVal) => {
      if (!oldVal && val) {
        setPopupOpen(false);
      }
    });
    return () => {
      const mergeRootCls = classNames(props.rootClassName, {
        [`${prefixCls.value}-rtl`]: direction,
      });
      const mergeCls = classNames(mergeRootCls, hashId.value);
      return wrapSSR(
        <Popover
          // @ts-ignore
          style={props.styles?.popup}
          onOpenChange={setPopupOpen}
          content={
            <ColorPickerPanel
              {...colorBaseProps.value}
              onChange={handleChange}
              onClear={handleClear}
            />
          }
          overlayClassName={prefixCls.value}
          {...popoverProps.value}
        >
          {slots.children?.() || (
            <ColorTrigger
              open={popupOpen.value}
              class={mergeCls}
              style={attrs.style}
              color={colorValue.value}
              prefixCls={prefixCls.value}
              disabled={props.disabled}
              colorCleared={colorCleared.value}
            />
          )}
        </Popover>,
      );
    };
  },
});

export default ColorPicker;
