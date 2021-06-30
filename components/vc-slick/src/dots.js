import classnames from '../../_util/classNames';
import { cloneElement } from '../../_util/vnode';

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
  const dots = Array.apply(
    null,
    Array(dotCount + 1)
      .join('0')
      .split(''),
  ).map((x, i) => {
    const leftBound = i * slidesToScroll;
    const rightBound = i * slidesToScroll + (slidesToScroll - 1);
    const className = classnames({
      'slick-active': currentSlide >= leftBound && currentSlide <= rightBound,
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
    return (
      <li key={i} class={className}>
        {cloneElement(customPaging({ i }), {
          onClick,
        })}
      </li>
    );
  });

  return cloneElement(appendDots({ dots }), {
    class: dotsClass,
    ...mouseEvents,
  });
};

Dots.inheritAttrs = false;

export default Dots;
