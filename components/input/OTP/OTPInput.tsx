import Input from '../Input';
import { PropType, computed, defineComponent, shallowRef } from 'vue';
import inputProps from '../inputProps';
import omit from '../../_util/omit';
import { type ChangeEventHandler } from '../../_util/EventInterface';

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
    const handleSyncMouseDown = () => {
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
        onMousedown={handleSyncMouseDown}
        onMouseUp={handleSyncMouseDown}
        onKeydown={onInternalKeydown}
        onKeyup={onInternalKeyUp}
      />
    );
  },
});
