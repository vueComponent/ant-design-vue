import { cloneElement } from '../../_util/vnode';
import { canGoNext } from './utils/innerSliderUtils';

function noop() {}

export const PrevArrow = {
  functional: true,
  clickHandler(options, handle, e) {
    if (e) {
      e.preventDefault();
    }
    handle(options, e);
  },
  render(createElement, context) {
    const { props } = context;
    const { clickHandler, infinite, currentSlide, slideCount, slidesToShow } = props;
    const prevClasses = { 'slick-arrow': true, 'slick-prev': true };
    let prevHandler = function(e) {
      if (e) {
        e.preventDefault();
      }
      clickHandler({ message: 'previous' });
    };

    if (!infinite && (currentSlide === 0 || slideCount <= slidesToShow)) {
      prevClasses['slick-disabled'] = true;
      prevHandler = noop;
    }

    const prevArrowProps = {
      key: '0',
      domProps: {
        'data-role': 'none',
      },
      class: prevClasses,
      style: { display: 'block' },
      on: {
        click: prevHandler,
      },
    };
    const customProps = {
      currentSlide: currentSlide,
      slideCount: slideCount,
    };
    let prevArrow;

    if (props.prevArrow) {
      prevArrow = cloneElement(
        props.prevArrow({
          ...prevArrowProps,
          ...{
            props: customProps,
          },
        }),
        {
          key: '0',
          class: prevClasses,
          style: { display: 'block' },
          on: {
            click: prevHandler,
          },
        },
      );
    } else {
      prevArrow = (
        <button key="0" type="button" {...prevArrowProps}>
          {' '}
          Previous
        </button>
      );
    }

    return prevArrow;
  },
};

export const NextArrow = {
  functional: true,
  clickHandler(options, handle, e) {
    if (e) {
      e.preventDefault();
    }
    handle(options, e);
  },
  render(createElement, context) {
    const { props } = context;
    const { clickHandler, currentSlide, slideCount } = props;

    const nextClasses = { 'slick-arrow': true, 'slick-next': true };
    let nextHandler = function(e) {
      if (e) {
        e.preventDefault();
      }
      clickHandler({ message: 'next' });
    };
    if (!canGoNext(props)) {
      nextClasses['slick-disabled'] = true;
      nextHandler = noop;
    }

    const nextArrowProps = {
      key: '1',
      domProps: {
        'data-role': 'none',
      },
      class: nextClasses,
      style: { display: 'block' },
      on: {
        click: nextHandler,
      },
    };
    const customProps = {
      currentSlide: currentSlide,
      slideCount: slideCount,
    };
    let nextArrow;

    if (props.nextArrow) {
      nextArrow = cloneElement(
        props.nextArrow({
          ...nextArrowProps,
          ...{
            props: customProps,
          },
        }),
        {
          key: '1',
          class: nextClasses,
          style: { display: 'block' },
          on: {
            click: nextHandler,
          },
        },
      );
    } else {
      nextArrow = (
        <button key="1" type="button" {...nextArrowProps}>
          {' '}
          Next
        </button>
      );
    }

    return nextArrow;
  },
};
