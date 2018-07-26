import { Line, Circle } from '../index';
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

    var containerStyle = {
      width: '250px'
    };
    var circleContainerStyle = {
      width: '250px',
      height: '250px',
      display: 'inline-block'
    };
    return h('div', [h('h3', ['Line Progress ', this.percent, '%']), h(
      'div',
      { style: containerStyle },
      [h(Line, {
        attrs: { percent: this.percent, strokeWidth: '4', strokeColor: this.color }
      })]
    ), h('h3', ['Circle Progress ', this.percent, '%']), h(
      'div',
      { style: circleContainerStyle },
      [h(Circle, {
        attrs: {
          percent: this.percent,
          strokeWidth: '6',
          strokeLinecap: 'round',
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