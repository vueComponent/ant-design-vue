import Slider from '../index';
import '../assets/index.less';

export default {
  render: function render() {
    var h = arguments[0];

    var style = { width: '400px', margin: '50px' };
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
    return h('div', [h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Slider with marks, `step=null`']
      ), h(Slider, {
        attrs: { min: -10, marks: marks, step: null, defaultValue: 20 },
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
      ), h(Slider, {
        attrs: { dots: true, min: -10, marks: marks, step: 10, defaultValue: 20 },
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
      ), h(Slider, {
        attrs: { min: -10, marks: marks, included: false, defaultValue: 20 }
      })]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Slider with marks and steps, `included=false`']
      ), h(Slider, {
        attrs: { min: -10, marks: marks, step: 10, included: false, defaultValue: 20 }
      })]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Range with marks']
      ), h(Slider.Range, {
        attrs: { min: -10, marks: marks, defaultValue: [20, 25, 30, 40] },
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
      ), h(Slider.Range, {
        attrs: { min: -10, marks: marks, step: 10, defaultValue: [20, 40] },
        on: {
          'change': log
        }
      })]
    )]);
  }
};