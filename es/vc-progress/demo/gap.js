import { Circle } from '../index';
import '../assets/index.less';

export default {
  data: function data() {
    return {
      percent: 30,
      color: '#3FC7FA'
    };
  },

  methods: {
    changeState: function changeState() {
      var colorMap = ['#3FC7FA', '#85D262', '#FE8C6A'];
      var value = parseInt(Math.random() * 100, 10);
      this.percent = value;
      this.color = colorMap[parseInt(Math.random() * 3, 10)];
    }
  },
  render: function render() {
    var h = arguments[0];

    var circleContainerStyle = {
      width: '200px',
      height: '200px'
    };
    return h('div', [h(
      'div',
      { style: circleContainerStyle },
      [h(Circle, {
        attrs: {
          percent: this.percent,
          gapDegree: '70',
          gapPosition: 'top',
          strokeWidth: '6',
          strokeLinecap: 'square',
          strokeColor: this.color
        }
      })]
    ), h(
      'div',
      { style: circleContainerStyle },
      [h(Circle, {
        attrs: {
          percent: this.percent,
          gapDegree: '70',
          gapPosition: 'bottom',
          strokeWidth: '6',
          strokeLinecap: 'square',
          strokeColor: this.color
        }
      })]
    ), h(
      'div',
      { style: circleContainerStyle },
      [h(Circle, {
        attrs: {
          percent: this.percent,
          gapDegree: '70',
          gapPosition: 'left',
          strokeWidth: '6',
          strokeLinecap: 'square',
          strokeColor: this.color
        }
      })]
    ), h(
      'div',
      { style: circleContainerStyle },
      [h(Circle, {
        attrs: {
          percent: this.percent,
          gapDegree: '70',
          gapPosition: 'right',
          strokeWidth: '6',
          strokeLinecap: 'square',
          strokeColor: this.color
        }
      })]
    ), h('p', [h(
      'button',
      {
        on: {
          'click': this.changeState
        }
      },
      ['Change State']
    )])]);
  }
};