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
        infinite: true,
        centerPadding: '60px',
        slidesToShow: 5,
        swipeToSlide: true,
        afterChange: function afterChange(index) {
          console.log('Slider Changed to: ' + (index + 1) + ', background: #222; color: #bada55');
        }
      },
      'class': 'center'
    };
    return h('div', [h('h2', ['Swipe To Slide']), h(
      _slider2['default'],
      settings,
      [h('div', [h('h3', ['1'])]), h('div', [h('h3', ['2'])]), h('div', [h('h3', ['3'])]), h('div', [h('h3', ['4'])]), h('div', [h('h3', ['5'])]), h('div', [h('h3', ['6'])]), h('div', [h('h3', ['7'])]), h('div', [h('h3', ['8'])]), h('div', [h('h3', ['9'])])]
    )]);
  }
};
module.exports = exports['default'];