'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _vnode = require('../../_util/vnode');

var _propsUtil = require('../../_util/props-util');

var _innerSliderUtils = require('./utils/innerSliderUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// given specifications/props for a slide, fetch all the classes that need to be applied to the slide
var getSlideClasses = function getSlideClasses(spec) {
  var slickActive = void 0,
      slickCenter = void 0;
  var centerOffset = void 0,
      index = void 0;

  if (spec.rtl) {
    index = spec.slideCount - 1 - spec.index;
  } else {
    index = spec.index;
  }
  var slickCloned = index < 0 || index >= spec.slideCount;
  if (spec.centerMode) {
    centerOffset = Math.floor(spec.slidesToShow / 2);
    slickCenter = (index - spec.currentSlide) % spec.slideCount === 0;
    if (index > spec.currentSlide - centerOffset - 1 && index <= spec.currentSlide + centerOffset) {
      slickActive = true;
    }
  } else {
    slickActive = spec.currentSlide <= index && index < spec.currentSlide + spec.slidesToShow;
  }
  var slickCurrent = index === spec.currentSlide;
  return {
    'slick-slide': true,
    'slick-active': slickActive,
    'slick-center': slickCenter,
    'slick-cloned': slickCloned,
    'slick-current': slickCurrent // dubious in case of RTL
  };
};

var getSlideStyle = function getSlideStyle(spec) {
  var style = {};

  if (spec.variableWidth === undefined || spec.variableWidth === false) {
    style.width = spec.slideWidth + (typeof spec.slideWidth === 'number' ? 'px' : '');
  }

  if (spec.fade) {
    style.position = 'relative';
    if (spec.vertical) {
      style.top = -spec.index * parseInt(spec.slideHeight) + 'px';
    } else {
      style.left = -spec.index * parseInt(spec.slideWidth) + 'px';
    }
    style.opacity = spec.currentSlide === spec.index ? 1 : 0;
    style.transition = 'opacity ' + spec.speed + 'ms ' + spec.cssEase + ', ' + 'visibility ' + spec.speed + 'ms ' + spec.cssEase;
    style.WebkitTransition = 'opacity ' + spec.speed + 'ms ' + spec.cssEase + ', ' + 'visibility ' + spec.speed + 'ms ' + spec.cssEase;
  }

  return style;
};

var getKey = function getKey(child, fallbackKey) {
  return child.key || child.key === 0 && '0' || fallbackKey;
};

var renderSlides = function renderSlides(spec, children, createElement) {
  var key = void 0;
  var slides = [];
  var preCloneSlides = [];
  var postCloneSlides = [];
  var childrenCount = children.length;
  var startIndex = (0, _innerSliderUtils.lazyStartIndex)(spec);
  var endIndex = (0, _innerSliderUtils.lazyEndIndex)(spec);

  children.forEach(function (elem, index) {
    var child = void 0;
    var childOnClickOptions = {
      message: 'children',
      index: index,
      slidesToScroll: spec.slidesToScroll,
      currentSlide: spec.currentSlide

      // in case of lazyLoad, whether or not we want to fetch the slide
    };if (!spec.lazyLoad || spec.lazyLoad && spec.lazyLoadedList.indexOf(index) >= 0) {
      child = elem;
    } else {
      child = createElement('div');
    }
    var childStyle = getSlideStyle((0, _extends3['default'])({}, spec, { index: index }));
    var slideClass = (0, _propsUtil.getClass)(child.context) || '';
    var slideClasses = getSlideClasses((0, _extends3['default'])({}, spec, { index: index }));
    // push a cloned element of the desired slide
    slides.push((0, _vnode.cloneElement)(child, {
      key: 'original' + getKey(child, index),
      attrs: {
        tabIndex: '-1',
        'data-index': index,
        'aria-hidden': !slideClasses['slick-active']
      },
      'class': (0, _classnames2['default'])(slideClasses, slideClass),
      style: (0, _extends3['default'])({ outline: 'none' }, (0, _propsUtil.getStyle)(child.context) || {}, childStyle),
      on: {
        click: function click(e) {
          // child.props && child.props.onClick && child.props.onClick(e)
          if (spec.focusOnSelect) {
            spec.focusOnSelect(childOnClickOptions);
          }
        }
      }
    }, true));

    // if slide needs to be precloned or postcloned
    if (spec.infinite && spec.fade === false) {
      var preCloneNo = childrenCount - index;
      if (preCloneNo <= (0, _innerSliderUtils.getPreClones)(spec) && childrenCount !== spec.slidesToShow) {
        key = -preCloneNo;
        if (key >= startIndex) {
          child = elem;
        }
        slideClasses = getSlideClasses((0, _extends3['default'])({}, spec, { index: key }));
        preCloneSlides.push((0, _vnode.cloneElement)(child, {
          key: 'precloned' + getKey(child, key),
          'class': (0, _classnames2['default'])(slideClasses, slideClass),
          attrs: {
            tabIndex: '-1',
            'data-index': key,
            'aria-hidden': !slideClasses['slick-active']
          },
          style: (0, _extends3['default'])({}, (0, _propsUtil.getStyle)(child.context) || {}, childStyle),
          on: {
            click: function click(e) {
              // child.props && child.props.onClick && child.props.onClick(e)
              if (spec.focusOnSelect) {
                spec.focusOnSelect(childOnClickOptions);
              }
            }
          }
        }));
      }

      if (childrenCount !== spec.slidesToShow) {
        key = childrenCount + index;
        if (key < endIndex) {
          child = elem;
        }
        slideClasses = getSlideClasses((0, _extends3['default'])({}, spec, { index: key }));
        postCloneSlides.push((0, _vnode.cloneElement)(child, {
          key: 'postcloned' + getKey(child, key),
          attrs: {
            tabIndex: '-1',
            'data-index': key,
            'aria-hidden': !slideClasses['slick-active']
          },
          'class': (0, _classnames2['default'])(slideClasses, slideClass),
          style: (0, _extends3['default'])({}, (0, _propsUtil.getStyle)(child.context) || {}, childStyle),
          on: {
            click: function click(e) {
              // child.props && child.props.onClick && child.props.onClick(e)
              if (spec.focusOnSelect) {
                spec.focusOnSelect(childOnClickOptions);
              }
            }
          }
        }));
      }
    }
  });
  if (spec.rtl) {
    return preCloneSlides.concat(slides, postCloneSlides).reverse();
  } else {
    return preCloneSlides.concat(slides, postCloneSlides);
  }
};

exports['default'] = {
  functional: true,
  render: function render(createElement, context) {
    var h = arguments[0];
    var props = context.props,
        listeners = context.listeners,
        children = context.children,
        data = context.data;

    var slides = renderSlides(props, children, createElement);
    var mouseenter = listeners.mouseenter,
        mouseover = listeners.mouseover,
        mouseleave = listeners.mouseleave;

    var mouseEvents = { mouseenter: mouseenter, mouseover: mouseover, mouseleave: mouseleave };
    var trackProps = {
      'class': 'slick-track',
      style: props.trackStyle,
      on: (0, _extends3['default'])({}, mouseEvents),
      directives: data.directives
    };
    return h(
      'div',
      trackProps,
      [slides]
    );
  }
};
module.exports = exports['default'];