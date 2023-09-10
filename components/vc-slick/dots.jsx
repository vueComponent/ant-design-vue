import classnames from '../_util/classNames';
import { cloneElement } from '../_util/vnode';
import { clamp } from './utils/innerSliderUtils';

const getDotCount = function (spec) {
  let dots;

  if (spec.infinite) {
    dots = Math.ceil(spec.slideCount / spec.slidesToScroll);
  } else {
    dots = Math.ceil((spec.slideCount - spec.slidesToShow) / spec.slidesToScroll) + 1;
  }

  return dots;
};

const Dots = (_, { attrs }) => {
  const {
    slideCount,
    slidesToScroll,
    slidesToShow,
    infinite,
    currentSlide,
    appendDots,
    customPaging,
    clickHandler,
    dotsClass,
    onMouseenter,
    onMouseover,
    onMouseleave,
  } = attrs;
  const dotCount = getDotCount({
    slideCount,
    slidesToScroll,
    slidesToShow,
    infinite,
  });

  // Apply join & split to Array to pre-fill it for IE8
  //
  // Credit: http://stackoverflow.com/a/13735425/1849458
  const mouseEvents = { onMouseenter, onMouseover, onMouseleave };
  let dots = [];
  for (let i = 0; i < dotCount; i++) {
    const _rightBound = (i + 1) * slidesToScroll - 1;
    const rightBound = infinite ? _rightBound : clamp(_rightBound, 0, slideCount - 1);
    const _leftBound = rightBound - (slidesToScroll - 1);
    const leftBound = infinite ? _leftBound : clamp(_leftBound, 0, slideCount - 1);

    const className = classnames({
      'slick-active': infinite
        ? currentSlide >= leftBound && currentSlide <= rightBound
        : currentSlide === leftBound,
    });

    const dotOptions = {
      message: 'dots',
      index: i,
      slidesToScroll,
      currentSlide,
    };

    function onClick(e) {
      // In Autoplay the focus stays on clicked button even after transition
      // to next slide. That only goes away by click somewhere outside
      if (e) {
        e.preventDefault();
      }
      clickHandler(dotOptions);
    }
    dots = dots.concat(
      <li key={i} class={className}>
        {cloneElement(customPaging({ i }), { onClick })}
      </li>,
    );
  }

  return cloneElement(appendDots({ dots }), {
    class: dotsClass,
    ...mouseEvents,
  });
};

Dots.inheritAttrs = false;

export default Dots;
