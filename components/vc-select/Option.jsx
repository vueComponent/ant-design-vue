import PropTypes from '../_util/vue-types';

export default {
  props: {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.bool,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  },
  isSelectOption: true,
};
