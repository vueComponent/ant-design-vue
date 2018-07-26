import '../assets/index.less';
import Slider from '../src/slider';

export default {
  data: function data() {
    return {
      activeSlide: 0,
      activeSlide2: 0
    };
  },
  render: function render() {
    var _this = this;

    var h = arguments[0];

    var settings = {
      props: {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        beforeChange: function beforeChange(current, next) {
          _this.activeSlide = next;
        },
        afterChange: function afterChange(current) {
          _this.activeSlide2 = current;
        }
      }
    };
    return h('div', [h('h2', ['beforeChange and afterChange hooks']), h('p', ['BeforeChange => activeSlide: ', h('strong', [this.activeSlide])]), h('p', ['AfterChange => activeSlide: ', h('strong', [this.activeSlide2])]), h(
      Slider,
      settings,
      [h('div', [h('h3', ['1'])]), h('div', [h('h3', ['2'])]), h('div', [h('h3', ['3'])]), h('div', [h('h3', ['4'])]), h('div', [h('h3', ['5'])]), h('div', [h('h3', ['6'])])]
    )]);
  }
};