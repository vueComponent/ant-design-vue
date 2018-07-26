'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var triggerType = _vueTypes2['default'].oneOf(['hover', 'focus', 'click', 'contextmenu']);

exports['default'] = function () {
  return {
    trigger: _vueTypes2['default'].oneOfType([triggerType, _vueTypes2['default'].arrayOf(triggerType)]).def('hover'),
    visible: _vueTypes2['default'].bool,
    placement: _vueTypes2['default'].oneOf(['top', 'left', 'right', 'bottom', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'leftTop', 'leftBottom', 'rightTop', 'rightBottom']).def('top'),
    transitionName: _vueTypes2['default'].string.def('zoom-big-fast'),
    // onVisibleChange: PropTypes.func,
    overlayStyle: _vueTypes2['default'].object.def({}),
    overlayClassName: _vueTypes2['default'].string,
    prefixCls: _vueTypes2['default'].string.def('ant-tooltip'),
    mouseEnterDelay: _vueTypes2['default'].number.def(0.1),
    mouseLeaveDelay: _vueTypes2['default'].number.def(0.1),
    getTooltipContainer: _vueTypes2['default'].func,
    getPopupContainer: _vueTypes2['default'].func,
    arrowPointAtCenter: _vueTypes2['default'].bool.def(false),
    autoAdjustOverflow: _vueTypes2['default'].oneOfType([_vueTypes2['default'].bool, _vueTypes2['default'].object]).def(true)
  };
};

module.exports = exports['default'];