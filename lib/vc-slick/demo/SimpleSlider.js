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
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      }
    };
    return h(
      'div',
      { style: { width: '80%', margin: '0 auto' } },
      [h('h2', [' Single Item']), h(
        _slider2['default'],
        settings,
        [h(
          'div',
          {
            on: {
              'click': function click(e) {
                return alert(e);
              }
            }
          },
          [h('h3', ['1'])]
        ), h('div', [h('h3', ['2'])]), h('div', [h('h3', ['3'])]), h('div', [h('h3', ['4'])]), h('div', [h('h3', ['5'])]), h('div', [h('h3', ['6'])])]
      )]
    );
  }
};
module.exports = exports['default'];