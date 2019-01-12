import { Line, Circle } from '../index';
import '../assets/index.less';

export default {
  data() {
    return {
      percent: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.increase();
    });
  },
  methods: {
    increase() {
      const percent = this.percent + 1;
      if (percent >= 100) {
        clearTimeout(this.tm);
        return;
      }
      this.percent = percent;
      this.tm = setTimeout(this.increase, 10);
    },
    restart() {
      clearTimeout(this.tm);
      this.percent = 0;
      this.$nextTick(() => {
        this.increase();
      });
    },
  },
  render() {
    return (
      <div style="margin: 10px;width: 200px">
        <Circle strokeWidth="6" percent={this.percent} />
        <Line strokeWidth="4" percent={this.percent} />
        <button onClick={this.restart}>Restart</button>
      </div>
    );
  },
};
