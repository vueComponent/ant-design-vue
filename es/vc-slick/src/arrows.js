import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _extends from 'babel-runtime/helpers/extends';
import classnames from 'classnames';
import { cloneElement } from '../../_util/vnode';
import { canGoNext } from './utils/innerSliderUtils';

function noop() {}

export var PrevArrow = {
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
      prevArrow = cloneElement(props.prevArrow(_extends({}, prevArrowProps, {
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
        _mergeJSXProps([{ key: '0', attrs: { type: 'button' }
        }, prevArrowProps]),
        [' ', 'Previous']
      );
    }

    return prevArrow;
  }
};

export var NextArrow = {
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
    if (!canGoNext(props)) {
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
      nextArrow = cloneElement(props.nextArrow(_extends({}, nextArrowProps, {
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
        _mergeJSXProps([{ key: '1', attrs: { type: 'button' }
        }, nextArrowProps]),
        [' ', 'Next']
      );
    }

    return nextArrow;
  }
};