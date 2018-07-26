import '../assets/index.less';
import Slider from '../src/slider';

export default {
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
    return h('div', [h('h2', [' Multiple items ']), h(
      Slider,
      settings,
      [h('div', [h('h3', ['1'])]), h('div', [h('h3', ['2'])]), h('div', [h('h3', ['3'])]), h('div', [h('h3', ['4'])]), h('div', [h('h3', ['5'])]), h('div', [h('h3', ['6'])]), h('div', [h('h3', ['7'])]), h('div', [h('h3', ['8'])]), h('div', [h('h3', ['9'])])]
    )]);
  }
};