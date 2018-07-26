import '../assets/index.less';
import Slider from '../src/slider';

export default {
  data: function data() {
    return {
      display: true,
      width: 600
    };
  },
  render: function render() {
    var _this = this;

    var h = arguments[0];

    var settings = {
      props: {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1
      }
    };
    return h('div', [h('h2', [' Resizable Collapsible ']), h(
      'button',
      {
        'class': 'button',
        on: {
          'click': function click() {
            _this.width = _this.width + 100;
          }
        }
      },
      [' ', 'increase', ' ']
    ), h(
      'button',
      {
        'class': 'button',
        on: {
          'click': function click() {
            _this.width = _this.width - 100;
          }
        }
      },
      [' ', 'decrease', ' ']
    ), h(
      'button',
      {
        'class': 'button',
        on: {
          'click': function click() {
            _this.display = !_this.display;
          }
        }
      },
      [' ', 'toggle', ' ']
    ), h(
      'div',
      {
        style: {
          width: this.width + 'px',
          display: this.display ? 'block' : 'none'
        }
      },
      [h(
        Slider,
        settings,
        [h('div', [h('h3', ['1'])]), h('div', [h('h3', ['2'])]), h('div', [h('h3', ['3'])]), h('div', [h('h3', ['4'])]), h('div', [h('h3', ['5'])]), h('div', [h('h3', ['6'])])]
      )]
    )]);
  }
};