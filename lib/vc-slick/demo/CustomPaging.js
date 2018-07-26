'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../assets/index.less');

var _slider = require('../src/slider');

var _slider2 = _interopRequireDefault(_slider);

var _imglist = require('./imglist');

var _imglist2 = _interopRequireDefault(_imglist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var abstract01 = _imglist2['default'].abstract01,
    abstract02 = _imglist2['default'].abstract02,
    abstract03 = _imglist2['default'].abstract03,
    abstract04 = _imglist2['default'].abstract04;
exports['default'] = {
  render: function render() {
    var h = arguments[0];

    var settings = {
      props: {
        dots: true,
        dotsClass: 'slick-dots slick-thumb',
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      },
      scopedSlots: {
        customPaging: function customPaging(_ref) {
          var i = _ref.i;

          return h('a', [h('img', {
            attrs: { src: _imglist2['default']['abstract0' + (i + 1)] }
          })]);
        }
      }
    };
    return h('div', [h('h2', ['Custom Paging']), h(
      _slider2['default'],
      settings,
      [h('div', [h('img', {
        attrs: { src: abstract01 }
      })]), h('div', [h('img', {
        attrs: { src: abstract02 }
      })]), h('div', [h('img', {
        attrs: { src: abstract03 }
      })]), h('div', [h('img', {
        attrs: { src: abstract04 }
      })])]
    )]);
  }
};
module.exports = exports['default'];