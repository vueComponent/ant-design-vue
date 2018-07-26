'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../assets/index.less');

var _slider = require('../src/slider');

var _slider2 = _interopRequireDefault(_slider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var CustomSlide = {
  props: ['index'],
  render: function render() {
    var h = arguments[0];

    return h('div', [h('h3', [this.index])]);
  }
};

exports['default'] = {
  render: function render() {
    var h = arguments[0];

    var settings = {
      props: {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      }
    };
    return h('div', [h('h2', ['Custom Slides']), h(
      _slider2['default'],
      settings,
      [h(CustomSlide, {
        attrs: { index: 1 }
      }), h(CustomSlide, {
        attrs: { index: 2 }
      }), h(CustomSlide, {
        attrs: { index: 3 }
      }), h(CustomSlide, {
        attrs: { index: 4 }
      }), h(CustomSlide, {
        attrs: { index: 5 }
      }), h(CustomSlide, {
        attrs: { index: 6 }
      })]
    )]);
  }
};
module.exports = exports['default'];