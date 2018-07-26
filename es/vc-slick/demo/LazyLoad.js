import '../assets/index.less';
import Slider from '../src/slider';
import imgList from './imglist';

var abstract01 = imgList.abstract01,
    abstract02 = imgList.abstract02,
    abstract03 = imgList.abstract03,
    abstract04 = imgList.abstract04;


export default {
  render: function render() {
    var h = arguments[0];

    var settings = {
      props: {
        dots: true,
        lazyLoad: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1
      }
    };
    return h('div', [h('h2', [' Lazy Load']), h(
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