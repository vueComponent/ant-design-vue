'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../assets/index.less');

var _slider = require('../src/slider');

var _slider2 = _interopRequireDefault(_slider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  data: function data() {
    return {
      slides: [1, 2, 3, 4, 5, 6]
    };
  },

  methods: {
    click: function click() {
      this.slides = this.slides.length === 6 ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [1, 2, 3, 4, 5, 6];
    }
  },
  render: function render() {
    var h = arguments[0];

    var settings = {
      props: {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3
      }
    };
    return h('div', [h('h2', ['Dynamic slides']), h(
      'button',
      { 'class': 'button', on: {
          'click': this.click
        }
      },
      ['Click to change slide count']
    ), h(
      _slider2['default'],
      settings,
      [this.slides.map(function (slide) {
        return h(
          'div',
          { key: slide },
          [h('h3', [slide])]
        );
      })]
    )]);
  }
};
module.exports = exports['default'];