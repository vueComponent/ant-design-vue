import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';

import PropTypes from '../_util/vue-types';
import { getOptionProps, getComponentFromProp } from '../_util/props-util';
import VcSwitch from '../vc-switch';

export default {
  name: 'ASwitch',
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    prefixCls: PropTypes.string.def('ant-switch'),
    // size=default and size=large are the same
    size: PropTypes.oneOf(['small', 'default', 'large']),
    disabled: PropTypes.bool,
    checkedChildren: PropTypes.any,
    unCheckedChildren: PropTypes.any,
    tabIndex: PropTypes.number,
    checked: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    autoFocus: PropTypes.bool,
    loading: PropTypes.bool
  },
  methods: {
    focus: function focus() {
      this.$refs.refSwitchNode.focus();
    },
    blur: function blur() {
      this.$refs.refSwitchNode.blur();
    }
  },

  render: function render() {
    var _classes;

    var h = arguments[0];

    var _getOptionProps = getOptionProps(this),
        prefixCls = _getOptionProps.prefixCls,
        size = _getOptionProps.size,
        loading = _getOptionProps.loading,
        restProps = _objectWithoutProperties(_getOptionProps, ['prefixCls', 'size', 'loading']);

    var classes = (_classes = {}, _defineProperty(_classes, prefixCls + '-small', size === 'small'), _defineProperty(_classes, prefixCls + '-loading', loading), _classes);
    var switchProps = {
      props: _extends({}, restProps, {
        prefixCls: prefixCls
      }),
      on: this.$listeners,
      'class': classes,
      ref: 'refSwitchNode'
    };
    return h(
      VcSwitch,
      switchProps,
      [h(
        'template',
        { slot: 'checkedChildren' },
        [getComponentFromProp(this, 'checkedChildren')]
      ), h(
        'template',
        { slot: 'unCheckedChildren' },
        [getComponentFromProp(this, 'unCheckedChildren')]
      )]
    );
  }
};