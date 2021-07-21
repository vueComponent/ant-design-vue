import type { CSSProperties, PropType } from 'vue';
import type { PickerLocale } from '.';
import type { SizeType } from '../../config-provider';
import type { AlignType } from '../../vc-align/interface';
import type { PanelMode, PickerMode } from '../../vc-picker/interface';
import type { DateRender } from '../../vc-picker/panels/DatePanel/DateBody';
import type { SharedTimeProps } from '../../vc-picker/panels/TimePanel';
import type { VueNode } from '../../_util/type';

function commonProps<DateType>() {
  return {
    dropdownClassName: String,
    dropdownAlign: { type: Object as PropType<AlignType> },
    popupStyle: { type: Object as PropType<CSSProperties> },
    transitionName: String,
    placeholder: String,
    allowClear: { type: Boolean, default: undefined },
    autofocus: { type: Boolean, default: undefined },
    disabled: { type: Boolean, default: undefined },
    tabindex: Number,
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: undefined },
    /** Make input readOnly to avoid popup keyboard in mobile */
    inputReadOnly: { type: Boolean, default: undefined },
    // Value
    // format:  string | CustomFormat<DateType> | (string | CustomFormat<DateType>)[];
    // Render
    // suffixIcon?: VueNode;
    // clearIcon?: VueNode;
    // prevIcon?: VueNode;
    // nextIcon?: VueNode;
    // superPrevIcon?: VueNode;
    // superNextIcon?: VueNode;
    getPopupContainer: { type: Function as PropType<(node: HTMLElement) => HTMLElement> },
    panelRender: { type: Function as PropType<(originPanel: VueNode) => VueNode> },
    // // Events
    // onChange?: (value: DateType | null, dateString: string) => void;
    // onOpenChange?: (open: boolean) => void;
    // onFocus?: FocusEventHandler;
    // onBlur?: FocusEventHandler;
    // onMousedown?: MouseEventHandler;
    // onMouseup?: MouseEventHandler;
    // onMouseenter?: MouseEventHandler;
    // onMouseleave?: MouseEventHandler;
    // onClick?: MouseEventHandler;
    // onContextmenu?: MouseEventHandler;
    // onKeydown?: (event: KeyboardEvent, preventDefault: () => void) => void;
    // WAI-ARIA
    role: String,
    name: String,
    autocomplete: String,
    direction: { type: String as PropType<'ltr' | 'rtl'> },
    showToday: { type: Boolean, default: undefined },
    showTime: {
      type: [Boolean, Object] as PropType<boolean | SharedTimeProps<DateType>>,
      default: undefined,
    },
    locale: { type: Object as PropType<PickerLocale> },
    size: { type: String as PropType<SizeType> },
    bordered: { type: Boolean, default: undefined },
    dateRender: { type: Function as PropType<DateRender<DateType>> },
    disabledDate: { type: Function as PropType<(date: DateType) => boolean> },
    mode: { type: String as PropType<PanelMode> },
    picker: { type: String as PropType<PickerMode> },
  };
}

function datePickerProps<DateType>() {
  return {
    defaultPickerValue: { type: [String, Object] as PropType<DateType> },
  };
}

export { commonProps, datePickerProps };
