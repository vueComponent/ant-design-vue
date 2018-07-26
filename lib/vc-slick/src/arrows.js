'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NextArrow = exports.PrevArrow = undefined;

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _vnode = require('../../_util/vnode');

var _innerSliderUtils = require('./utils/innerSliderUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

var PrevArrow = exports.PrevArrow = {
  functional: true,
  clickHandler: function clickHandler(options, handle, e) {
    if (e) {
      e.preventDefault();
    }
    handle(options, e);
  },
  render: function render(createElement, context) {
    var h = arguments[0];
    var props = context.props;
    var clickHandler = props.clickHandler,
        infinite = props.infinite,
        currentSlide = props.currentSlide,
        slideCount = props.slideCount,
        slidesToShow = props.slidesToShow;

    var prevClasses = { 'slick-arrow': true, 'slick-prev': true };
    var prevHandler = function prevHandler(e) {
      if (e) {
        e.preventDefault();
      }
      clickHandler({ message: 'previous' });
    };

    if (!infinite && (currentSlide === 0 || slideCount <= slidesToShow)) {
      prevClasses['slick-disabled'] = true;
      prevHandler = noop;
    }

    var prevArrowProps = {
      key: '0',
      domProps: {
        'data-role': 'none'
      },
      'class': prevClasses,
      style: { display: 'block' },
      on: {
        click: prevHandler
      }
    };
    var customProps = {
      currentSlide: currentSlide,
      slideCount: slideCount
    };
    var prevArrow = void 0;

    if (props.prevArrow) {
      prevArrow = (0, _vnode.cloneElement)(props.prevArrow((0, _extends3['default'])({}, prevArrowProps, {
        props: customProps
      })), {
        key: '0',
        'class': prevClasses,
        style: { display: 'block' },
        on: {
          click: prevHandler
        }
      });
    } else {
      prevArrow = h(
        'button',
        (0, _babelHelperVueJsxMergeProps2['default'])([{ key: '0', attrs: { type: 'button' }
        }, prevArrowProps]),
        [' ', 'Previous']
      );
    }

    return prevArrow;
  }
};

var NextArrow = exports.NextArrow = {
  functional: true,
  clickHandler: function clickHandler(options, handle, e) {
    if (e) {
      e.preventDefault();
    }
    handle(options, e);
  },
  render: function render(createElement, context) {
    var h = arguments[0];
    var props = context.props;
    var clickHandler = props.clickHandler,
        currentSlide = props.currentSlide,
        slideCount = props.slideCount;


    var nextClasses = { 'slick-arrow': true, 'slick-next': true };
    var nextHandler = function nextHandler(e) {
      if (e) {
        e.preventDefault();
      }
      clickHandler({ message: 'next' });
    };
    if (!(0, _innerSliderUtils.canGoNext)(props)) {
      nextClasses['slick-disabled'] = true;
      nextHandler = noop;
    }

    var nextArrowProps = {
      key: '1',
      domProps: {
        'data-role': 'none'
      },
      'class': nextClasses,
      style: { display: 'block' },
      on: {
        click: nextHandler
      }
    };
    var customProps = {
      currentSlide: currentSlide,
      slideCount: slideCount
    };
    var nextArrow = void 0;

    if (props.nextArrow) {
      nextArrow = (0, _vnode.cloneElement)(props.nextArrow((0, _extends3['default'])({}, nextArrowProps, {
        props: customProps
      })), {
        key: '1',
        'class': nextClasses,
        style: { display: 'block' },
        on: {
          click: nextHandler
        }
      });
    } else {
      nextArrow = h(
        'button',
        (0, _babelHelperVueJsxMergeProps2['default'])([{ key: '1', attrs: { type: 'button' }
        }, nextArrowProps]),
        [' ', 'Next']
      );
    }

    return nextArrow;
  }
};