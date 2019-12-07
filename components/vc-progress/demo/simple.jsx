import { Line, Circle } from '../index';
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
    const { percent, color } = this;
    const containerStyle = {
      width: '250px',
    };
    const circleContainerStyle = {
      width: '250px',
      height: '250px',
      display: 'inline-block',
    };
    return (
      <div>
        <h3>Line Progress {percent}%</h3>
        <div style={containerStyle}>
          <Line percent={percent} strokeWidth="4" strokeColor={color} />
          <Line
            percent={[percent / 2, percent / 2]}
            strokeWidth="4"
            strokeColor={[color, '#CCC']}
          />
        </div>
        <h3>Circle Progress {percent}%</h3>
        <div style={circleContainerStyle}>
          <Circle percent={percent} strokeWidth="6" strokeLinecap="round" strokeColor={color} />
        </div>
        <p>
          <button onClick={this.changeState}>Change State</button>
        </p>
      </div>
    );
  },
};
