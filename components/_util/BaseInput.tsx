import type { PropType } from 'vue';
import { computed, defineComponent, shallowRef, ref, watch } from 'vue';
import PropTypes from './vue-types';
import type { BaseInputInnerExpose } from './BaseInputInner';
import BaseInputInner from './BaseInputInner';
import { styleObjectToString } from '../vc-util/Dom/css';

export interface BaseInputExpose {
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
const BaseInput = defineComponent({
  compatConfig: { MODE: 3 },
  inheritAttrs: false,
  props: {
    disabled: PropTypes.looseBool,
    type: PropTypes.string,
    value: PropTypes.any,
    lazy: PropTypes.bool.def(true),
    tag: {
      type: String as PropType<'input' | 'textarea'>,
      default: 'input',
    },
    size: PropTypes.string,
    style: PropTypes.oneOfType([String, Object]),
    class: PropTypes.string,
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
  setup(props, { emit, attrs, expose }) {
    const inputRef = shallowRef<BaseInputInnerExpose>(null);
    const renderValue = ref();
    const isComposing = ref(false);
    watch(
      [() => props.value, isComposing],
      () => {
        if (isComposing.value) return;
        renderValue.value = props.value;
      },
      { immediate: true },
    );
    const handleChange = (e: Event) => {
      emit('change', e);
    };
    const onCompositionstart = (e: CompositionEvent) => {
      isComposing.value = true;
      (e.target as any).composing = true;
      emit('compositionstart', e);
    };
    const onCompositionend = (e: CompositionEvent) => {
      isComposing.value = false;
      (e.target as any).composing = false;
      emit('compositionend', e);
      const event = document.createEvent('HTMLEvents');
      event.initEvent('input', true, true);
      e.target.dispatchEvent(event);
      handleChange(e);
    };
    const handleInput = (e: Event) => {
      if (isComposing.value && props.lazy) {
        renderValue.value = (e.target as HTMLInputElement).value;
        return;
      }
      emit('input', e);
    };

    const handleBlur = (e: Event) => {
      emit('blur', e);
    };
    const handleFocus = (e: Event) => {
      emit('focus', e);
    };

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
    const handleKeyDown = (e: KeyboardEvent) => {
      emit('keydown', e);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      emit('keyup', e);
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
      input: computed(() => inputRef.value?.input),
      setSelectionRange,
      select,
      getSelectionStart: () => inputRef.value?.getSelectionStart(),
      getSelectionEnd: () => inputRef.value?.getSelectionEnd(),
      getScrollTop: () => inputRef.value?.getScrollTop(),
    });
    const handleMousedown = (e: MouseEvent) => {
      emit('mousedown', e);
    };
    const handlePaste = (e: ClipboardEvent) => {
      emit('paste', e);
    };
    const styleString = computed(() => {
      return props.style && typeof props.style !== 'string'
        ? styleObjectToString(props.style)
        : props.style;
    });
    return () => {
      const { style, lazy, ...restProps } = props;
      return (
        <BaseInputInner
          {...restProps}
          {...attrs}
          style={styleString.value}
          onInput={handleInput}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          ref={inputRef}
          value={renderValue.value}
          onCompositionstart={onCompositionstart}
          onCompositionend={onCompositionend}
          onKeyup={handleKeyUp}
          onKeydown={handleKeyDown}
          onPaste={handlePaste}
          onMousedown={handleMousedown}
        />
      );
    };
  },
});

export default BaseInput;
