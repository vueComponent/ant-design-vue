import { defineComponent, ref, withDirectives } from 'vue';
import antInput from './antInputDirective';
import PropTypes from './vue-types';
const BaseInput = defineComponent({
  props: {
    value: PropTypes.string.def(''),
  },
  emits: ['change', 'input'],
  setup(_p, { emit }) {
    const inputRef = ref(null);
    const handleChange = (e: Event) => {
      const { composing } = e.target as any;
      if ((e as any).isComposing || composing) {
        emit('input', e);
      } else {
        emit('input', e);
        emit('change', e);
      }
    };
    return {
      inputRef,
      focus: () => {
        if (inputRef.value) {
          inputRef.value.focus();
        }
      },
      blur: () => {
        if (inputRef.value) {
          inputRef.value.blur();
        }
      },
      handleChange,
    };
  },
  render() {
    return withDirectives(
      (
        <input
          {...this.$props}
          {...this.$attrs}
          onInput={this.handleChange}
          onChange={this.handleChange}
          ref="inputRef"
        />
      ) as any,
      [[antInput]],
    );
  },
});

export default BaseInput;
