import { Circle } from '../index';
import '../assets/index.less';

const colorMap = ['#3FC7FA', '#85D262', '#FE8C6A'];
function getColor(index) {
  return colorMap[(index + colorMap.length) % colorMap.length];
}

export default {
  data() {
    return {
      percent: 30,
      colorIndex: 0,
    };
  },
  methods: {
    changeState() {
      const value = parseInt(Math.random() * 100, 10);
      const colorIndex = parseInt(Math.random() * 3, 10);
      this.percent = value;
      this.colorIndex = colorIndex;
    },
  },
  render() {
    const circleContainerStyle = {
      width: '200px',
      height: '200px',
    };
    const { percent, colorIndex } = this;
    const color = getColor(colorIndex);
    return (
      <div>
        <p>
          <button onClick={this.changeState}>Change State [{percent}]</button>
        </p>
        <div style={circleContainerStyle}>
          <Circle
            percent={this.percent}
            gapDegree="70"
            gapPosition="bottom"
            strokeWidth="6"
            strokeLinecap="square"
            strokeColor={this.color}
          />
        </div>
        <div style={circleContainerStyle}>
          <Circle
            percent={[percent / 3, percent / 3, percent / 3]}
            gapDegree="70"
            gapPosition="bottom"
            strokeWidth="6"
            trailWidth="6"
            strokeLinecap="round"
            strokeColor={[color, getColor(colorIndex + 1), getColor(colorIndex + 2)]}
          />
        </div>
        <div style={circleContainerStyle}>
          <Circle
            percent={this.percent}
            gapDegree="70"
            gapPosition="left"
            strokeWidth="6"
            strokeLinecap="square"
            strokeColor={this.color}
          />
        </div>
        <div style={circleContainerStyle}>
          <Circle
            percent={this.percent}
            gapDegree="70"
            gapPosition="right"
            strokeWidth="6"
            strokeLinecap="square"
            strokeColor={this.color}
          />
        </div>
      </div>
    );
  },
};
