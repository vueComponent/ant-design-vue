import { defineComponent } from 'vue';
import PropTypes from '../../_util/vue-types';

export const OptionProps = {
  value: PropTypes.string,
  disabled: PropTypes.looseBool,
  children: PropTypes.any,
};

export default defineComponent({
  name: 'Option',
  props: OptionProps,
  render() {
    return null;
  },
});
