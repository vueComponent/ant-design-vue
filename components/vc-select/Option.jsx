
import PropTypes from '../_util/vue-types'

export default {
  props: {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    disabled: PropTypes.bool,
    title: PropTypes.string,
  },
  isSelectOption: true,
}

