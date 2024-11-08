import Input from '../Input';
import { PropType, computed, defineComponent, nextTick, shallowRef } from 'vue';
import inputProps from '../inputProps';
import omit from '../../_util/omit';
import { type ChangeEventHandler } from '../../_util/EventInterface';
import { type InputStatus } from '../../_util/statusUtils';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AOTPInput',
  inheritAttrs: false,
  props: {
    ...inputProps(),
    index: Number,
    value: { type: String, default: undefined },
    mask: { type: [Boolean, String], default: false },
    onChange: { type: Function as PropType<(index: number, value: string) => void> },
    onActiveChange: Function as PropType<(nextIndex: number) => void>,
    status: { type: String as PropType<InputStatus>, default: undefined },
  },
  setup(props, { attrs, expose }) {
    const inputRef = shallowRef();
    const internalValue = computed(() => {
      const { value, mask } = props;
      return value && typeof mask === 'string' ? mask : value;
    });

    const syncSelection = () => {
      inputRef.value.select();
      requestAnimationFrame(() => {
        inputRef.value.select();
      });
    };

    const forceUpdate = () => {
      inputRef.value.input?.rootInputForceUpdate?.();
    };

    // ======================= Event handlers =================
    const onInternalChange: ChangeEventHandler = e => {
      const value = e.target.value;
      props.onChange(props.index, value);

      // Edge:  If the value after the formatter is the same as the original value
      // the Input component will not be updated, and since the input is not controlled
      // it will result in an inconsistent UI with the value.
      nextTick(() => {
        forceUpdate();
      });
    };

    const focus = () => {
      inputRef.value?.focus();
      syncSelection();
    };

    const activeSelection = () => {
      if (document.activeElement === inputRef.value.input.input) {
        syncSelection();
      }
    };

    const onInternalKeydown = ({ key }) => {
      if (key === 'ArrowLeft') {
        props.onActiveChange(props.index - 1);
      } else if (key === 'ArrowRight') {
        props.onActiveChange(props.index + 1);
      }

      activeSelection();
    };

    const onInternalKeyUp = ({ key }) => {
      if (key === 'Backspace' && !props.value) {
        props.onActiveChange(props.index - 1);
      }

      activeSelection();
    };

    expose({
      focus,
    });

    return () => (
      <Input
        ref={inputRef}
        {...attrs}
        {...omit(props, ['index', 'value', 'mask', 'onChange'])}
        class={attrs.class}
        value={internalValue.value}
        onInput={onInternalChange}
        onFocus={syncSelection}
        onMousedown={syncSelection}
        onMouseUp={syncSelection}
        onKeydown={onInternalKeydown}
        onKeyup={onInternalKeyUp}
        type={props.mask === true ? 'password' : 'text'}
      />
    );
  },
});
