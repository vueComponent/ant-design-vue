import '../assets/index.less';
import Slider from '../src/slider';

export default {
  render: function render() {
    var h = arguments[0];

    var settings = {
      props: {
        focusOnSelect: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        speed: 500
      }
    };
    return h('div', [h('h2', ['FocusOnSelect']), h('div', ['Click on any slide to select and make it current slide']), h(
      Slider,
      settings,
      [h('div', [h('h3', ['1'])]), h('div', [h('h3', ['2'])]), h('div', [h('h3', ['3'])]), h('div', [h('h3', ['4'])]), h('div', [h('h3', ['5'])]), h('div', [h('h3', ['6'])])]
    )]);
  }
};