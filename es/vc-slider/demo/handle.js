import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import Slider from '../index';
import Tooltip from '../../vc-tooltip';
import '../assets/index.less';
import '../../vc-tooltip/assets/bootstrap.less';

var Handle = Slider.Handle,
    Range = Slider.Range;


export default {
  data: function data() {
    return {
      visibles: []
    };
  },

  methods: {
    handleTooltipVisibleChange: function handleTooltipVisibleChange(index, visible) {
      this.visibles[index] = visible;
      this.visibles = _extends({}, this.visibles);
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
          restProps = _objectWithoutProperties(props, ['value', 'dragging', 'index', 'refStr', 'style']);

      var handleProps = {
        props: _extends({}, restProps, {
          value: value
        }),
        attrs: {
          refStr: refStr
        },
        key: index,
        style: style
      };
      return h(
        Tooltip,
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
          restProps = _objectWithoutProperties(_ref, ['value', 'dragging', 'index', 'disabled', 'style']);

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
          restTooltipProps = _objectWithoutProperties(tipProps, ['prefixCls', 'overlay', 'placement', 'visible']);

      var handleStyleWithIndex = void 0;
      if (Array.isArray(style)) {
        handleStyleWithIndex = style[index] || style[0];
      } else {
        handleStyleWithIndex = style;
      }

      var tooltipProps = {
        props: _extends({
          prefixCls: prefixCls,
          overlay: overlay,
          placement: placement,
          visible: !disabled && (_this.visibles[index] || dragging) || visible
        }, restTooltipProps),
        key: index
      };
      var handleProps = {
        props: _extends({
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
        style: _extends({}, handleStyleWithIndex)
      };

      return h(
        Tooltip,
        tooltipProps,
        [h(Handle, handleProps)]
      );
    };
    var wrapperStyle = 'width: 400px; margin: 50px';

    return h('div', [h(
      'div',
      { style: wrapperStyle },
      [h('p', ['Slider with custom handle']), h(Slider, {
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