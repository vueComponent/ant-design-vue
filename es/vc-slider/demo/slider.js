import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import Slider from '../index';
import Tooltip from '../../vc-tooltip';
import '../assets/index.less';
import '../../vc-tooltip/assets/bootstrap.less';

var Handle = Slider.Handle;


function log(value) {
  console.log(value); //eslint-disable-line
}

var CustomizedSlider = {
  data: function data() {
    return {
      value: 50
    };
  },

  methods: {
    onSliderChange: function onSliderChange(value) {
      log(value);
      this.value = value;
    },
    onAfterChange: function onAfterChange(value) {
      log(value);
    }
  },
  render: function render() {
    var h = arguments[0];

    return h(Slider, {
      attrs: { value: this.value
      },
      on: {
        'change': this.onSliderChange,
        'afterChange': this.onAfterChange
      }
    });
  }
};

var DynamicBounds = {
  data: function data() {
    return {
      min: 0,
      max: 100
    };
  },

  methods: {
    onSliderChange: function onSliderChange(value) {
      log(value);
      this.value = value;
    },
    onAfterChange: function onAfterChange(value) {
      log(value);
    },
    onMinChange: function onMinChange(e) {
      this.min = +e.target.value || 0;
    },
    onMaxChange: function onMaxChange(e) {
      this.max = +e.target.value || 100;
    }
  },
  render: function render() {
    var h = arguments[0];

    return h('div', [h('label', ['Min: ']), h('input', {
      attrs: { type: 'number' },
      domProps: {
        'value': this.min
      },
      on: {
        'input': this.onMinChange
      }
    }), h('br'), h('label', ['Max: ']), h('input', {
      attrs: { type: 'number' },
      domProps: {
        'value': this.max
      },
      on: {
        'input': this.onMaxChange
      }
    }), h('br'), h('br'), h(Slider, {
      attrs: { defaultValue: 50, min: this.min, max: this.max
      },
      on: {
        'change': this.onSliderChange
      }
    })]);
  }
};

var SliderWithTooltip = {
  data: function data() {
    return {
      visibles: []
    };
  },

  methods: {
    handleTooltipVisibleChange: function handleTooltipVisibleChange(index, visible) {
      this.visibles[index] = visible;
      this.visibles = _extends({}, this.visibles);
    },
    handleRange: function handleRange(h, _ref) {
      var _this = this;

      var value = _ref.value,
          dragging = _ref.dragging,
          index = _ref.index,
          disabled = _ref.disabled,
          style = _ref.style,
          restProps = _objectWithoutProperties(_ref, ['value', 'dragging', 'index', 'disabled', 'style']);

      var tipFormatter = function tipFormatter(value) {
        return value + '%';
      };
      var tipProps = { overlayClassName: 'foo' };

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
          visible: !disabled && (this.visibles[index] || dragging) || visible
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
          },
          visibleChange: log
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

    return h(Slider, {
      attrs: { handle: this.handleRange }
    });
  }
};

export default {
  render: function render() {
    var h = arguments[0];

    var style = { width: '400px', margin: '50px' };
    var pStyle = { margin: '20px 0' };

    return h('div', [h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Basic Slider']
      ), h(Slider, {
        on: {
          'change': log
        }
      })]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Basic Slider\uFF0C`step=20`']
      ), h(Slider, {
        attrs: { step: 20, defaultValue: 50 },
        on: {
          'beforeChange': log
        }
      })]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Basic Slider\uFF0C`step=20, dots`']
      ), h(Slider, {
        attrs: { dots: true, step: 20, defaultValue: 100 },
        on: {
          'afterChange': log
        }
      })]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Basic Slider\uFF0C`step=20, dots, dotStyle=', "{borderColor: 'orange'}", ', activeDotStyle=', "{borderColor: 'yellow'}", '`']
      ), h(Slider, {
        attrs: { dots: true, step: 20, defaultValue: 100, dotStyle: { borderColor: 'orange' }, activeDotStyle: { borderColor: 'yellow' } },
        on: {
          'afterChange': log
        }
      })]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Slider with tooltip, with custom `tipFormatter`']
      ), h(SliderWithTooltip)]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Slider with custom handle and track style.', h('strong', ['(old api, will be deprecated)'])]
      ), h(Slider, {
        attrs: {
          defaultValue: 30,
          maximumTrackStyle: { backgroundColor: 'red', height: '10px' },
          minimumTrackStyle: { backgroundColor: 'blue', height: '10px' },
          handleStyle: {
            borderColor: 'blue',
            height: '28px',
            width: '28px',
            marginLeft: '-14px',
            marginTop: '-9px',
            backgroundColor: 'black'
          }
        }
      })]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Slider with custom handle and track style.', h('strong', ['(The recommended new api)'])]
      ), h(Slider, {
        attrs: {
          defaultValue: 30,
          trackStyle: { backgroundColor: 'blue', height: '10px' },
          handleStyle: {
            borderColor: 'blue',
            height: '28px',
            width: '28px',
            marginLeft: '-14px',
            marginTop: '-9px',
            backgroundColor: 'black'
          },
          railStyle: { backgroundColor: 'red', height: '10px' }
        }
      })]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Basic Slider, disabled']
      ), h(Slider, {
        on: {
          'change': log
        },
        attrs: { disabled: true }
      })]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Controlled Slider']
      ), h(Slider, {
        attrs: { value: 50 }
      })]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Customized Slider']
      ), h(CustomizedSlider)]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Slider with dynamic `min` `max`']
      ), h(DynamicBounds)]
    )]);
  }
};