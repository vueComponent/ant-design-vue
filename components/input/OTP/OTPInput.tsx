import Input from '../Input';
import { computed, defineComponent, shallowRef } from 'vue';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'OTPInput',
  inheritAttrs: false,
  props: {
    index: Number,
    value: { type: String, default: undefined },
    mask: { type: [Boolean, String], default: false },
  },
  setup(props, { attrs }) {
    const inputRef = shallowRef();
    const internalValue = computed(() => {
      const { value, mask, ...resetProps } = props;
      return value && typeof mask === 'string' ? mask : value;
    });

    return () => <Input ref={inputRef} class={attrs.class} value={internalValue.value} />;
  },
});
