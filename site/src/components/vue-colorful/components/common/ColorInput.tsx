import type { PropType } from 'vue';
import { defineComponent, toRefs, ref, watchEffect } from 'vue';

import type { ColorInputBaseProps } from '../../types';

export interface ColorInputProps extends ColorInputBaseProps {
  /** Blocks typing invalid characters and limits string length */
  escape: (value: string) => string;
  /** Checks that value is valid color string */
  validate: (value: string) => boolean;
  /** Processes value before displaying it in the input */
  format?: (value: string) => string;
  /** Processes value before sending it in `onChange` */
  process?: (value: string) => string;
}

export const ColorInput = defineComponent({
  name: 'ColorInput',
  props: {
    color: { type: String as PropType<string>, default: '' },
    onChange: { type: Function as PropType<(newColor: string) => void> },
    onBlur: { type: Function as PropType<(newColor: string) => void> },
    escape: { type: Function as PropType<(value: string) => string> },
    validate: { type: Function as PropType<(value: string) => boolean> },
    format: { type: Function as PropType<(value: string) => string> },
    process: { type: Function as PropType<(value: string) => string> },
  },
  setup(props, { attrs }) {
    const { color } = toRefs(props);
    const { escape, validate, format, process } = props;

    const value = ref(escape(color.value));

    // Trigger `onChange` handler only if the input value is a valid color
    const handleChange = e => {
      const inputValue = escape(e.target.value);
      value.value = inputValue;
      if (validate(inputValue)) {
        props.onChange(process ? process(inputValue) : inputValue);
      }
    };

    // Take the color from props if the last typed color (in local state) is not valid
    const handleBlur = e => {
      if (!validate(e.target.value)) {
        value.value = escape(color.value);
      }
      props.onBlur(e);
    };

    // Update the local state when `color` property value is changed
    watchEffect(() => {
      value.value = escape(color.value);
    });

    return () => {
      return (
        <input
          {...attrs}
          value={format ? format(value.value) : value.value}
          spellcheck="false" // the element should not be checked for spelling errors
          onChange={handleChange}
          onBlur={handleBlur}
        />
      );
    };
  },
});
