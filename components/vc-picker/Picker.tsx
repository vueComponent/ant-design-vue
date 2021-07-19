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
import { formatValue, isEqual, parseValue } from './utils/dateUtil';
import getDataOrAriaProps, { toArray } from './utils/miscUtil';
import type { ContextOperationRefProps } from './PanelContext';
import PanelContext from './PanelContext';
import type { CustomFormat, PickerMode } from './interface';
import { getDefaultFormat, getInputSize, elementsContains } from './utils/uiUtil';
import usePickerInput from './hooks/usePickerInput';
import useTextValueMapping from './hooks/useTextValueMapping';
import useValueTexts from './hooks/useValueTexts';
import useHoverValue from './hooks/useHoverValue';
import {
  computed,
  CSSProperties,
  defineComponent,
  HtmlHTMLAttributes,
  ref,
  Ref,
  toRef,
  toRefs,
} from 'vue';
import { FocusEventHandler, MouseEventHandler } from '../_util/EventInterface';
import { VueNode } from '../_util/type';
import { AlignType } from '../vc-align/interface';
import useMergedState from '../_util/hooks/useMergedState';
import { locale } from 'dayjs';
import { warning } from '../vc-util/warning';

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

  // Events
  onChange?: (value: DateType | null, dateString: string) => void;
  onOpenChange?: (open: boolean) => void;
  onFocus?: FocusEventHandler;
  onBlur?: FocusEventHandler;
  onMouseDown?: MouseEventHandler;
  onMouseUp?: MouseEventHandler;
  onMouseEnter?: MouseEventHandler;
  onMouseLeave?: MouseEventHandler;
  onClick?: MouseEventHandler;
  onContextMenu?: MouseEventHandler;
  onKeyDown?: (event: KeyboardEvent, preventDefault: () => void) => void;

  // Internal
  /** @private Internal usage, do not use in production mode!!! */
  pickerRef?: Ref<PickerRefConfig>;

  // WAI-ARIA
  role?: string;
  name?: string;

  autocomplete?: string;
  direction?: 'ltr' | 'rtl';
} & HtmlHTMLAttributes;

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
      'picker',
      'format',
      'use12Hours',
      'value',
      'defaultValue',
      'open',
      'defaultOpen',
      'defaultOpenValue',
      'suffixIcon',
      'clearIcon',
      'disabled',
      'disabledDate',
      'placeholder',
      'getPopupContainer',
      'pickerRef',
      'panelRender',
      'onChange',
      'onOpenChange',
      'onFocus',
      'onBlur',
      'onMouseDown',
      'onMouseUp',
      'onMouseEnter',
      'onMouseLeave',
      'onContextMenu',
      'onClick',
      'onKeyDown',
      'onSelect',
      'direction',
      'autocomplete',
    ] as any,
    inheritAttrs: false,
    slots: [
      'suffixIcon',
      'clearIcon',
      'prevIcon',
      'nextIcon',
      'superPrevIcon',
      'superNextIcon',
      'panelRender',
    ],
    setup(props, { slots, attrs, expose }) {
      const inputRef = ref(null);
      const needConfirmButton = computed(
        () => (props.picker === 'date' && !!props.showTime) || props.picker === 'time',
      );

      // ============================= State =============================
      const formatList = computed(() =>
        toArray(getDefaultFormat(props.format, props.picker, props.showTime, props.use12Hours)),
      );

      // Panel ref
      const panelDivRef = ref(null);
      const inputDivRef = ref(null);

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
      const texts = useValueTexts(selectedValue, {
        formatList,
        generateConfig: toRef(props, 'generateConfig'),
        locale: toRef(props, 'locale'),
      });
      const valueTexts = computed(() => texts.value[0]);
      const firstValueText = computed(() => texts.value[1]);

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
              ? formatValue(newValue, { generateConfig, locale, format: formatList[0] })
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

      const forwardKeyDown = (e: KeyboardEvent) => {
        if (mergedOpen && operationRef.value && operationRef.value.onKeyDown) {
          // Let popup panel handle keyboard
          return operationRef.value.onKeyDown(e);
        }

        /* istanbul ignore next */
        /* eslint-disable no-lone-blocks */
        {
          warning(
            false,
            'Picker not correct forward KeyDown operation. Please help to fire issue about this.',
          );
          return false;
        }
      };

      const onInternalMouseUp: MouseEventHandler = (...args) => {
        if (props.onMouseUp) {
          props.onMouseUp(...args);
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
        forwardKeyDown,
        isClickOutside: target =>
          !elementsContains([panelDivRef.current, inputDivRef.current], target as HTMLElement),
        onSubmit: () => {
          if (props.disabledDate && props.disabledDate(selectedValue.value)) {
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
        onKeyDown: (e, preventDefault) => {
          props.onKeyDown?.(e, preventDefault);
        },
        onFocus: (e: FocusEvent) => {
          props.onFocus?.(e);
        },
        onBlur: (e: FocusEvent) => {
          props.onBlur?.(e);
        },
      });

      return () => {
        return null;
      };
    },
  });
}

export default Picker();
