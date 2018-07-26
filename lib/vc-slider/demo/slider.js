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

var Handle = _index2['default'].Handle;


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

    return h(_index2['default'], {
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
    }), h('br'), h('br'), h(_index2['default'], {
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
      this.visibles = (0, _extends3['default'])({}, this.visibles);
    },
    handleRange: function handleRange(h, _ref) {
      var _this = this;

      var value = _ref.value,
          dragging = _ref.dragging,
          index = _ref.index,
          disabled = _ref.disabled,
          style = _ref.style,
          restProps = (0, _objectWithoutProperties3['default'])(_ref, ['value', 'dragging', 'index', 'disabled', 'style']);

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
          visible: !disabled && (this.visibles[index] || dragging) || visible
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
          },
          visibleChange: log
        },
        style: (0, _extends3['default'])({}, handleStyleWithIndex)
      };

      return h(
        _vcTooltip2['default'],
        tooltipProps,
        [h(Handle, handleProps)]
      );
    }
  },
  render: function render() {
    var h = arguments[0];

    return h(_index2['default'], {
      attrs: { handle: this.handleRange }
    });
  }
};

exports['default'] = {
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
      ), h(_index2['default'], {
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
      ), h(_index2['default'], {
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
      ), h(_index2['default'], {
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
      ), h(_index2['default'], {
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
      ), h(_index2['default'], {
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
      ), h(_index2['default'], {
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
      ), h(_index2['default'], {
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
      ), h(_index2['default'], {
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
module.exports = exports['default'];