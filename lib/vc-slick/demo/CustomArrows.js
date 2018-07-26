'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

require('../assets/index.less');

var _slider = require('../src/slider');

var _slider2 = _interopRequireDefault(_slider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  render: function render(h) {
    var settings = {
      props: {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1
      },
      scopedSlots: {
        nextArrow: function nextArrow(props) {
          var className = props['class'],
              style = props.style,
              click = props.on.click;

          return h('div', {
            'class': className,
            style: (0, _extends3['default'])({}, style, { display: 'block', background: 'red' }),
            on: {
              'click': click
            }
          });
        },
        prevArrow: function prevArrow(props) {
          var className = props['class'],
              style = props.style,
              click = props.on.click;

          return h('div', {
            'class': className,
            style: (0, _extends3['default'])({}, style, { display: 'block', background: 'green' }),
            on: {
              'click': click
            }
          });
        }
      }
    };
    return h('div', [h('h2', ['Custom Arrows']), h(
      _slider2['default'],
      settings,
      [h('div', [h('h3', ['1'])]), h('div', [h('h3', ['2'])]), h('div', [h('h3', ['3'])]), h('div', [h('h3', ['4'])]), h('div', [h('h3', ['5'])]), h('div', [h('h3', ['6'])])]
    )]);
  }
};
module.exports = exports['default'];