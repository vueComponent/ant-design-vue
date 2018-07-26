import _defineProperty from 'babel-runtime/helpers/defineProperty';
import { filterEmpty } from '../_util/props-util';
export default {
  name: 'AInputGroup',
  props: {
    prefixCls: {
      'default': 'ant-input-group',
      type: String
    },
    size: {
      validator: function validator(value) {
        return ['small', 'large', 'default'].includes(value);
      }
    },
    compact: Boolean
  },
  computed: {
    classes: function classes() {
      var _ref;

      var prefixCls = this.prefixCls,
          size = this.size,
          _compact = this.compact,
          compact = _compact === undefined ? false : _compact;

      return _ref = {}, _defineProperty(_ref, '' + prefixCls, true), _defineProperty(_ref, prefixCls + '-lg', size === 'large'), _defineProperty(_ref, prefixCls + '-sm', size === 'small'), _defineProperty(_ref, prefixCls + '-compact', compact), _ref;
    }
  },
  methods: {},
  render: function render() {
    var h = arguments[0];

    return h(
      'span',
      { 'class': this.classes },
      [filterEmpty(this.$slots['default'])]
    );
  }
};