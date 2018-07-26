'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _LazyLoad = require('../src/LazyLoad');

var _LazyLoad2 = _interopRequireDefault(_LazyLoad);

require('./style.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Application = {
  render: function render() {
    var h = arguments[0];

    return h('div', ['Scroll to load images.', h('div', { 'class': 'filler' }), h(
      _LazyLoad2['default'],
      {
        attrs: { height: 762, offsetVertical: 300 }
      },
      [h('img', {
        attrs: { src: 'http://apod.nasa.gov/apod/image/1502/HDR_MVMQ20Feb2015ouellet1024.jpg' }
      })]
    ), h('div', { 'class': 'filler' }), h(
      _LazyLoad2['default'],
      {
        attrs: { height: 683, offsetVertical: 300 }
      },
      [h('img', {
        attrs: { src: 'http://apod.nasa.gov/apod/image/1502/2015_02_20_conj_bourque1024.jpg' }
      }), h('span')]
    ), h('div', { 'class': 'filler' }), h(
      'div',
      { 'class': 'ScrollableContainer' },
      [h('div', { 'class': 'filler' }), h('div', { 'class': 'filler' }), h('div', { 'class': 'filler' }), h(
        _LazyLoad2['default'],
        {
          attrs: { height: 480 }
        },
        [h('img', {
          attrs: { src: 'http://apod.nasa.gov/apod/image/1502/MarsPlume_jaeschke_480.gif' }
        })]
      )]
    ), h('div', { 'class': 'filler' }), h(
      _LazyLoad2['default'],
      {
        attrs: { height: 720, offsetVertical: 300 }
      },
      [h('img', {
        attrs: { src: 'http://apod.nasa.gov/apod/image/1502/ToadSky_Lane_1080_annotated.jpg' }
      })]
    ), h('div', { 'class': 'filler' })]);
  }
};

exports['default'] = Application;
module.exports = exports['default'];