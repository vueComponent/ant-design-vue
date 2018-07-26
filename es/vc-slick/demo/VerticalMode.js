import '../assets/index.less';
import Slider from '../src/slider';

export default {
  render: function render() {
    var h = arguments[0];

    var settings = {
      props: {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        vertical: true,
        verticalSwiping: true,
        beforeChange: function beforeChange(currentSlide, nextSlide) {
          console.log('before change', currentSlide, nextSlide);
        },
        afterChange: function afterChange(currentSlide) {
          console.log('after change', currentSlide);
        }
      }
    };
    return h('div', [h('h2', ['Vertical Mode']), h(
      Slider,
      settings,
      [h('div', [h('h3', ['1'])]), h('div', [h('h3', ['2'])]), h('div', [h('h3', ['3'])]), h('div', [h('h3', ['4'])]), h('div', [h('h3', ['5'])]), h('div', [h('h3', ['6'])])]
    )]);
  }
};