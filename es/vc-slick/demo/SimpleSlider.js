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
        slidesToShow: 1,
        slidesToScroll: 1
      }
    };
    return h(
      'div',
      { style: { width: '80%', margin: '0 auto' } },
      [h('h2', [' Single Item']), h(
        Slider,
        settings,
        [h(
          'div',
          {
            on: {
              'click': function click(e) {
                return alert(e);
              }
            }
          },
          [h('h3', ['1'])]
        ), h('div', [h('h3', ['2'])]), h('div', [h('h3', ['3'])]), h('div', [h('h3', ['4'])]), h('div', [h('h3', ['5'])]), h('div', [h('h3', ['6'])])]
      )]
    );
  }
};