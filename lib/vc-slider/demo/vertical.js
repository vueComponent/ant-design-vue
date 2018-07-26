'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

require('../assets/index.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  render: function render() {
    var h = arguments[0];

    var style = { float: 'left', width: '160px', height: '400px', marginBottom: '160px', marginLeft: '50px' };
    var parentStyle = { overflow: 'hidden' };
    var pStyle = { margin: '20px 0' };
    var marks = {
      '-10': '-10°C',
      0: h('strong', ['0\xB0C']),
      26: '26°C',
      37: '37°C',
      50: '50°C',
      100: {
        style: {
          color: 'red'
        },
        label: h('strong', ['100\xB0C'])
      }
    };

    function log(value) {
      console.log(value); //eslint-disable-line
    }
    return h(
      'div',
      { style: parentStyle },
      [h(
        'div',
        { style: style },
        [h(
          'p',
          { style: pStyle },
          ['Slider with marks, `step=null`']
        ), h(_index2['default'], {
          attrs: { vertical: true, min: -10, marks: marks, step: null, defaultValue: 20 },
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
          ['Slider with marks and steps']
        ), h(_index2['default'], {
          attrs: { vertical: true, dots: true, min: -10, marks: marks, step: 10, defaultValue: 20 },
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
          ['Slider with marks, `included=false`']
        ), h(_index2['default'], {
          attrs: { vertical: true, min: -10, marks: marks, included: false, defaultValue: 20 }
        })]
      ), h(
        'div',
        { style: style },
        [h(
          'p',
          { style: pStyle },
          ['Slider with marks and steps, `included=false`']
        ), h(_index2['default'], {
          attrs: { vertical: true, min: -10, marks: marks, step: 10, included: false, defaultValue: 20 }
        })]
      ), h(
        'div',
        { style: style },
        [h(
          'p',
          { style: pStyle },
          ['Range with marks']
        ), h(_index2['default'].Range, {
          attrs: { vertical: true, min: -10, marks: marks, defaultValue: [20, 25, 30, 40] },
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
          ['Range with marks and steps']
        ), h(_index2['default'].Range, {
          attrs: { vertical: true, min: -10, marks: marks, step: 10, defaultValue: [20, 40] },
          on: {
            'change': log
          }
        })]
      )]
    );
  }
};
module.exports = exports['default'];