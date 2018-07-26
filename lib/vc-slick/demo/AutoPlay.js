'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../assets/index.less');

var _slider = require('../src/slider');

var _slider2 = _interopRequireDefault(_slider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  render: function render() {
    var h = arguments[0];

    var settings = {
      props: {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        speed: 2000,
        autoplaySpeed: 2000,
        cssEase: 'linear'
      }
    };
    return h('div', [h('h2', ['Auto Play']), h(
      _slider2['default'],
      settings,
      [h('div', [h('h3', ['1'])]), h('div', [h('h3', ['2'])]), h('div', [h('h3', ['3'])]), h('div', [h('h3', ['4'])]), h('div', [h('h3', ['5'])]), h('div', [h('h3', ['6'])])]
    )]);
  }
};
module.exports = exports['default'];