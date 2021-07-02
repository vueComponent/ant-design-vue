import type { ExtractPropTypes } from 'vue';
import { defineComponent } from 'vue';
import PropTypes from '../../_util/vue-types';

export const optionProps = {
  value: PropTypes.string,
  disabled: PropTypes.looseBool,
  children: PropTypes.any,
};

export type OptionProps = ExtractPropTypes<typeof optionProps>;

export default defineComponent({
  name: 'Option',
  props: optionProps,
  render() {
    return null;
  },
});
