'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

exports['default'] = createSliderWithTooltip;

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _vcTooltip = require('../../vc-tooltip');

var _vcTooltip2 = _interopRequireDefault(_vcTooltip);

var _propsUtil = require('../../_util/props-util');

var _Handle = require('./Handle');

var _Handle2 = _interopRequireDefault(_Handle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function createSliderWithTooltip(Component) {
  return {
    mixins: [_BaseMixin2['default'], Component],
    props: {
      tipFormatter: _vueTypes2['default'].func.def(function (value) {
        return value;
      }),
      handleStyle: _vueTypes2['default'].oneOfType([_vueTypes2['default'].object, _vueTypes2['default'].arrayOf(_vueTypes2['default'].object)]).def([{}]),
      tipProps: _vueTypes2['default'].object.def({})
    },
    data: function data() {
      return {
        visibles: {}
      };
    },

    methods: {
      handleTooltipVisibleChange: function handleTooltipVisibleChange(index, visible) {
        this.setState(function (prevState) {
          return {
            visibles: (0, _extends4['default'])({}, prevState.visibles, (0, _defineProperty3['default'])({}, index, visible))
          };
        });
      },
      handleWithTooltip: function handleWithTooltip(_ref) {
        var _this = this;

        var value = _ref.value,
            dragging = _ref.dragging,
            index = _ref.index,
            disabled = _ref.disabled,
            restProps = (0, _objectWithoutProperties3['default'])(_ref, ['value', 'dragging', 'index', 'disabled']);
        var h = this.$createElement;
        var _$props = this.$props,
            tipFormatter = _$props.tipFormatter,
            tipProps = _$props.tipProps,
            handleStyle = _$props.handleStyle;
        var _tipProps$prefixCls = tipProps.prefixCls,
            prefixCls = _tipProps$prefixCls === undefined ? 'rc-slider-tooltip' : _tipProps$prefixCls,
            _tipProps$overlay = tipProps.overlay,
            overlay = _tipProps$overlay === undefined ? tipFormatter(value) : _tipProps$overlay,
            _tipProps$placement = tipProps.placement,
            placement = _tipProps$placement === undefined ? 'top' : _tipProps$placement,
            _tipProps$visible = tipProps.visible,
            visible = _tipProps$visible === undefined ? visible || false : _tipProps$visible,
            restTooltipProps = (0, _objectWithoutProperties3['default'])(tipProps, ['prefixCls', 'overlay', 'placement', 'visible']);


        var handleStyleWithIndex = void 0;
        if (Array.isArray(handleStyle)) {
          handleStyleWithIndex = handleStyle[index] || handleStyle[0];
        } else {
          handleStyleWithIndex = handleStyle;
        }

        var tooltipProps = {
          props: (0, _extends4['default'])({}, restTooltipProps, {
            prefixCls: prefixCls,
            overlay: overlay,
            placement: placement,
            visible: !disabled && (this.visibles[index] || dragging) || visible
          }),
          key: index
        };
        var handleProps = {
          props: (0, _extends4['default'])({
            value: value
          }, restProps),
          on: {
            mouseenter: function mouseenter() {
              return _this.handleTooltipVisibleChange(index, true);
            },
            mouseleave: function mouseleave() {
              return _this.handleTooltipVisibleChange(index, false);
            }
          },
          style: (0, _extends4['default'])({}, handleStyleWithIndex)
        };

        return h(
          _vcTooltip2['default'],
          tooltipProps,
          [h(_Handle2['default'], handleProps)]
        );
      }
    },
    render: function render() {
      var h = arguments[0];

      var componentProps = {
        props: (0, _extends4['default'])({}, (0, _propsUtil.getOptionProps)(this), {
          handle: this.handleWithTooltip
        })
      };
      return h(Component, componentProps);
    }
  };
}
module.exports = exports['default'];