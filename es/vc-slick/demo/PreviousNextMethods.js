import '../assets/index.less';
import Slider from '../src/slider';

export default {
  methods: {
    next: function next() {
      this.$refs.slider.slickNext();
    },
    previous: function previous() {
      this.$refs.slider.slickPrev();
    }
  },
  render: function render() {
    var h = arguments[0];

    var settings = {
      props: {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      },
      ref: 'slider'
    };
    return h('div', [h('h2', ['Previous and Next methods']), h(
      Slider,
      settings,
      [h(
        'div',
        { key: 1 },
        [h('h3', ['1'])]
      ), h(
        'div',
        { key: 2 },
        [h('h3', ['2'])]
      ), h(
        'div',
        { key: 3 },
        [h('h3', ['3'])]
      ), h(
        'div',
        { key: 4 },
        [h('h3', ['4'])]
      ), h(
        'div',
        { key: 5 },
        [h('h3', ['5'])]
      ), h(
        'div',
        { key: 6 },
        [h('h3', ['6'])]
      )]
    ), h(
      'div',
      { style: { textAlign: 'center' } },
      [h(
        'button',
        { 'class': 'button', on: {
            'click': this.previous
          }
        },
        ['Previous']
      ), h(
        'button',
        { 'class': 'button', on: {
            'click': this.next
          }
        },
        ['Next']
      )]
    )]);
  }
};