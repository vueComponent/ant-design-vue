import _extends from 'babel-runtime/helpers/extends';
import '../assets/index.less';
import Slider from '../src/slider';

export default {
  render: function render(h) {
    var settings = {
      props: {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1
      },
      scopedSlots: {
        nextArrow: function nextArrow(props) {
          var className = props['class'],
              style = props.style,
              click = props.on.click;

          return h('div', {
            'class': className,
            style: _extends({}, style, { display: 'block', background: 'red' }),
            on: {
              'click': click
            }
          });
        },
        prevArrow: function prevArrow(props) {
          var className = props['class'],
              style = props.style,
              click = props.on.click;

          return h('div', {
            'class': className,
            style: _extends({}, style, { display: 'block', background: 'green' }),
            on: {
              'click': click
            }
          });
        }
      }
    };
    return h('div', [h('h2', ['Custom Arrows']), h(
      Slider,
      settings,
      [h('div', [h('h3', ['1'])]), h('div', [h('h3', ['2'])]), h('div', [h('h3', ['3'])]), h('div', [h('h3', ['4'])]), h('div', [h('h3', ['5'])]), h('div', [h('h3', ['6'])])]
    )]);
  }
};