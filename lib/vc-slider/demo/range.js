'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

require('../assets/index.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Range = _index2['default'].Range;

function log(value) {
  console.log(value); //eslint-disable-line
}

var CustomizedRange = {
  data: function data() {
    return {
      lowerBound: 20,
      upperBound: 40,
      value: [20, 40]
    };
  },

  methods: {
    onLowerBoundChange: function onLowerBoundChange(e) {
      this.lowerBound = +e.target.value;
    },
    onUpperBoundChange: function onUpperBoundChange(e) {
      this.upperBound = +e.target.value;
    },
    onSliderChange: function onSliderChange(value) {
      log(value);
      this.value = value;
    },
    handleApply: function handleApply() {
      this.value = [this.lowerBound, this.upperBound];
    }
  },
  render: function render() {
    var h = arguments[0];

    return h('div', [h('label', ['LowerBound: ']), h('input', {
      attrs: { type: 'number' },
      domProps: {
        'value': this.lowerBound
      },
      on: {
        'change': this.onLowerBoundChange
      }
    }), h('br'), h('label', ['UpperBound: ']), h('input', {
      attrs: { type: 'number' },
      domProps: {
        'value': this.upperBound
      },
      on: {
        'change': this.onUpperBoundChange
      }
    }), h('br'), h(
      'button',
      {
        on: {
          'click': this.handleApply
        }
      },
      ['Apply']
    ), h('br'), h('br'), h(Range, {
      attrs: { allowCross: false, value: this.value },
      on: {
        'change': this.onSliderChange
      }
    })]);
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
    }), h('br'), h('br'), h(Range, {
      attrs: { defaultValue: [20, 50], min: this.min, max: this.max
      },
      on: {
        'change': this.onSliderChange
      }
    })]);
  }
};

var ControlledRange = {
  data: function data() {
    return {
      value: [20, 40, 60, 80]
    };
  },

  methods: {
    handleChange: function handleChange(value) {
      this.value = value;
    }
  },
  render: function render() {
    var h = arguments[0];

    return h(Range, {
      attrs: { value: this.value },
      on: {
        'change': this.handleChange
      }
    });
  }
};

var ControlledRangeDisableAcross = {
  props: {
    pushable: [Number, Boolean]
  },
  data: function data() {
    return {
      value: [20, 40, 60, 80]
    };
  },

  methods: {
    handleChange: function handleChange(value) {
      this.value = value;
    }
  },
  render: function render() {
    var h = arguments[0];

    var rangeRange = {
      props: (0, _extends3['default'])({
        value: this.value,
        allowCross: false
      }, this.$props),
      on: {
        change: this.handleChange
      }
    };
    return h(Range, rangeRange);
  }
};

var PureRenderRange = {
  data: function data() {
    return {
      foo: false
    };
  },

  methods: {
    handleChange: function handleChange(value) {
      console.log(value);
      this.foo = !this.foo;
    }
  },
  render: function render() {
    var h = arguments[0];

    return h(Range, {
      attrs: { defaultValue: [20, 40, 60, 80], allowCross: false },
      on: {
        'change': this.handleChange
      }
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
        ['Basic Range\uFF0C`allowCross=false`']
      ), h(Range, {
        attrs: { allowCross: false, defaultValue: [0, 20] },
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
        ['Basic Range\uFF0C`step=20` ']
      ), h(Range, {
        attrs: { step: 20, defaultValue: [20, 20] },
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
        ['Basic Range\uFF0C`step=20, dots` ']
      ), h(Range, {
        attrs: { dots: true, step: 20, defaultValue: [20, 40] },
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
        ['Basic Range\uFF0Cdisabled']
      ), h(Range, {
        attrs: { allowCross: false, defaultValue: [0, 20], disabled: true },
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
        ['Controlled Range']
      ), h(ControlledRange)]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Controlled Range, not allow across']
      ), h(ControlledRangeDisableAcross)]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Controlled Range, not allow across, pushable=5']
      ), h(ControlledRangeDisableAcross, {
        attrs: { pushable: 5 }
      })]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Multi Range']
      ), h(Range, {
        attrs: { count: 3, defaultValue: [20, 40, 60, 80], pushable: true }
      })]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Multi Range with custom track and handle style']
      ), h(Range, {
        attrs: { count: 3, defaultValue: [20, 40, 60, 80], pushable: true,
          trackStyle: [{ backgroundColor: 'red' }, { backgroundColor: 'green' }],
          handleStyle: [{ backgroundColor: 'yellow' }, { backgroundColor: 'gray' }],
          railStyle: { backgroundColor: 'black' }
        }
      })]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Customized Range']
      ), h(CustomizedRange)]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Range with dynamic `max` `min`']
      ), h(DynamicBounds)]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Range as child component']
      ), h(PureRenderRange)]
    )]);
  }
};
module.exports = exports['default'];