'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var defaultProps = {
  accessibility: _vueTypes2['default'].bool.def(true),
  // 自定义高度
  adaptiveHeight: _vueTypes2['default'].bool.def(false),
  afterChange: _vueTypes2['default'].any.def(null),
  arrows: _vueTypes2['default'].bool.def(true),
  autoplay: _vueTypes2['default'].bool.def(false),
  autoplaySpeed: _vueTypes2['default'].number.def(3000),
  beforeChange: _vueTypes2['default'].any.def(null),
  centerMode: _vueTypes2['default'].bool.def(false),
  centerPadding: _vueTypes2['default'].string.def('50px'),
  cssEase: _vueTypes2['default'].string.def('ease'),
  dots: _vueTypes2['default'].bool.def(false),
  dotsClass: _vueTypes2['default'].string.def('slick-dots'),
  draggable: _vueTypes2['default'].bool.def(true),
  unslick: _vueTypes2['default'].bool.def(false),
  easing: _vueTypes2['default'].string.def('linear'),
  edgeFriction: _vueTypes2['default'].number.def(0.35),
  fade: _vueTypes2['default'].bool.def(false),
  focusOnSelect: _vueTypes2['default'].bool.def(false),
  infinite: _vueTypes2['default'].bool.def(true),
  initialSlide: _vueTypes2['default'].number.def(0),
  lazyLoad: _vueTypes2['default'].any.def(null),
  verticalSwiping: _vueTypes2['default'].bool.def(false),
  asNavFor: _vueTypes2['default'].any.def(null),
  // 圆点hover是否暂停
  pauseOnDotsHover: _vueTypes2['default'].bool.def(false),
  // focus是否暂停
  pauseOnFocus: _vueTypes2['default'].bool.def(false),
  // hover是否暂停
  pauseOnHover: _vueTypes2['default'].bool.def(true),
  responsive: _vueTypes2['default'].any.def(null),
  rows: _vueTypes2['default'].number.def(1),
  rtl: _vueTypes2['default'].bool.def(false),
  slide: _vueTypes2['default'].string.def('div'),
  slidesPerRow: _vueTypes2['default'].number.def(1),
  slidesToScroll: _vueTypes2['default'].number.def(1),
  slidesToShow: _vueTypes2['default'].number.def(1),
  speed: _vueTypes2['default'].number.def(500),
  swipe: _vueTypes2['default'].bool.def(true),
  swipeEvent: _vueTypes2['default'].any.def(null),
  swipeToSlide: _vueTypes2['default'].bool.def(false),
  touchMove: _vueTypes2['default'].bool.def(true),
  touchThreshold: _vueTypes2['default'].number.def(5),
  useCSS: _vueTypes2['default'].bool.def(true),
  useTransform: _vueTypes2['default'].bool.def(true),
  variableWidth: _vueTypes2['default'].bool.def(false),
  vertical: _vueTypes2['default'].bool.def(false),
  waitForAnimate: _vueTypes2['default'].bool.def(true),
  children: _vueTypes2['default'].array,
  __propsSymbol__: _vueTypes2['default'].any
};

exports['default'] = defaultProps;
module.exports = exports['default'];