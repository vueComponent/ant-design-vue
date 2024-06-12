import { cloneElement } from '../../_util/vnode';
import type { ExtractPropTypes, PropType, VNode } from 'vue';
import { defineComponent, inject } from 'vue';
import PropTypes from '../../_util/vue-types';
import classNames from '../../_util/classNames';
import type {
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  ChangeEventHandler,
  CompositionEventHandler,
  ClipboardEventHandler,
} from '../../_util/EventInterface';
import BaseInput from '../../_util/BaseInput';

export const inputProps = {
  inputRef: PropTypes.any,
  prefixCls: String,
  id: String,
  inputElement: PropTypes.VueNode,
  disabled: { type: Boolean, default: undefined },
  autofocus: { type: Boolean, default: undefined },
  autocomplete: String,
  editable: { type: Boolean, default: undefined },
  activeDescendantId: String,
  value: String,
  open: { type: Boolean, default: undefined },
  tabindex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** Pass accessibility props to input */
  attrs: PropTypes.object,
  onKeydown: { type: Function as PropType<KeyboardEventHandler> },
  onMousedown: { type: Function as PropType<MouseEventHandler> },
  onChange: { type: Function as PropType<ChangeEventHandler> },
  onPaste: { type: Function as PropType<ClipboardEventHandler> },
  onCompositionstart: { type: Function as PropType<CompositionEventHandler> },
  onCompositionend: { type: Function as PropType<CompositionEventHandler> },
  onFocus: { type: Function as PropType<FocusEventHandler> },
  onBlur: { type: Function as PropType<FocusEventHandler> },
};

export type InputProps = Partial<ExtractPropTypes<typeof inputProps>>;

const Input = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'SelectInput',
  inheritAttrs: false,
  props: inputProps,
  setup(props) {
    let blurTimeout = null;
    const VCSelectContainerEvent = inject('VCSelectContainerEvent') as any;
    return () => {
      const {
        prefixCls,
        id,
        inputElement,
        disabled,
        tabindex,
        autofocus,
        autocomplete,
        editable,
        activeDescendantId,
        value,
        onKeydown,
        onMousedown,
        onChange,
        onPaste,
        onCompositionstart,
        onCompositionend,
        onFocus,
        onBlur,
        open,
        inputRef,
        attrs,
      } = props;

      let inputNode: any = inputElement || <BaseInput></BaseInput>;

      const inputProps = inputNode.props || {};
      const {
        onKeydown: onOriginKeyDown,
        onInput: onOriginInput,
        onFocus: onOriginFocus,
        onBlur: onOriginBlur,
        onMousedown: onOriginMouseDown,
        onCompositionstart: onOriginCompositionStart,
        onCompositionend: onOriginCompositionEnd,
        style,
      } = inputProps;
      inputNode = cloneElement(
        inputNode,
        Object.assign(
          {
            type: 'search',
            ...inputProps,
            id,
            ref: inputRef,
            disabled,
            tabindex,
            lazy: false,
            autocomplete: autocomplete || 'off',
            autofocus,
            class: classNames(`${prefixCls}-selection-search-input`, inputNode?.props?.class),

            role: 'combobox',
            'aria-expanded': open,
            'aria-haspopup': 'listbox',
            'aria-owns': `${id}_list`,
            'aria-autocomplete': 'list',
            'aria-controls': `${id}_list`,
            'aria-activedescendant': activeDescendantId,
            ...attrs,
            value: editable ? value : '',
            readonly: !editable,
            unselectable: !editable ? 'on' : null,
            style: { ...style, opacity: editable ? null : 0 },
            onKeydown: (event: KeyboardEvent) => {
              onKeydown(event);
              if (onOriginKeyDown) {
                onOriginKeyDown(event);
              }
            },
            onMousedown: (event: MouseEvent) => {
              onMousedown(event);
              if (onOriginMouseDown) {
                onOriginMouseDown(event);
              }
            },
            onInput: (event: Event) => {
              onChange(event);
              if (onOriginInput) {
                onOriginInput(event);
              }
            },
            onCompositionstart(event: CompositionEvent) {
              onCompositionstart(event);
              if (onOriginCompositionStart) {
                onOriginCompositionStart(event);
              }
            },
            onCompositionend(event: CompositionEvent) {
              onCompositionend(event);
              if (onOriginCompositionEnd) {
                onOriginCompositionEnd(event);
              }
            },
            onPaste,
            onFocus: (...args: any[]) => {
              clearTimeout(blurTimeout);
              onOriginFocus && onOriginFocus(args[0]);
              onFocus && onFocus(args[0]);
              VCSelectContainerEvent?.focus(args[0]);
            },
            onBlur: (...args: any[]) => {
              blurTimeout = setTimeout(() => {
                onOriginBlur && onOriginBlur(args[0]);
                onBlur && onBlur(args[0]);
                VCSelectContainerEvent?.blur(args[0]);
              }, 100);
            },
          },
          inputNode.type === 'textarea' ? {} : { type: 'search' },
        ),
        true,
        true,
      ) as VNode;
      return inputNode;
    };
  },
});

export default Input;
