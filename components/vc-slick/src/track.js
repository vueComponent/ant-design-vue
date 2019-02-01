import classnames from 'classnames';
import { cloneElement } from '../../_util/vnode';
import { getStyle, getClass } from '../../_util/props-util';
import { lazyStartIndex, lazyEndIndex, getPreClones } from './utils/innerSliderUtils';

// given specifications/props for a slide, fetch all the classes that need to be applied to the slide
const getSlideClasses = spec => {
  let slickActive, slickCenter;
  let centerOffset, index;

  if (spec.rtl) {
    index = spec.slideCount - 1 - spec.index;
  } else {
    index = spec.index;
  }
  const slickCloned = index < 0 || index >= spec.slideCount;
  if (spec.centerMode) {
    centerOffset = Math.floor(spec.slidesToShow / 2);
    slickCenter = (index - spec.currentSlide) % spec.slideCount === 0;
    if (index > spec.currentSlide - centerOffset - 1 && index <= spec.currentSlide + centerOffset) {
      slickActive = true;
    }
  } else {
    slickActive = spec.currentSlide <= index && index < spec.currentSlide + spec.slidesToShow;
  }
  const slickCurrent = index === spec.currentSlide;
  return {
    'slick-slide': true,
    'slick-active': slickActive,
    'slick-center': slickCenter,
    'slick-cloned': slickCloned,
    'slick-current': slickCurrent, // dubious in case of RTL
  };
};

const getSlideStyle = function(spec) {
  const style = {};

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
    style.transition =
      'opacity ' +
      spec.speed +
      'ms ' +
      spec.cssEase +
      ', ' +
      'visibility ' +
      spec.speed +
      'ms ' +
      spec.cssEase;
    style.WebkitTransition =
      'opacity ' +
      spec.speed +
      'ms ' +
      spec.cssEase +
      ', ' +
      'visibility ' +
      spec.speed +
      'ms ' +
      spec.cssEase;
  }

  return style;
};

const getKey = (child, fallbackKey) => child.key || (child.key === 0 && '0') || fallbackKey;

const renderSlides = function(spec, children, createElement) {
  let key;
  const slides = [];
  const preCloneSlides = [];
  const postCloneSlides = [];
  const childrenCount = children.length;
  const startIndex = lazyStartIndex(spec);
  const endIndex = lazyEndIndex(spec);

  children.forEach((elem, index) => {
    let child;
    const childOnClickOptions = {
      message: 'children',
      index: index,
      slidesToScroll: spec.slidesToScroll,
      currentSlide: spec.currentSlide,
    };

    // in case of lazyLoad, whether or not we want to fetch the slide
    if (!spec.lazyLoad || (spec.lazyLoad && spec.lazyLoadedList.indexOf(index) >= 0)) {
      child = elem;
    } else {
      child = createElement('div');
    }
    const childStyle = getSlideStyle({ ...spec, index });
    const slideClass = getClass(child.context) || '';
    let slideClasses = getSlideClasses({ ...spec, index });
    // push a cloned element of the desired slide
    slides.push(
      cloneElement(
        child,
        {
          key: 'original' + getKey(child, index),
          attrs: {
            tabIndex: '-1',
            'data-index': index,
            'aria-hidden': !slideClasses['slick-active'],
          },
          class: classnames(slideClasses, slideClass),
          style: { outline: 'none', ...(getStyle(child.context) || {}), ...childStyle },
          on: {
            click: () => {
              // child.props && child.props.onClick && child.props.onClick(e)
              if (spec.focusOnSelect) {
                spec.focusOnSelect(childOnClickOptions);
              }
            },
          },
        },
        true,
      ),
    );

    // if slide needs to be precloned or postcloned
    if (spec.infinite && spec.fade === false) {
      const preCloneNo = childrenCount - index;
      if (preCloneNo <= getPreClones(spec) && childrenCount !== spec.slidesToShow) {
        key = -preCloneNo;
        if (key >= startIndex) {
          child = elem;
        }
        slideClasses = getSlideClasses({ ...spec, index: key });
        preCloneSlides.push(
          cloneElement(child, {
            key: 'precloned' + getKey(child, key),
            class: classnames(slideClasses, slideClass),
            attrs: {
              tabIndex: '-1',
              'data-index': key,
              'aria-hidden': !slideClasses['slick-active'],
            },
            style: { ...(getStyle(child.context) || {}), ...childStyle },
            on: {
              click: () => {
                // child.props && child.props.onClick && child.props.onClick(e)
                if (spec.focusOnSelect) {
                  spec.focusOnSelect(childOnClickOptions);
                }
              },
            },
          }),
        );
      }

      if (childrenCount !== spec.slidesToShow) {
        key = childrenCount + index;
        if (key < endIndex) {
          child = elem;
        }
        slideClasses = getSlideClasses({ ...spec, index: key });
        postCloneSlides.push(
          cloneElement(child, {
            key: 'postcloned' + getKey(child, key),
            attrs: {
              tabIndex: '-1',
              'data-index': key,
              'aria-hidden': !slideClasses['slick-active'],
            },
            class: classnames(slideClasses, slideClass),
            style: { ...(getStyle(child.context) || {}), ...childStyle },
            on: {
              click: () => {
                // child.props && child.props.onClick && child.props.onClick(e)
                if (spec.focusOnSelect) {
                  spec.focusOnSelect(childOnClickOptions);
                }
              },
            },
          }),
        );
      }
    }
  });
  if (spec.rtl) {
    return preCloneSlides.concat(slides, postCloneSlides).reverse();
  } else {
    return preCloneSlides.concat(slides, postCloneSlides);
  }
};

export default {
  functional: true,
  render(createElement, context) {
    const { props, listeners, children, data } = context;
    const slides = renderSlides(props, children, createElement);
    const { mouseenter, mouseover, mouseleave } = listeners;
    const mouseEvents = { mouseenter, mouseover, mouseleave };
    const trackProps = {
      class: 'slick-track',
      style: props.trackStyle,
      on: {
        ...mouseEvents,
      },
      directives: data.directives,
    };
    return <div {...trackProps}>{slides}</div>;
  },
};
