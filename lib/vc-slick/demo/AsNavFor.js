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
      nav1: null,
      nav2: null
    };
  },
  mounted: function mounted() {
    this.nav1 = this.$refs.slider1;
    this.nav2 = this.$refs.slider2;
  },
  render: function render() {
    var h = arguments[0];

    return h('div', [h('h2', ['Slider Syncing (AsNavFor)']), h('h4', ['First Slider']), h(
      _slider2['default'],
      {
        attrs: {
          asNavFor: this.nav2
        },
        ref: 'slider1'
      },
      [h('div', [h('h3', ['1'])]), h('div', [h('h3', ['2'])]), h('div', [h('h3', ['3'])]), h('div', [h('h3', ['4'])]), h('div', [h('h3', ['5'])]), h('div', [h('h3', ['6'])])]
    ), h('h4', ['Second Slider']), h(
      _slider2['default'],
      {
        attrs: {
          asNavFor: this.nav1,

          slidesToShow: 3,
          swipeToSlide: true,
          focusOnSelect: true
        },
        ref: 'slider2' },
      [h('div', [h('h3', ['1'])]), h('div', [h('h3', ['2'])]), h('div', [h('h3', ['3'])]), h('div', [h('h3', ['4'])]), h('div', [h('h3', ['5'])]), h('div', [h('h3', ['6'])])]
    )]);
  }
};
module.exports = exports['default'];