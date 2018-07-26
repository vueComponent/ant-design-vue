import '../assets/index.less';
import Slider from '../src/slider';
import imgList from './imglist';

var abstract01 = imgList.abstract01,
    abstract02 = imgList.abstract02,
    abstract03 = imgList.abstract03,
    abstract04 = imgList.abstract04;


export default {
  data: function data() {
    return {
      slideIndex: 0,
      updateCount: 0
    };
  },
  render: function render() {
    var _this = this;

    var h = arguments[0];

    var settings = {
      props: {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: function afterChange() {
          _this.updateCount = _this.updateCount + 1;
        },
        beforeChange: function beforeChange(current, next) {
          _this.slideIndex = next;
        }
      },
      ref: 'slider'
    };
    return h('div', [h('h2', ['Slick Go To']), h('p', ['Total updates: ', this.updateCount, ' ']), h('input', {
      on: {
        'input': function input(e) {
          return _this.$refs.slider.slickGoTo(e.target.value);
        }
      },
      domProps: {
        'value': this.slideIndex
      },
      attrs: {
        type: 'range',
        min: 0,
        max: 3
      }
    }), h(
      Slider,
      settings,
      [h('div', [h('img', {
        attrs: { src: abstract01 }
      })]), h('div', [h('img', {
        attrs: { src: abstract02 }
      })]), h('div', [h('img', {
        attrs: { src: abstract03 }
      })]), h('div', [h('img', {
        attrs: { src: abstract04 }
      })])]
    )]);
  }
};