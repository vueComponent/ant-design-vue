import PropTypes from '../../_util/vue-types';

export const OptionProps = {
  value: PropTypes.string,
  disabled: PropTypes.boolean,
  children: PropTypes.any,
};

export default {
  name: 'Option',
  props: OptionProps,
  render() {
    return null;
  },
};
