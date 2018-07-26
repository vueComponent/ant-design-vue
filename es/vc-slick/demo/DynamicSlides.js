import '../assets/index.less';
import Slider from '../src/slider';

export default {
  data: function data() {
    return {
      slides: [1, 2, 3, 4, 5, 6]
    };
  },

  methods: {
    click: function click() {
      this.slides = this.slides.length === 6 ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [1, 2, 3, 4, 5, 6];
    }
  },
  render: function render() {
    var h = arguments[0];

    var settings = {
      props: {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3
      }
    };
    return h('div', [h('h2', ['Dynamic slides']), h(
      'button',
      { 'class': 'button', on: {
          'click': this.click
        }
      },
      ['Click to change slide count']
    ), h(
      Slider,
      settings,
      [this.slides.map(function (slide) {
        return h(
          'div',
          { key: slide },
          [h('h3', [slide])]
        );
      })]
    )]);
  }
};