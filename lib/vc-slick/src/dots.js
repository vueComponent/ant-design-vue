'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _vnode = require('../../_util/vnode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var getDotCount = function getDotCount(spec) {
  var dots = void 0;

  if (spec.infinite) {
    dots = Math.ceil(spec.slideCount / spec.slidesToScroll);
  } else {
    dots = Math.ceil((spec.slideCount - spec.slidesToShow) / spec.slidesToScroll) + 1;
  }

  return dots;
};

exports['default'] = {
  functional: true,
  render: function render(createElement, context) {
    var h = arguments[0];
    var props = context.props,
        listeners = context.listeners;
    var slideCount = props.slideCount,
        slidesToScroll = props.slidesToScroll,
        slidesToShow = props.slidesToShow,
        infinite = props.infinite,
        currentSlide = props.currentSlide,
        appendDots = props.appendDots,
        customPaging = props.customPaging,
        clickHandler = props.clickHandler,
        dotsClass = props.dotsClass;

    var dotCount = getDotCount({
      slideCount: slideCount,
      slidesToScroll: slidesToScroll,
      slidesToShow: slidesToShow,
      infinite: infinite
    });

    // Apply join & split to Array to pre-fill it for IE8
    //
    // Credit: http://stackoverflow.com/a/13735425/1849458
    var mouseenter = listeners.mouseenter,
        mouseover = listeners.mouseover,
        mouseleave = listeners.mouseleave;

    var mouseEvents = { mouseenter: mouseenter, mouseover: mouseover, mouseleave: mouseleave };
    var dots = Array.apply(null, Array(dotCount + 1).join('0').split('')).map(function (x, i) {
      var leftBound = i * slidesToScroll;
      var rightBound = i * slidesToScroll + (slidesToScroll - 1);
      var className = (0, _classnames2['default'])({
        'slick-active': currentSlide >= leftBound && currentSlide <= rightBound
      });

      var dotOptions = {
        message: 'dots',
        index: i,
        slidesToScroll: slidesToScroll,
        currentSlide: currentSlide
      };
      function onClick(e) {
        // In Autoplay the focus stays on clicked button even after transition
        // to next slide. That only goes away by click somewhere outside
        if (e) {
          e.preventDefault();
        }
        clickHandler(dotOptions);
      }
      return h(
        'li',
        { key: i, 'class': className },
        [(0, _vnode.cloneElement)(customPaging({ i: i }), { on: {
            click: onClick
          } })]
      );
    });

    return (0, _vnode.cloneElement)(appendDots({ dots: dots }), {
      'class': dotsClass,
      on: (0, _extends3['default'])({}, mouseEvents)
    });
  }
};
module.exports = exports['default'];