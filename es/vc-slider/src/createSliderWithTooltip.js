import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import Tooltip from '../../vc-tooltip';
import { getOptionProps } from '../../_util/props-util';
import Handle from './Handle';

export default function createSliderWithTooltip(Component) {
  return {
    mixins: [BaseMixin, Component],
    props: {
      tipFormatter: PropTypes.func.def(function (value) {
        return value;
      }),
      handleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]).def([{}]),
      tipProps: PropTypes.object.def({})
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
            visibles: _extends({}, prevState.visibles, _defineProperty({}, index, visible))
          };
        });
      },
      handleWithTooltip: function handleWithTooltip(_ref) {
        var _this = this;

        var value = _ref.value,
            dragging = _ref.dragging,
            index = _ref.index,
            disabled = _ref.disabled,
            restProps = _objectWithoutProperties(_ref, ['value', 'dragging', 'index', 'disabled']);

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
            restTooltipProps = _objectWithoutProperties(tipProps, ['prefixCls', 'overlay', 'placement', 'visible']);

        var handleStyleWithIndex = void 0;
        if (Array.isArray(handleStyle)) {
          handleStyleWithIndex = handleStyle[index] || handleStyle[0];
        } else {
          handleStyleWithIndex = handleStyle;
        }

        var tooltipProps = {
          props: _extends({}, restTooltipProps, {
            prefixCls: prefixCls,
            overlay: overlay,
            placement: placement,
            visible: !disabled && (this.visibles[index] || dragging) || visible
          }),
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
      }
    },
    render: function render() {
      var h = arguments[0];

      var componentProps = {
        props: _extends({}, getOptionProps(this), {
          handle: this.handleWithTooltip
        })
      };
      return h(Component, componentProps);
    }
  };
}