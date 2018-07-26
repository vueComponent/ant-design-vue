import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import PropTypes from '../_util/vue-types';
import { initDefaultProps, getOptionProps } from '../_util/props-util';
import classNames from 'classnames';
import VcInputNumber from '../vc-input-number/src';

export var InputNumberProps = {
  prefixCls: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  step: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  defaultValue: PropTypes.number,
  tabIndex: PropTypes.number,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['large', 'small', 'default']),
  formatter: PropTypes.func,
  parser: PropTypes.func,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  precision: PropTypes.number,
  autoFocus: PropTypes.bool
};

export default {
  name: 'AInputNumber',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: initDefaultProps(InputNumberProps, {
    prefixCls: 'ant-input-number',
    step: 1
  }),
  methods: {
    focus: function focus() {
      this.$refs.inputNumberRef.focus();
    },
    blur: function blur() {
      this.$refs.inputNumberRef.blur();
    }
  },

  render: function render() {
    var _classNames;

    var h = arguments[0];

    var _getOptionProps = getOptionProps(this),
        size = _getOptionProps.size,
        others = _objectWithoutProperties(_getOptionProps, ['size']);

    var inputNumberClass = classNames((_classNames = {}, _defineProperty(_classNames, this.prefixCls + '-lg', size === 'large'), _defineProperty(_classNames, this.prefixCls + '-sm', size === 'small'), _classNames));
    var vcInputNumberprops = {
      props: _extends({}, others),
      'class': inputNumberClass,
      ref: 'inputNumberRef',
      on: this.$listeners
    };
    return h(VcInputNumber, vcInputNumberprops);
  }
};