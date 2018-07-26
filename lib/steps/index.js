'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _vcSteps = require('../vc-steps');

var _vcSteps2 = _interopRequireDefault(_vcSteps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var getStepsProps = function getStepsProps() {
  var defaultProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var props = {
    prefixCls: _vueTypes2['default'].string,
    iconPrefix: _vueTypes2['default'].string,
    current: _vueTypes2['default'].number,
    status: _vueTypes2['default'].oneOf(['wait', 'process', 'finish', 'error']),
    size: _vueTypes2['default'].oneOf(['default', 'small']),
    direction: _vueTypes2['default'].oneOf(['horizontal', 'vertical']),
    progressDot: _vueTypes2['default'].oneOfType([_vueTypes2['default'].bool, _vueTypes2['default'].func])
  };
  return (0, _propsUtil.initDefaultProps)(props, defaultProps);
};

exports['default'] = {
  name: 'ASteps',
  props: getStepsProps({
    prefixCls: 'ant-steps',
    iconPrefix: 'ant',
    current: 0
  }),
  Step: (0, _extends3['default'])({}, _vcSteps2['default'].Step, { name: 'AStep' }),
  render: function render() {
    var h = arguments[0];

    var props = (0, _propsUtil.getOptionProps)(this);
    var stepsProps = {
      props: props,
      on: this.$listeners,
      scopedSlots: this.$scopedSlots
    };
    return h(
      _vcSteps2['default'],
      stepsProps,
      [this.$slots['default']]
    );
  }
};
module.exports = exports['default'];