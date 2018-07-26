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
  data: function data() {
    return {
      slideIndex: 0,
      updateCount: 0
    };
  },
  render: function render() {
    var _this = this;

    var h = arguments[0];

    var settings = {
      props: {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: function afterChange() {
          _this.updateCount = _this.updateCount + 1;
        },
        beforeChange: function beforeChange(current, next) {
          _this.slideIndex = next;
        }
      },
      ref: 'slider'
    };
    return h('div', [h('h2', ['Slick Go To']), h('p', ['Total updates: ', this.updateCount, ' ']), h('input', {
      on: {
        'input': function input(e) {
          return _this.$refs.slider.slickGoTo(e.target.value);
        }
      },
      domProps: {
        'value': this.slideIndex
      },
      attrs: {
        type: 'range',
        min: 0,
        max: 3
      }
    }), h(
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