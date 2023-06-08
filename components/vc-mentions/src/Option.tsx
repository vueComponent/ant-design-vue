import type { ExtractPropTypes } from 'vue';
import { defineComponent } from 'vue';

export const optionProps = {
  value: String,
  disabled: Boolean,
  label: [String, Number, Function],
};

export type OptionProps = Partial<ExtractPropTypes<typeof optionProps>>;
export const optionOptions = {
  name: 'Option',
  props: optionProps,
  render(_props: any, { slots }: any) {
    return slots.default?.();
  },
};
export default defineComponent({
  compatConfig: { MODE: 3 },
  ...optionOptions,
});
