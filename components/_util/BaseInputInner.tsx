import type { PropType } from 'vue';
import { defineComponent, shallowRef } from 'vue';
import PropTypes from './vue-types';

export interface BaseInputInnerExpose {
  focus: () => void;
  blur: () => void;
  input: HTMLInputElement | HTMLTextAreaElement | null;
  setSelectionRange: (
    start: number,
    end: number,
    direction?: 'forward' | 'backward' | 'none',
  ) => void;
  select: () => void;
  getSelectionStart: () => number | null;
  getSelectionEnd: () => number | null;
  getScrollTop: () => number | null;
  setScrollTop: (scrollTop: number) => void;
}
const BaseInputInner = defineComponent({
  compatConfig: { MODE: 3 },
  // inheritAttrs: false,
  props: {
    disabled: PropTypes.looseBool,
    type: PropTypes.string,
    value: PropTypes.any,
    tag: {
      type: String as PropType<'input' | 'textarea'>,
      default: 'input',
    },
    size: PropTypes.string,
    onChange: Function as PropType<(e: Event) => void>,
    onInput: Function as PropType<(e: Event) => void>,
    onBlur: Function as PropType<(e: Event) => void>,
    onFocus: Function as PropType<(e: Event) => void>,
    onKeydown: Function as PropType<(e: Event) => void>,
    onCompositionstart: Function as PropType<(e: Event) => void>,
    onCompositionend: Function as PropType<(e: Event) => void>,
    onKeyup: Function as PropType<(e: Event) => void>,
    onPaste: Function as PropType<(e: Event) => void>,
    onMousedown: Function as PropType<(e: Event) => void>,
  },
  emits: [
    'change',
    'input',
    'blur',
    'keydown',
    'focus',
    'compositionstart',
    'compositionend',
    'keyup',
    'paste',
    'mousedown',
  ],
  setup(props, { expose }) {
    const inputRef = shallowRef(null);

    const focus = () => {
      if (inputRef.value) {
        inputRef.value.focus();
      }
    };
    const blur = () => {
      if (inputRef.value) {
        inputRef.value.blur();
      }
    };
    const setSelectionRange = (
      start: number,
      end: number,
      direction?: 'forward' | 'backward' | 'none',
    ) => {
      inputRef.value?.setSelectionRange(start, end, direction);
    };

    const select = () => {
      inputRef.value?.select();
    };
    expose({
      focus,
      blur,
      input: inputRef,
      setSelectionRange,
      select,
      getSelectionStart: () => inputRef.value?.selectionStart,
      getSelectionEnd: () => inputRef.value?.selectionEnd,
      getScrollTop: () => inputRef.value?.scrollTop,
    });
    return () => {
      const { tag: Tag, value, ...restProps } = props;
      return <Tag {...restProps} ref={inputRef} value={value} />;
    };
  },
});

export default BaseInputInner;
