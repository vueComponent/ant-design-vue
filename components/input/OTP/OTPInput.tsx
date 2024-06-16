import Input from '../Input';
import { PropType, computed, defineComponent, nextTick, shallowRef } from 'vue';
import inputProps from '../inputProps';
import omit from '../../_util/omit';
import { type ChangeEventHandler } from '../../_util/EventInterface';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'OTPInput',
  inheritAttrs: false,
  props: {
    ...inputProps(),
    index: Number,
    value: { type: String, default: undefined },
    mask: { type: [Boolean, String], default: false },
    onChange: { type: Function as PropType<(index: number, value: string) => void> },
  },
  setup(props, { attrs, expose }) {
    const inputRef = shallowRef();
    const internalValue = computed(() => {
      const { value, mask } = props;
      return value && typeof mask === 'string' ? mask : value;
    });

    const syncSelection = () => {
      requestAnimationFrame(() => {
        inputRef.value.select();
      });
    };
    const handleSyncMouseDown = e => {
      e.preventDefault();
      syncSelection();
    };
    // ======================= Event handlers =================
    const onInternalChange: ChangeEventHandler = e => {
      props.onChange(props.index, e.target.value);
    };

    const focus = () => {
      inputRef.value?.focus();
      syncSelection();
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
        onMousedown={handleSyncMouseDown}
        onMouseUp={handleSyncMouseDown}
        onKeydown={syncSelection}
        onKeyup={syncSelection}
      />
    );
  },
});
