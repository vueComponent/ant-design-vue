import { cloneElement } from '../../_util/vnode';
import {
  defineComponent,
  getCurrentInstance,
  inject,
  onMounted,
  VNode,
  VNodeChild,
  withDirectives,
} from 'vue';
import PropTypes from '../../_util/vue-types';
import { RefObject } from '../../_util/createRef';
import antInput from '../../_util/antInputDirective';

interface InputProps {
  prefixCls: string;
  id: string;
  inputElement: VNodeChild;
  disabled: boolean;
  autofocus: boolean;
  autocomplete: string;
  editable: boolean;
  accessibilityIndex: number;
  value: string;
  open: boolean;
  tabindex: number;
  /** Pass accessibility props to input */
  attrs: object;
  inputRef: RefObject;
  onKeydown: EventHandlerNonNull;
  onMousedown: EventHandlerNonNull;
  onChange: EventHandlerNonNull;
  onPaste: EventHandlerNonNull;
  onCompositionstart: EventHandlerNonNull;
  onCompositionend: EventHandlerNonNull;
}

const Input = defineComponent<InputProps, { VCSelectContainerEvent: any; blurTimeout: any }>({
  name: 'Input',
  inheritAttrs: false,
  setup(props) {
    if (process.env.NODE_ENV === 'test') {
      onMounted(() => {
        const ins = getCurrentInstance();
        if (props.autofocus) {
          if (ins.vnode && ins.vnode.el) {
            ins.vnode.el.focus();
          }
        }
      });
    }
    return {
      blurTimeout: null,
      VCSelectContainerEvent: inject('VCSelectContainerEvent'),
    };
  },
  render() {
    const {
      prefixCls,
      id,
      inputElement,
      disabled,
      tabindex,
      autofocus,
      autocomplete,
      editable,
      accessibilityIndex,
      value,
      onKeydown,
      onMousedown,
      onChange,
      onPaste,
      onCompositionstart,
      onCompositionend,
      open,
      inputRef,
      attrs,
    } = this.$props as InputProps;
    let inputNode: any = withDirectives((inputElement || <input />) as VNode, [[antInput]]);

    const inputProps = inputNode.props || {};
    const {
      onKeydown: onOriginKeyDown,
      onInput: onOriginInput,
      onMousedown: onOriginMouseDown,
      onCompositionstart: onOriginCompositionStart,
      onCompositionend: onOriginCompositionEnd,
      style,
    } = inputProps;
    inputNode = cloneElement(
      inputNode,
      Object.assign(
        {
          id,
          ref: inputRef,
          disabled,
          tabindex,
          autocomplete: autocomplete || 'off',
          autofocus,
          class: `${prefixCls}-selection-search-input`,
          style: { ...style, opacity: editable ? null : 0 },
          role: 'combobox',
          'aria-expanded': open,
          'aria-haspopup': 'listbox',
          'aria-owns': `${id}_list`,
          'aria-autocomplete': 'list',
          'aria-controls': `${id}_list`,
          'aria-activedescendant': `${id}_list_${accessibilityIndex}`,
          ...attrs,
          value: editable ? value : '',
          readonly: !editable,
          unselectable: !editable ? 'on' : null,
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
            clearTimeout(this.blurTimeout);
            this.VCSelectContainerEvent?.focus(args[0]);
          },
          onBlur: (...args: any[]) => {
            this.blurTimeout = setTimeout(() => {
              this.VCSelectContainerEvent?.blur(args[0]);
            }, 200);
          },
        },
        inputNode.type === 'textarea' ? {} : { type: 'search' },
      ),
      true,
      true,
    ) as VNode;
    return inputNode;
  },
});

Input.props = {
  inputRef: PropTypes.any,
  prefixCls: PropTypes.string,
  id: PropTypes.string,
  inputElement: PropTypes.any,
  disabled: PropTypes.looseBool,
  autofocus: PropTypes.looseBool,
  autocomplete: PropTypes.string,
  editable: PropTypes.looseBool,
  accessibilityIndex: PropTypes.number,
  value: PropTypes.string,
  open: PropTypes.looseBool,
  tabindex: PropTypes.number,
  /** Pass accessibility props to input */
  attrs: PropTypes.object,
  onKeydown: PropTypes.func,
  onMousedown: PropTypes.func,
  onChange: PropTypes.func,
  onPaste: PropTypes.func,
  onCompositionstart: PropTypes.func,
  onCompositionend: PropTypes.func,
};

export default Input;
