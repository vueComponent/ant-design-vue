import { cloneElement } from '../../_util/vnode';
import type { VNode, VNodeChild } from 'vue';
import { defineComponent, getCurrentInstance, inject, onMounted, withDirectives } from 'vue';
import PropTypes from '../../_util/vue-types';
import type { RefObject } from '../../_util/createRef';
import antInput from '../../_util/antInputDirective';
import classNames from '../../_util/classNames';
import type { EventHandler } from '../../_util/EventInterface';

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
  tabindex: number | string;
  /** Pass accessibility props to input */
  attrs: object;
  inputRef: RefObject;
  onKeydown: EventHandler;
  onMousedown: EventHandler;
  onChange: EventHandler;
  onPaste: EventHandler;
  onCompositionstart: EventHandler;
  onCompositionend: EventHandler;
  onFocus: EventHandler;
  onBlur: EventHandler;
}

const Input = defineComponent({
  name: 'Input',
  inheritAttrs: false,
  props: {
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
    tabindex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /** Pass accessibility props to input */
    attrs: PropTypes.object,
    onKeydown: PropTypes.func,
    onMousedown: PropTypes.func,
    onChange: PropTypes.func,
    onPaste: PropTypes.func,
    onCompositionstart: PropTypes.func,
    onCompositionend: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
  },
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
      VCSelectContainerEvent: inject('VCSelectContainerEvent') as any,
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
      onFocus,
      onBlur,
      open,
      inputRef,
      attrs,
    } = this.$props as InputProps;
    let inputNode: any = inputElement || withDirectives((<input />) as VNode, [[antInput]]);

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
          id,
          ref: inputRef,
          disabled,
          tabindex,
          autocomplete: autocomplete || 'off',
          autofocus,
          class: classNames(`${prefixCls}-selection-search-input`, inputNode?.props?.className),
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
            onOriginFocus && onOriginFocus(args[0]);
            onFocus && onFocus(args[0]);
            this.VCSelectContainerEvent?.focus(args[0]);
          },
          onBlur: (...args: any[]) => {
            this.blurTimeout = setTimeout(() => {
              onOriginBlur && onOriginBlur(args[0]);
              onBlur && onBlur(args[0]);
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

// Input.props = {
//   inputRef: PropTypes.any,
//   prefixCls: PropTypes.string,
//   id: PropTypes.string,
//   inputElement: PropTypes.any,
//   disabled: PropTypes.looseBool,
//   autofocus: PropTypes.looseBool,
//   autocomplete: PropTypes.string,
//   editable: PropTypes.looseBool,
//   accessibilityIndex: PropTypes.number,
//   value: PropTypes.string,
//   open: PropTypes.looseBool,
//   tabindex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
//   /** Pass accessibility props to input */
//   attrs: PropTypes.object,
//   onKeydown: PropTypes.func,
//   onMousedown: PropTypes.func,
//   onChange: PropTypes.func,
//   onPaste: PropTypes.func,
//   onCompositionstart: PropTypes.func,
//   onCompositionend: PropTypes.func,
//   onFocus: PropTypes.func,
//   onBlur: PropTypes.func,
// };

export default Input;
