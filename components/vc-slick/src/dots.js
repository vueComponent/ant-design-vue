import classnames from 'classnames';
import { cloneElement } from '../../_util/vnode';

const getDotCount = function(spec) {
  let dots;

  if (spec.infinite) {
    dots = Math.ceil(spec.slideCount / spec.slidesToScroll);
  } else {
    dots = Math.ceil((spec.slideCount - spec.slidesToShow) / spec.slidesToScroll) + 1;
  }

  return dots;
};

export default {
  functional: true,
  render(createElement, context) {
    const { props, listeners } = context;
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
    } = props;
    const dotCount = getDotCount({
      slideCount: slideCount,
      slidesToScroll: slidesToScroll,
      slidesToShow: slidesToShow,
      infinite: infinite,
    });

    // Apply join & split to Array to pre-fill it for IE8
    //
    // Credit: http://stackoverflow.com/a/13735425/1849458
    const { mouseenter, mouseover, mouseleave } = listeners;
    const mouseEvents = { mouseenter, mouseover, mouseleave };
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
        slidesToScroll: slidesToScroll,
        currentSlide: currentSlide,
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
            on: {
              click: onClick,
            },
          })}
        </li>
      );
    });

    return cloneElement(appendDots({ dots }), {
      class: dotsClass,
      on: {
        ...mouseEvents,
      },
    });
  },
};
