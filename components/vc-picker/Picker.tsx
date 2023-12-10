/**
 * Removed:
 *  - getCalendarContainer: use `getPopupContainer` instead
 *  - onOk
 *
 * New Feature:
 *  - picker
 *  - allowEmpty
 *  - selectable
 *
 * Tips: Should add faq about `datetime` mode with `defaultValue`
 */

import type {
  PickerPanelBaseProps,
  PickerPanelDateProps,
  PickerPanelTimeProps,
} from './PickerPanel';
import PickerPanel from './PickerPanel';
import PickerTrigger from './PickerTrigger';
import PresetPanel from './PresetPanel';
import { formatValue, isEqual, parseValue } from './utils/dateUtil';
import getDataOrAriaProps, { toArray } from './utils/miscUtil';
import type { ContextOperationRefProps } from './PanelContext';
import { useProvidePanel } from './PanelContext';
import type { CustomFormat, PanelMode, PickerMode, PresetDate, RangeValue } from './interface';
import { getDefaultFormat, getInputSize, elementsContains } from './utils/uiUtil';
import usePickerInput from './hooks/usePickerInput';
import useTextValueMapping from './hooks/useTextValueMapping';
import useValueTexts from './hooks/useValueTexts';
import useHoverValue from './hooks/useHoverValue';
import usePresets from './hooks/usePresets';
import type { CSSProperties, HTMLAttributes, Ref } from 'vue';
import { computed, defineComponent, ref, toRef, watch } from 'vue';
import type { ChangeEvent, FocusEventHandler, MouseEventHandler } from '../_util/EventInterface';
import type { VueNode } from '../_util/type';
import type { AlignType } from '../vc-align/interface';
import useMergedState from '../_util/hooks/useMergedState';
import { warning } from '../vc-util/warning';
import classNames from '../_util/classNames';
import type { SharedTimeProps } from './panels/TimePanel';
import { legacyPropsWarning } from './utils/warnUtil';

export type PickerRefConfig = {
  focus: () => void;
  blur: () => void;
};

export type PickerSharedProps<DateType> = {
  dropdownClassName?: string;
  dropdownAlign?: AlignType;
  popupStyle?: CSSProperties;
  transitionName?: string;
  placeholder?: string;
  allowClear?: boolean;
  autofocus?: boolean;
  disabled?: boolean;
  tabindex?: number;
  open?: boolean;
  defaultOpen?: boolean;
  /** Make input readOnly to avoid popup keyboard in mobile */
  inputReadOnly?: boolean;
  id?: string;

  presets?: PresetDate<DateType>[];

  // Value
  format?: string | CustomFormat<DateType> | (string | CustomFormat<DateType>)[];

  // Render
  suffixIcon?: VueNode;
  clearIcon?: VueNode;
  prevIcon?: VueNode;
  nextIcon?: VueNode;
  superPrevIcon?: VueNode;
  superNextIcon?: VueNode;
  getPopupContainer?: (node: HTMLElement) => HTMLElement;
  panelRender?: (originPanel: VueNode) => VueNode;
  inputRender?: (props: HTMLAttributes) => VueNode;

  // Events
  onChange?: (value: DateType | null, dateString: string) => void;
  onOpenChange?: (open: boolean) => void;
  onPanelChange?: (values: RangeValue<DateType>, modes: [PanelMode, PanelMode]) => void;
  onFocus?: FocusEventHandler;
  onBlur?: FocusEventHandler;
  onMousedown?: MouseEventHandler;
  onMouseup?: MouseEventHandler;
  onMouseenter?: MouseEventHandler;
  onMouseleave?: MouseEventHandler;
  onClick?: MouseEventHandler;
  onContextmenu?: MouseEventHandler;
  onKeydown?: (event: KeyboardEvent, preventDefault: () => void) => void;

  // WAI-ARIA
  role?: string;
  name?: string;

  autocomplete?: string;
  direction?: 'ltr' | 'rtl';
  showToday?: boolean;
  showTime?: boolean | SharedTimeProps<DateType>;
};

type OmitPanelProps<Props> = Omit<
  Props,
  'onChange' | 'hideHeader' | 'pickerValue' | 'onPickerValueChange'
>;

export type PickerBaseProps<DateType> = {} & PickerSharedProps<DateType> &
  OmitPanelProps<PickerPanelBaseProps<DateType>>;

export type PickerDateProps<DateType> = {} & PickerSharedProps<DateType> &
  OmitPanelProps<PickerPanelDateProps<DateType>>;

export type PickerTimeProps<DateType> = {
  picker: 'time';
  /**
   * @deprecated Please use `defaultValue` directly instead
   * since `defaultOpenValue` will confuse user of current value status
   */
  defaultOpenValue?: DateType;
} & PickerSharedProps<DateType> &
  Omit<OmitPanelProps<PickerPanelTimeProps<DateType>>, 'format'>;

export type PickerProps<DateType> =
  | PickerBaseProps<DateType>
  | PickerDateProps<DateType>
  | PickerTimeProps<DateType>;

// TMP type to fit for ts 3.9.2
type OmitType<DateType> = Omit<PickerBaseProps<DateType>, 'picker'> &
  Omit<PickerDateProps<DateType>, 'picker'> &
  Omit<PickerTimeProps<DateType>, 'picker'>;
type MergedPickerProps<DateType> = {
  picker?: PickerMode;
} & OmitType<DateType>;

function Picker<DateType>() {
  return defineComponent<MergedPickerProps<DateType>>({
    name: 'Picker',
    inheritAttrs: false,
    props: [
      'prefixCls',
      'id',
      'tabindex',
      'dropdownClassName',
      'dropdownAlign',
      'popupStyle',
      'transitionName',
      'generateConfig',
      'locale',
      'inputReadOnly',
      'allowClear',
      'autofocus',
      'showTime',
      'showNow',
      'showHour',
      'showMinute',
      'showSecond',
      'picker',
      'format',
      'use12Hours',
      'value',
      'defaultValue',
      'open',
      'defaultOpen',
      'defaultOpenValue',
      'suffixIcon',
      'presets',
      'clearIcon',
      'disabled',
      'disabledDate',
      'placeholder',
      'getPopupContainer',
      'panelRender',
      'inputRender',
      'onChange',
      'onOpenChange',
      'onPanelChange',
      'onFocus',
      'onBlur',
      'onMousedown',
      'onMouseup',
      'onMouseenter',
      'onMouseleave',
      'onContextmenu',
      'onClick',
      'onKeydown',
      'onSelect',
      'direction',
      'autocomplete',
      'showToday',
      'renderExtraFooter',
      'dateRender',
      'minuteStep',
      'hourStep',
      'secondStep',
      'hideDisabledOptions',
    ] as any,
    setup(props, { attrs, expose }) {
      const inputRef = ref(null);
      const presets = computed(() => props.presets);
      const presetList = usePresets(presets);
      const picker = computed(() => props.picker ?? 'date');
      const needConfirmButton = computed(
        () => (picker.value === 'date' && !!props.showTime) || picker.value === 'time',
      );
      // ============================ Warning ============================
      if (process.env.NODE_ENV !== 'production') {
        legacyPropsWarning(props);
      }
      // ============================= State =============================
      const formatList = computed(() =>
        toArray(getDefaultFormat(props.format, picker.value, props.showTime, props.use12Hours)),
      );

      // Panel ref
      const panelDivRef = ref<HTMLDivElement>(null);
      const inputDivRef = ref<HTMLDivElement>(null);
      const containerRef = ref<HTMLDivElement>(null);

      // Real value
      const [mergedValue, setInnerValue] = useMergedState<DateType>(null, {
        value: toRef(props, 'value'),
        defaultValue: props.defaultValue,
      });
      const selectedValue = ref(mergedValue.value) as Ref<DateType>;
      const setSelectedValue = (val: DateType) => {
        selectedValue.value = val;
      };

      // Operation ref
      const operationRef = ref<ContextOperationRefProps>(null);

      // Open
      const [mergedOpen, triggerInnerOpen] = useMergedState(false, {
        value: toRef(props, 'open'),
        defaultValue: props.defaultOpen,
        postState: postOpen => (props.disabled ? false : postOpen),
        onChange: newOpen => {
          if (props.onOpenChange) {
            props.onOpenChange(newOpen);
          }

          if (!newOpen && operationRef.value && operationRef.value.onClose) {
            operationRef.value.onClose();
          }
        },
      });

      // ============================= Text ==============================
      const [valueTexts, firstValueText] = useValueTexts(selectedValue, {
        formatList,
        generateConfig: toRef(props, 'generateConfig'),
        locale: toRef(props, 'locale'),
      });
      const [text, triggerTextChange, resetText] = useTextValueMapping({
        valueTexts,
        onTextChange: newText => {
          const inputDate = parseValue(newText, {
            locale: props.locale,
            formatList: formatList.value,
            generateConfig: props.generateConfig,
          });
          if (inputDate && (!props.disabledDate || !props.disabledDate(inputDate))) {
            setSelectedValue(inputDate);
          }
        },
      });

      // ============================ Trigger ============================
      const triggerChange = (newValue: DateType | null) => {
        const { onChange, generateConfig, locale } = props;
        setSelectedValue(newValue);
        setInnerValue(newValue);

        if (onChange && !isEqual(generateConfig, mergedValue.value, newValue)) {
          onChange(
            newValue,
            newValue
              ? formatValue(newValue, { generateConfig, locale, format: formatList.value[0] })
              : '',
          );
        }
      };

      const triggerOpen = (newOpen: boolean) => {
        if (props.disabled && newOpen) {
          return;
        }
        triggerInnerOpen(newOpen);
      };

      const forwardKeydown = (e: KeyboardEvent) => {
        if (mergedOpen.value && operationRef.value && operationRef.value.onKeydown) {
          // Let popup panel handle keyboard
          return operationRef.value.onKeydown(e);
        }

        /* istanbul ignore next */
        /* eslint-disable no-lone-blocks */
        {
          warning(
            false,
            'Picker not correct forward Keydown operation. Please help to fire issue about this.',
          );
          return false;
        }
      };

      const onInternalMouseup: MouseEventHandler = (...args) => {
        if (props.onMouseup) {
          props.onMouseup(...args);
        }

        if (inputRef.value) {
          inputRef.value.focus();
          triggerOpen(true);
        }
      };

      // ============================= Input =============================
      const [inputProps, { focused, typing }] = usePickerInput({
        blurToCancel: needConfirmButton,
        open: mergedOpen,
        value: text,
        triggerOpen,
        forwardKeydown,
        isClickOutside: target =>
          !elementsContains(
            [panelDivRef.value, inputDivRef.value, containerRef.value],
            target as HTMLElement,
          ),
        onSubmit: () => {
          if (
            // When user typing disabledDate with keyboard and enter, this value will be empty
            !selectedValue.value ||
            // Normal disabled check
            (props.disabledDate && props.disabledDate(selectedValue.value))
          ) {
            return false;
          }

          triggerChange(selectedValue.value);
          triggerOpen(false);
          resetText();
          return true;
        },
        onCancel: () => {
          triggerOpen(false);
          setSelectedValue(mergedValue.value);
          resetText();
        },
        onKeydown: (e, preventDefault) => {
          props.onKeydown?.(e, preventDefault);
        },
        onFocus: (e: FocusEvent) => {
          props.onFocus?.(e);
        },
        onBlur: (e: FocusEvent) => {
          props.onBlur?.(e);
        },
      });

      // ============================= Sync ==============================
      // Close should sync back with text value
      watch([mergedOpen, valueTexts], () => {
        if (!mergedOpen.value) {
          setSelectedValue(mergedValue.value);

          if (!valueTexts.value.length || valueTexts.value[0] === '') {
            triggerTextChange('');
          } else if (firstValueText.value !== text.value) {
            resetText();
          }
        }
      });

      // Change picker should sync back with text value
      watch(picker, () => {
        if (!mergedOpen.value) {
          resetText();
        }
      });

      // Sync innerValue with control mode
      watch(mergedValue, () => {
        // Sync select value
        setSelectedValue(mergedValue.value);
      });

      const [hoverValue, onEnter, onLeave] = useHoverValue(text, {
        formatList,
        generateConfig: toRef(props, 'generateConfig'),
        locale: toRef(props, 'locale'),
      });

      const onContextSelect = (date: DateType, type: 'key' | 'mouse' | 'submit') => {
        if (type === 'submit' || (type !== 'key' && !needConfirmButton.value)) {
          // triggerChange will also update selected values
          triggerChange(date);
          triggerOpen(false);
        }
      };

      useProvidePanel({
        operationRef,
        hideHeader: computed(() => picker.value === 'time'),
        onSelect: onContextSelect,
        open: mergedOpen,
        defaultOpenValue: toRef(props, 'defaultOpenValue'),
        onDateMouseenter: onEnter,
        onDateMouseleave: onLeave,
      });

      expose({
        focus: () => {
          if (inputRef.value) {
            inputRef.value.focus();
          }
        },
        blur: () => {
          if (inputRef.value) {
            inputRef.value.blur();
          }
        },
      });

      return () => {
        const {
          prefixCls = 'rc-picker',
          id,
          tabindex,
          dropdownClassName,
          dropdownAlign,
          popupStyle,
          transitionName,
          generateConfig,
          locale,
          inputReadOnly,
          allowClear,
          autofocus,
          picker = 'date',
          defaultOpenValue,
          suffixIcon,
          clearIcon,
          disabled,
          placeholder,
          getPopupContainer,
          panelRender,
          onMousedown,
          onMouseenter,
          onMouseleave,
          onContextmenu,
          onClick,
          onSelect,
          direction,
          autocomplete = 'off',
        } = props;
        // ============================= Panel =============================
        const panelProps = {
          // Remove `picker` & `format` here since TimePicker is little different with other panel
          ...(props as Omit<MergedPickerProps<DateType>, 'picker' | 'format'>),
          ...attrs,
          class: classNames({
            [`${prefixCls}-panel-focused`]: !typing.value,
          }),
          style: undefined,
          pickerValue: undefined,
          onPickerValueChange: undefined,
          onChange: null,
        };

        let panelNode: VueNode = (
          <div class={`${prefixCls}-panel-layout`}>
            <PresetPanel
              prefixCls={prefixCls}
              presets={presetList.value}
              onClick={nextValue => {
                triggerChange(nextValue);
                triggerOpen(false);
              }}
            />
            <PickerPanel
              {...panelProps}
              generateConfig={generateConfig}
              value={selectedValue.value}
              locale={locale}
              tabindex={-1}
              onSelect={date => {
                onSelect?.(date);
                setSelectedValue(date);
              }}
              direction={direction}
              onPanelChange={(viewDate, mode) => {
                const { onPanelChange } = props;
                onLeave(true);
                onPanelChange?.(viewDate, mode);
              }}
            />
          </div>
        );

        if (panelRender) {
          panelNode = panelRender(panelNode);
        }

        const panel = (
          <div
            class={`${prefixCls}-panel-container`}
            ref={panelDivRef}
            onMousedown={e => {
              e.preventDefault();
            }}
          >
            {panelNode}
          </div>
        );

        let suffixNode: VueNode;
        if (suffixIcon) {
          suffixNode = <span class={`${prefixCls}-suffix`}>{suffixIcon}</span>;
        }

        let clearNode: VueNode;
        if (allowClear && mergedValue.value && !disabled) {
          clearNode = (
            <span
              onMousedown={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseup={e => {
                e.preventDefault();
                e.stopPropagation();
                triggerChange(null);
                triggerOpen(false);
              }}
              class={`${prefixCls}-clear`}
              role="button"
            >
              {clearIcon || <span class={`${prefixCls}-clear-btn`} />}
            </span>
          );
        }

        const mergedInputProps: HTMLAttributes = {
          id,
          tabindex,
          disabled,
          readonly: inputReadOnly || typeof formatList.value[0] === 'function' || !typing.value,
          value: hoverValue.value || text.value,
          onInput: (e: ChangeEvent) => {
            triggerTextChange(e.target.value);
          },
          autofocus,
          placeholder,
          ref: inputRef,
          title: text.value,
          ...inputProps.value,
          size: getInputSize(picker, formatList.value[0], generateConfig),
          ...getDataOrAriaProps(props),
          autocomplete,
        };

        const inputNode = props.inputRender ? (
          props.inputRender(mergedInputProps)
        ) : (
          <input {...mergedInputProps} />
        );

        // ============================ Warning ============================
        if (process.env.NODE_ENV !== 'production') {
          warning(
            !defaultOpenValue,
            '`defaultOpenValue` may confuse user for the current value status. Please use `defaultValue` instead.',
          );
        }

        // ============================ Return =============================

        const popupPlacement = direction === 'rtl' ? 'bottomRight' : 'bottomLeft';
        return (
          <div
            ref={containerRef}
            class={classNames(prefixCls, attrs.class, {
              [`${prefixCls}-disabled`]: disabled,
              [`${prefixCls}-focused`]: focused.value,
              [`${prefixCls}-rtl`]: direction === 'rtl',
            })}
            style={attrs.style as CSSProperties}
            onMousedown={onMousedown}
            onMouseup={onInternalMouseup}
            onMouseenter={onMouseenter}
            onMouseleave={onMouseleave}
            onContextmenu={onContextmenu}
            onClick={onClick}
          >
            <div
              class={classNames(`${prefixCls}-input`, {
                [`${prefixCls}-input-placeholder`]: !!hoverValue.value,
              })}
              ref={inputDivRef}
            >
              {inputNode}
              {suffixNode}
              {clearNode}
            </div>
            <PickerTrigger
              visible={mergedOpen.value}
              popupStyle={popupStyle}
              prefixCls={prefixCls}
              dropdownClassName={dropdownClassName}
              dropdownAlign={dropdownAlign}
              getPopupContainer={getPopupContainer}
              transitionName={transitionName}
              popupPlacement={popupPlacement}
              direction={direction}
              v-slots={{
                popupElement: () => panel,
              }}
            >
              <div
                style={{
                  pointerEvents: 'none',
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                }}
              ></div>
            </PickerTrigger>
          </div>
        );
      };
    },
  });
}
export default Picker<any>();
