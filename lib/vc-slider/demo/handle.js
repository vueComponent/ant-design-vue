'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _vcTooltip = require('../../vc-tooltip');

var _vcTooltip2 = _interopRequireDefault(_vcTooltip);

require('../assets/index.less');

require('../../vc-tooltip/assets/bootstrap.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Handle = _index2['default'].Handle,
    Range = _index2['default'].Range;
exports['default'] = {
  data: function data() {
    return {
      visibles: []
    };
  },

  methods: {
    handleTooltipVisibleChange: function handleTooltipVisibleChange(index, visible) {
      this.visibles[index] = visible;
      this.visibles = (0, _extends3['default'])({}, this.visibles);
    }
  },
  render: function render() {
    var _this = this;

    var h = arguments[0];

    var handle = function handle(h, props) {
      var value = props.value,
          dragging = props.dragging,
          index = props.index,
          refStr = props.refStr,
          style = props.style,
          restProps = (0, _objectWithoutProperties3['default'])(props, ['value', 'dragging', 'index', 'refStr', 'style']);

      var handleProps = {
        props: (0, _extends3['default'])({}, restProps, {
          value: value
        }),
        attrs: {
          refStr: refStr
        },
        key: index,
        style: style
      };
      return h(
        _vcTooltip2['default'],
        {
          attrs: {
            prefixCls: 'rc-slider-tooltip',
            overlay: value,
            visible: dragging,
            placement: 'top'
          },
          key: index
        },
        [h(Handle, handleProps)]
      );
    };

    var handleRange = function handleRange(h, _ref) {
      var value = _ref.value,
          dragging = _ref.dragging,
          index = _ref.index,
          disabled = _ref.disabled,
          style = _ref.style,
          restProps = (0, _objectWithoutProperties3['default'])(_ref, ['value', 'dragging', 'index', 'disabled', 'style']);

      var tipFormatter = function tipFormatter(value) {
        return value + '%';
      };
      var tipProps = {};

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
      if (Array.isArray(style)) {
        handleStyleWithIndex = style[index] || style[0];
      } else {
        handleStyleWithIndex = style;
      }

      var tooltipProps = {
        props: (0, _extends3['default'])({
          prefixCls: prefixCls,
          overlay: overlay,
          placement: placement,
          visible: !disabled && (_this.visibles[index] || dragging) || visible
        }, restTooltipProps),
        key: index
      };
      var handleProps = {
        props: (0, _extends3['default'])({
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
        style: (0, _extends3['default'])({}, handleStyleWithIndex)
      };

      return h(
        _vcTooltip2['default'],
        tooltipProps,
        [h(Handle, handleProps)]
      );
    };
    var wrapperStyle = 'width: 400px; margin: 50px';

    return h('div', [h(
      'div',
      { style: wrapperStyle },
      [h('p', ['Slider with custom handle']), h(_index2['default'], {
        attrs: { min: 0, max: 20, defaultValue: 3, handle: handle }
      })]
    ), h(
      'div',
      { style: wrapperStyle },
      [h('p', ['Range with custom handle']), h(Range, {
        attrs: { min: 0, max: 20, defaultValue: [3, 10], handle: handleRange }
      })]
    )]);
  }
};
module.exports = exports['default'];