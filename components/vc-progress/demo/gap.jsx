import { Circle } from '../index';
import '../assets/index.less';

export default {
  data() {
    return {
      percent: 30,
      color: '#3FC7FA',
    };
  },
  methods: {
    changeState() {
      const colorMap = ['#3FC7FA', '#85D262', '#FE8C6A'];
      const value = parseInt(Math.random() * 100, 10);
      this.percent = value;
      this.color = colorMap[parseInt(Math.random() * 3, 10)];
    },
  },
  render() {
    const circleContainerStyle = {
      width: '200px',
      height: '200px',
    };
    return (
      <div>
        <div style={circleContainerStyle}>
          <Circle
            percent={this.percent}
            gapDegree="70"
            gapPosition="top"
            strokeWidth="6"
            strokeLinecap="square"
            strokeColor={this.color}
          />
        </div>
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
        <p>
          <button onClick={this.changeState}>Change State</button>
        </p>
      </div>
    );
  },
};
