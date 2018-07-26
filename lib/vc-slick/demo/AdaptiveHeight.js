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
      'class': '',
      props: {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true
      }
    };
    return h('div', [h('h2', ['Adaptive height']), h(
      _slider2['default'],
      settings,
      [h('div', [h('h3', ['1'])]), h('div', [h('h3', ['2']), h('p', ['Hello'])]), h('div', [h('h3', ['3']), h('p', ['See ....']), h('p', ['Height is adaptive'])]), h('div', [h('h3', ['4'])]), h('div', [h('h3', ['5'])]), h('div', [h('h3', ['6'])])]
    )]);
  }
};
module.exports = exports['default'];