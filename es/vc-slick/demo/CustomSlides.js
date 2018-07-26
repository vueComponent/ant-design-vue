import '../assets/index.less';
import Slider from '../src/slider';

var CustomSlide = {
  props: ['index'],
  render: function render() {
    var h = arguments[0];

    return h('div', [h('h3', [this.index])]);
  }
};

export default {
  render: function render() {
    var h = arguments[0];

    var settings = {
      props: {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      }
    };
    return h('div', [h('h2', ['Custom Slides']), h(
      Slider,
      settings,
      [h(CustomSlide, {
        attrs: { index: 1 }
      }), h(CustomSlide, {
        attrs: { index: 2 }
      }), h(CustomSlide, {
        attrs: { index: 3 }
      }), h(CustomSlide, {
        attrs: { index: 4 }
      }), h(CustomSlide, {
        attrs: { index: 5 }
      }), h(CustomSlide, {
        attrs: { index: 6 }
      })]
    )]);
  }
};